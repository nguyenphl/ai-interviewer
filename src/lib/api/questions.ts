export interface GenerateQuestionParams {
  sessionId: string;
  isFollowUp?: boolean;
  parentId?: string;
  weaknesses?: string[];
  originalQuestion?: string;
  previousAnswer?: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  topicTag: string;
  orderIndex: number;
  isFollowUp: boolean;
}

export type GenerateQuestionResponse = GeneratedQuestion | { error: string };

/**
 * Generate the next question for a session.
 *
 * Returns the parsed JSON body and the original Response so callers
 * can inspect `res.ok` / `res.status` when handling errors.
 */
export async function generateQuestion(
  params: GenerateQuestionParams
): Promise<{ res: Response; data: GenerateQuestionResponse }> {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = (await res.json()) as GenerateQuestionResponse;
  return { res, data };
}
