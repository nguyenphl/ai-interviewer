export interface StreamEvaluationParams {
  role: string;
  level: string;
  question: string;
  answer: string;
  isCode: boolean;
  topic: string;
}

/**
 * Kick off a streaming evaluation request. Returns the reader so
 * callers can consume chunks as they arrive (mirroring the existing
 * inline fetch behavior — no logic change).
 */
export async function streamEvaluation(
  params: StreamEvaluationParams
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.body!.getReader();
}
