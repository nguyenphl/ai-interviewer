import type { EvalResult } from "@/types";

function buildResult(raw: {
  accuracy?: unknown;
  depth?: unknown;
  communication?: unknown;
  practical?: unknown;
  strengths?: unknown;
  weaknesses?: unknown;
}): EvalResult | null {
  const accuracy = typeof raw.accuracy === "number" ? raw.accuracy : 0;
  const depth = typeof raw.depth === "number" ? raw.depth : 0;
  const communication = typeof raw.communication === "number" ? raw.communication : 0;
  const practical = typeof raw.practical === "number" ? raw.practical : 0;
  const total = accuracy + depth + communication + practical;
  if (total === 0) return null;
  return {
    accuracy,
    depth,
    communication,
    practical,
    total,
    normalizedScore: parseFloat(((total / 100) * 10).toFixed(1)),
    strengths: Array.isArray(raw.strengths) ? (raw.strengths as string[]) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? (raw.weaknesses as string[]) : [],
    summary: "",
  };
}

export function parseEvalJSON(text: string): EvalResult | null {
  // Try ```json ... ``` block first
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (fenced) {
    try {
      return buildResult(JSON.parse(fenced[1]));
    } catch { /* fall through */ }
  }

  // Fallback: find any {...} that contains "accuracy"
  const jsonCandidates = text.matchAll(/\{[\s\S]*?"accuracy"[\s\S]*?\}/g);
  for (const candidate of jsonCandidates) {
    try {
      const parsed = JSON.parse(candidate[0]);
      const result = buildResult(parsed);
      if (result) return result;
    } catch { /* try next */ }
  }

  return null;
}
