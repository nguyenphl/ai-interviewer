import type { InterviewMode, ReviewMode } from "@/types";

export interface CreateSessionParams {
  role: string;
  level: string;
  language: string;
  sessionType: string;
  topic?: string;
  interviewMode?: InterviewMode;
  reviewMode?: ReviewMode;
}

export interface CreatedSession {
  id: string;
}

/**
 * Create a new interview session.
 */
export async function createSession(
  params: CreateSessionParams
): Promise<CreatedSession> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return (await res.json()) as CreatedSession;
}

/**
 * Mark a session as completed and record duration.
 */
export async function completeSession(
  sessionId: string,
  durationSec: number
): Promise<void> {
  await fetch(`/api/sessions/${sessionId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ durationSec }),
  });
}

/**
 * Fetch the list of sessions.
 */
export async function getSessions(): Promise<unknown[]> {
  const res = await fetch("/api/sessions");
  return (await res.json()) as unknown[];
}
