import type { UserModelData } from "@/types";

export function buildSessionDigestPrompt(params: {
  role: string;
  level: string;
  sessionType: string;
  totalScore: number | null;
  qa: { question: string; answer: string; score: number | null; topic: string }[];
}): string {
  const { role, level, sessionType, totalScore, qa } = params;
  const qaText = qa.map((q, i) =>
    `Q${i + 1} [${q.topic}]: ${q.question}\nA: ${q.answer.slice(0, 250)}${q.score != null ? ` (score: ${q.score.toFixed(1)}/10)` : ""}`
  ).join("\n\n");

  return `You are analyzing a ${level} ${role} candidate's ${sessionType} interview session.
Overall score: ${totalScore != null ? totalScore.toFixed(1) + "/10" : "N/A"}

${qaText}

Extract learning signals. Output ONLY valid JSON (no markdown, no explanation):
{
  "answerStyleObservations": ["observation about how they structure/deliver answers"],
  "frameworksUsedOrMissed": [{ "framework": "name", "status": "used|missed", "note": "..." }],
  "mistakesObserved": ["specific mistake or gap observed"],
  "topicsStruggled": [{ "topic": "tag", "concept": "specific concept missed" }],
  "topicsExcelled": ["area they did well"],
  "communicationNotes": ["observation about clarity, depth, examples"],
  "sessionLevel": "junior|mid|senior|staff"
}`;
}

export function buildUserModelMergePrompt(params: {
  currentModel: string;
  sessionDigest: string;
  sessionCount: number;
  role: string;
  level: string;
  recentScore: number | null;
}): string {
  const { currentModel, sessionDigest, sessionCount, role, level, recentScore } = params;
  return `You maintain a persistent learner profile for a ${level} ${role} developer candidate.
Sessions analyzed so far: ${sessionCount}. Recent session score: ${recentScore != null ? recentScore.toFixed(1) + "/10" : "N/A"}.

CURRENT PROFILE:
${currentModel}

NEW SESSION OBSERVATIONS:
${sessionDigest}

Update the profile by merging the new observations. Rules:
- Increase occurrence counts for patterns seen before
- Raise severity of knowledge gaps seen in multiple sessions
- Update trend: "improving" if score trend is up, "declining" if down, "stable" otherwise
- Keep each array max 8 items (remove lowest severity/oldest if over limit)
- recommendedFocus: max 5 items, ordered by priority (1=highest). Mark revisitMistake=true if item targets a recurring mistake
- Preserve confirmed strengths unless new evidence contradicts them
- Be specific and actionable, not generic

Output ONLY a valid JSON object with EXACTLY these keys:
answerStyle, frameworkGaps, recurringMistakes, knowledgeGaps, strengths, communicationPatterns, overallAssessment, recommendedFocus`;
}

export function buildUserModelContext(model: UserModelData): string | undefined {
  if (model.sessionCount === 0) return undefined;

  const parts: string[] = [];

  if (model.overallAssessment.summary) {
    parts.push(`Candidate profile: ${model.overallAssessment.summary}`);
  }

  const topGaps = model.knowledgeGaps
    .filter(g => g.severity === "high")
    .slice(0, 2)
    .map(g => `${g.concept} (${g.topic})`);
  if (topGaps.length > 0) {
    parts.push(`Known weak spots: ${topGaps.join(", ")}`);
  }

  const topMistakes = model.recurringMistakes
    .filter(m => m.occurrences >= 2)
    .slice(0, 2)
    .map(m => m.pattern);
  if (topMistakes.length > 0) {
    parts.push(`Recurring mistakes: ${topMistakes.join("; ")}`);
  }

  return parts.length > 0 ? parts.join(". ") : undefined;
}

export function buildMentorQuestionContext(model: UserModelData, orderIndex: number, maxQ: number): {
  shouldRevisit: boolean;
  revisitContext?: string;
  expandContext?: string;
} {
  if (model.sessionCount === 0) return { shouldRevisit: false };

  const isMiddle = orderIndex > 0 && orderIndex < maxQ - 1;
  const isLast = orderIndex === maxQ - 1;

  const topMistake = model.recurringMistakes
    .sort((a, b) => b.occurrences - a.occurrences)[0];

  const topGap = model.knowledgeGaps
    .filter(g => g.severity === "high")
    .sort((a, b) => b.sessionsSeen - a.sessionsSeen)[0];

  if (isMiddle && topMistake && topMistake.occurrences >= 2) {
    return {
      shouldRevisit: true,
      revisitContext: `The candidate has repeatedly struggled with: "${topMistake.pattern}". Design a question that specifically tests whether they've improved on this.`,
    };
  }

  if (isLast && topGap) {
    return {
      shouldRevisit: false,
      expandContext: `The candidate has gaps in ${topGap.concept} (${topGap.topic}). Ask a question that challenges them to go deeper into this area, potentially expanding into adjacent concepts.`,
    };
  }

  return { shouldRevisit: false };
}
