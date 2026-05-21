import type { Role, Level, Language, SessionType } from "@/types";
import { TOPIC_DISPLAY } from "./constants";

export function buildQuestionPrompt(params: {
  role: Role;
  level: Level;
  language: Language;
  sessionType: SessionType;
  topic: string;
  orderIndex: number;
  previousTopics: string[];
  interviewMode?: string;
  previousAnswerSummary?: string;
  userModelContext?: string;
  mentorHint?: string;
}): string {
  const { role, level, language, sessionType, topic, orderIndex, previousTopics, interviewMode, previousAnswerSummary, userModelContext, mentorHint } = params;
  const prevStr =
    previousTopics.length > 0
      ? `Previously covered topics: ${previousTopics.join(", ")}. Ask about something different.`
      : "";

  if (interviewMode === "warmup") {
    const phase =
      orderIndex === 0 ? "opening" :
      orderIndex <= 2 ? "early" :
      orderIndex <= 4 ? "mid" : "deep";

    const phaseGuide: Record<string, string> = {
      opening: `Start with a warm, open-ended question about the candidate's background and recent experience with ${TOPIC_DISPLAY[topic] ?? topic}. Ask what they've been working on or what they find most interesting. Keep it conversational — no pressure.`,
      early: `Build on what was discussed. Ask them to describe a specific project or challenge they've faced related to ${TOPIC_DISPLAY[topic] ?? topic}. Let them lead; probe what they bring up naturally.${previousAnswerSummary ? `\nThey mentioned: "${previousAnswerSummary}"` : ""}`,
      mid: `Dig deeper into what they've shared. Ask a more specific technical question about ${TOPIC_DISPLAY[topic] ?? topic} that naturally follows from their experience. The difficulty should feel like ${level} level.${previousAnswerSummary ? `\nContext from their previous answer: "${previousAnswerSummary}"` : ""}`,
      deep: `Now ask a direct, challenging technical question about ${TOPIC_DISPLAY[topic] ?? topic} appropriate for a ${level} ${role} developer. This is the technical deep-dive phase.`,
    };

    return `You are conducting a ${sessionType} interview for a ${level} ${role} developer. Language: ${language}.
Topic area: ${TOPIC_DISPLAY[topic] ?? topic}.
${prevStr}

Interview phase: ${phase}.
${phaseGuide[phase]}
${userModelContext ? `\nCandidate context: ${userModelContext}` : ""}
${mentorHint ? `\nMentor instruction: ${mentorHint}` : ""}
Generate ONE question that fits this phase naturally. Output only the question text, no preamble.`;
  }

  return `You are a technical interviewer conducting a ${sessionType} interview for a ${level} ${role} developer position.
The candidate's preferred language is ${language}.
Current topic: ${TOPIC_DISPLAY[topic] ?? topic}.
${prevStr}
Question ${orderIndex + 1}.
${userModelContext ? `\nCandidate context: ${userModelContext}` : ""}
${mentorHint ? `\nMentor instruction: ${mentorHint}` : ""}
Generate ONE clear, specific technical interview question appropriate for a ${level} level candidate.
The question should be practical and test real-world understanding.
Do not include the answer. Do not number the question. Output only the question text.`;
}

export function buildFollowUpPrompt(params: {
  role: Role;
  level: Level;
  language: Language;
  originalQuestion: string;
  answer: string;
  weaknesses: string[];
  interviewMode?: string;
}): string {
  const { role, level, language, originalQuestion, answer, weaknesses, interviewMode } = params;

  if (interviewMode === "warmup") {
    return `You are a technical interviewer for a ${level} ${role} position. The candidate prefers ${language}.

The conversation so far:
Question: ${originalQuestion}
Their answer: ${answer}

They touched on some areas but didn't go deep enough in: ${weaknesses.join(", ")}.

Generate ONE natural follow-up question that continues the conversation. Pick up on something specific they mentioned and probe deeper — like a curious interviewer would. Keep it conversational, not interrogative.
Output only the question text.`;
  }

  return `You are a technical interviewer for a ${level} ${role} position. The candidate prefers ${language}.

Original question: ${originalQuestion}

Candidate's answer: ${answer}

The candidate showed weakness in: ${weaknesses.join(", ")}.

Generate ONE follow-up question that probes deeper into their weak areas. Be specific and constructive.
Output only the question text.`;
}
