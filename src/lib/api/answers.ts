export interface SubmitAnswerParams {
  questionId: string;
  text: string;
  isCode: boolean;
}

export interface SavedAnswer {
  id: string;
  text: string;
  isCode: boolean;
  evaluationText?: string | null;
  score?: number | null;
  weaknesses?: string | null;
}

export interface PatchAnswerParams {
  evaluationText: string;
  topicTag: string;
}

/**
 * Persist a candidate's answer for a question.
 */
export async function submitAnswer(
  params: SubmitAnswerParams
): Promise<SavedAnswer> {
  const res = await fetch("/api/answers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return (await res.json()) as SavedAnswer;
}

/**
 * Patch an answer with the evaluation text (and topic) once streaming
 * has finished. The server parses the score / strengths / weaknesses.
 */
export async function patchAnswer(
  answerId: string,
  params: PatchAnswerParams
): Promise<void> {
  await fetch(`/api/answers/${answerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}
