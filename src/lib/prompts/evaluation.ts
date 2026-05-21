import type { Role, Level } from "@/types";
import { TOPIC_DISPLAY } from "./constants";

export function buildEvaluationPrompt(params: {
  role: Role;
  level: Level;
  question: string;
  answer: string;
  isCode: boolean;
  topic: string;
}): string {
  const { role, level, question, answer, isCode, topic } = params;
  const answerType = isCode ? "code solution" : "verbal answer";

  return `You are evaluating a ${level} ${role} candidate's ${answerType} for topic: ${TOPIC_DISPLAY[topic] ?? topic}.

Question: ${question}

Candidate's answer:
${answer}

Evaluate the answer on 4 dimensions (0-25 points each):
1. Accuracy (technical correctness)
2. Depth (surface vs deep understanding)
3. Communication (clarity, examples)
4. Practical (real-world application)

Provide:
1. Brief feedback for each dimension (1-2 sentences)
2. A list of strengths (bullet points)
3. A list of areas to improve (bullet points)
4. A short overall summary (2-3 sentences)

End your response with a JSON block in this exact format:
\`\`\`json
{
  "accuracy": <0-25>,
  "depth": <0-25>,
  "communication": <0-25>,
  "practical": <0-25>,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."]
}
\`\`\``;
}
