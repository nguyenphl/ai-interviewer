import prisma from '@/lib/db/prisma';
import { generateAnalysis } from '@/lib/llm/ollama';
import { buildSessionDigestPrompt, buildUserModelMergePrompt } from '@/lib/prompts';
import type { UserModelData, AnswerStyleData, CommunicationPatterns, OverallAssessment } from "@/types";

const SINGLETON_ID = "singleton";

function safeParseArray<T>(json: string, fallback: T[] = []): T[] {
  try { const r = JSON.parse(json); return Array.isArray(r) ? r : fallback; } catch { return fallback; }
}

function safeParseObject<T>(json: string, fallback: T): T {
  try { const r = JSON.parse(json); return (r && typeof r === "object" && !Array.isArray(r)) ? r as T : fallback; } catch { return fallback; }
}

export function deserializeUserModel(raw: {
  answerStyle: string; frameworkGaps: string; recurringMistakes: string;
  knowledgeGaps: string; strengths: string; communicationPatterns: string;
  overallAssessment: string; recommendedFocus: string;
  sessionCount: number; lastUpdatedAt: Date; createdAt: Date; id: string;
}): UserModelData {
  return {
    answerStyle: normalizeAnswerStyle(safeParseObject<Record<string, unknown>>(raw.answerStyle, {})),
    frameworkGaps: normalizeFrameworkGaps(safeParseArray(raw.frameworkGaps)),
    recurringMistakes: normalizeRecurringMistakes(safeParseArray(raw.recurringMistakes)),
    knowledgeGaps: normalizeKnowledgeGaps(safeParseArray(raw.knowledgeGaps)),
    strengths: normalizeStrengths(safeParseArray(raw.strengths)),
    communicationPatterns: normalizeCommunicationPatterns(safeParseObject<Record<string, unknown>>(raw.communicationPatterns, {})),
    overallAssessment: safeParseObject<OverallAssessment>(raw.overallAssessment, {}),
    recommendedFocus: normalizeRecommendedFocus(safeParseArray(raw.recommendedFocus)),
    sessionCount: raw.sessionCount,
    lastUpdatedAt: raw.lastUpdatedAt.toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRecommendedFocus(raw: any[]) {
  return raw
    .map((item) => ({
      area: item.area ?? item.concept ?? item.topic ?? "",
      reason: item.reason ?? item.note ?? "",
      priority: typeof item.priority === "number" ? item.priority : 1,
      revisitMistake: item.revisitMistake ?? false,
    }))
    .filter((item) => item.area.trim().length > 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeRecurringMistakes(raw: any[]) {
  return raw
    .map((item) =>
      typeof item === "string"
        ? { pattern: item, occurrences: 1, lastSeen: new Date().toISOString() }
        : {
            pattern: item.pattern ?? item.description ?? item.mistake ?? "",
            occurrences: typeof item.occurrences === "number" ? item.occurrences : 1,
            lastSeen: item.lastSeen ?? new Date().toISOString(),
          }
    )
    .filter((item) => item.pattern.trim().length > 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeKnowledgeGaps(raw: any[]) {
  return raw
    .map((item) => ({
      topic: item.topic ?? "",
      concept: item.concept ?? item.description ?? "",
      severity: (["low", "medium", "high"] as const).includes(item.severity) ? item.severity : "medium",
      sessionsSeen: typeof item.sessionsSeen === "number" ? item.sessionsSeen : 1,
    }))
    .filter((item) => item.concept.trim().length > 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStrengths(raw: any[]) {
  return raw
    .map((item) =>
      typeof item === "string"
        ? { area: item, confidence: "medium" as const, sessionsSeen: 1 }
        : {
            area: item.area ?? item.description ?? "",
            confidence: (["low", "medium", "high"] as const).includes(item.confidence) ? item.confidence : "medium",
            sessionsSeen: typeof item.sessionsSeen === "number" ? item.sessionsSeen : 1,
          }
    )
    .filter((item) => item.area.trim().length > 0);
}

function normalizeAnswerStyle(raw: Record<string, unknown>): AnswerStyleData {
  const knownKeys = ["verbosity", "usesExamples", "structuredThinking", "codeVsConceptualBias", "notes"];
  const hasKnownKeys = knownKeys.some((k) => k in raw);
  if (hasKnownKeys) return raw as AnswerStyleData;
  // LLM returned freeform { "observation": count } — join keys as notes
  const notes = Object.keys(raw).filter((k) => typeof k === "string" && k.length > 3).join(" ");
  return notes ? { notes } : {};
}

function normalizeCommunicationPatterns(raw: Record<string, unknown>): CommunicationPatterns {
  const knownKeys = ["clarityScore", "usesAnalogies", "averageAnswerDepth", "notes"];
  const hasKnownKeys = knownKeys.some((k) => k in raw);
  if (hasKnownKeys) return raw as CommunicationPatterns;
  const notes = Object.keys(raw).filter((k) => typeof k === "string" && k.length > 3).join(" ");
  return notes ? { notes } : {};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeFrameworkGaps(raw: any[]) {
  return raw
    .map((item) => ({
      framework: item.framework ?? item.name ?? "",
      severity: (["low", "medium", "high"] as const).includes(item.severity) ? item.severity : "medium",
      evidence: item.evidence ?? item.note ?? item.notes ?? "",
    }))
    .filter((item) => item.framework.trim().length > 0 && item.framework.toLowerCase() !== "none");
}

function extractJSON(text: string): unknown {
  // Try fenced block first
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) {
    try { return JSON.parse(fenced[1]); } catch { /* fall through */ }
  }
  // Try raw JSON object
  const raw = text.match(/\{[\s\S]*\}/);
  if (raw) {
    try { return JSON.parse(raw[0]); } catch { /* fall through */ }
  }
  return null;
}

export async function getOrCreateUserModel() {
  return prisma.userModel.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID },
    update: {},
  });
}

export async function updateUserModel(sessionId: string): Promise<void> {
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          orderBy: { orderIndex: "asc" },
          include: { answers: { orderBy: { submittedAt: "asc" }, take: 1 } },
        },
      },
    });
    if (!session) return;

    const qa = session.questions
      .filter(q => q.answers.length > 0)
      .map(q => ({
        question: q.text,
        answer: q.answers[0].text,
        score: q.answers[0].score,
        topic: q.topicTag,
      }));

    if (qa.length === 0) return;

    // Phase A: digest the session
    const digestPrompt = buildSessionDigestPrompt({
      role: session.role,
      level: session.level,
      sessionType: session.sessionType,
      totalScore: session.totalScore,
      qa,
    });

    const digestRaw = await generateAnalysis(digestPrompt);
    const digest = extractJSON(digestRaw);
    if (!digest) {
      console.error("[user-model] failed to parse session digest");
      return;
    }

    // Phase B: merge into user model
    const current = await getOrCreateUserModel();
    const currentModel = deserializeUserModel(current);

    const mergePrompt = buildUserModelMergePrompt({
      currentModel: JSON.stringify({
        answerStyle: currentModel.answerStyle,
        frameworkGaps: currentModel.frameworkGaps,
        recurringMistakes: currentModel.recurringMistakes,
        knowledgeGaps: currentModel.knowledgeGaps,
        strengths: currentModel.strengths,
        communicationPatterns: currentModel.communicationPatterns,
        overallAssessment: currentModel.overallAssessment,
        recommendedFocus: currentModel.recommendedFocus,
      }),
      sessionDigest: JSON.stringify(digest),
      sessionCount: current.sessionCount,
      role: session.role,
      level: session.level,
      recentScore: session.totalScore,
    });

    const mergedRaw = await generateAnalysis(mergePrompt);
    const merged = extractJSON(mergedRaw) as Record<string, unknown> | null;
    if (!merged) {
      console.error("[user-model] failed to parse merged model");
      return;
    }

    await prisma.userModel.upsert({
      where: { id: SINGLETON_ID },
      create: {
        id: SINGLETON_ID,
        answerStyle: JSON.stringify(merged.answerStyle ?? {}),
        frameworkGaps: JSON.stringify(merged.frameworkGaps ?? []),
        recurringMistakes: JSON.stringify(merged.recurringMistakes ?? []),
        knowledgeGaps: JSON.stringify(merged.knowledgeGaps ?? []),
        strengths: JSON.stringify(merged.strengths ?? []),
        communicationPatterns: JSON.stringify(merged.communicationPatterns ?? {}),
        overallAssessment: JSON.stringify(merged.overallAssessment ?? {}),
        recommendedFocus: JSON.stringify(merged.recommendedFocus ?? []),
        sessionCount: 1,
        lastUpdatedAt: new Date(),
      },
      update: {
        answerStyle: JSON.stringify(merged.answerStyle ?? {}),
        frameworkGaps: JSON.stringify(merged.frameworkGaps ?? []),
        recurringMistakes: JSON.stringify(merged.recurringMistakes ?? []),
        knowledgeGaps: JSON.stringify(merged.knowledgeGaps ?? []),
        strengths: JSON.stringify(merged.strengths ?? []),
        communicationPatterns: JSON.stringify(merged.communicationPatterns ?? {}),
        overallAssessment: JSON.stringify(merged.overallAssessment ?? {}),
        recommendedFocus: JSON.stringify(merged.recommendedFocus ?? []),
        sessionCount: { increment: 1 },
        lastUpdatedAt: new Date(),
      },
    });

    console.log("[user-model] updated successfully for session", sessionId);
  } catch (err) {
    console.error("[user-model] update failed:", err instanceof Error ? err.message : err);
  }
}
