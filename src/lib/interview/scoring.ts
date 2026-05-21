import type { EvalResult } from "@/types";
import prisma from '@/lib/db/prisma';
import { TOPIC_DISPLAY } from '@/lib/prompts';

export function parseEvalJSON(text: string): EvalResult | null {
  function build(raw: Record<string, unknown>): EvalResult | null {
    const accuracy = typeof raw.accuracy === "number" ? raw.accuracy : 0;
    const depth = typeof raw.depth === "number" ? raw.depth : 0;
    const communication = typeof raw.communication === "number" ? raw.communication : 0;
    const practical = typeof raw.practical === "number" ? raw.practical : 0;
    const total = accuracy + depth + communication + practical;
    if (total === 0) return null;
    return {
      accuracy, depth, communication, practical, total,
      normalizedScore: parseFloat(((total / 100) * 10).toFixed(1)),
      strengths: Array.isArray(raw.strengths) ? raw.strengths as string[] : [],
      weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses as string[] : [],
      summary: "",
    };
  }

  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (fenced) {
    try { const r = build(JSON.parse(fenced[1])); if (r) return r; } catch { /* fall through */ }
  }

  for (const m of text.matchAll(/\{[\s\S]*?"accuracy"[\s\S]*?\}/g)) {
    try { const r = build(JSON.parse(m[0])); if (r) return r; } catch { /* try next */ }
  }

  return null;
}

export async function updateTopicStat(tag: string, score: number): Promise<void> {
  const existing = await prisma.topicStat.findUnique({ where: { tag } });
  if (existing) {
    const newTotal = existing.totalScore + score;
    const newCount = existing.totalAnswers + 1;
    await prisma.topicStat.update({
      where: { tag },
      data: {
        totalAnswers: newCount,
        totalScore: newTotal,
        avgScore: parseFloat((newTotal / newCount).toFixed(2)),
        lastSeenAt: new Date(),
      },
    });
  } else {
    await prisma.topicStat.create({
      data: {
        tag,
        displayName: TOPIC_DISPLAY[tag] ?? tag,
        totalAnswers: 1,
        totalScore: score,
        avgScore: score,
        lastSeenAt: new Date(),
      },
    });
  }
}
