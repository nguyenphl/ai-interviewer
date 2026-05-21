import type { Role, Level, SessionType } from "@/types";
import { TOPIC_MAP } from '@/lib/prompts';

export function getSessionTopics(role: Role, requestedTopic?: string): string[] {
  const all = TOPIC_MAP[role] ?? [];
  if (requestedTopic) {
    const idx = all.indexOf(requestedTopic);
    if (idx >= 0) {
      return [requestedTopic, ...all.filter((t) => t !== requestedTopic)];
    }
  }
  return [...all].sort(() => Math.random() - 0.5);
}

export function getMaxQuestions(sessionType: SessionType, level: Level): number {
  const base: Record<SessionType, number> = {
    technical: 8,
    "system-design": 4,
    behavioral: 6,
    mixed: 6,
  };
  const modifier: Record<Level, number> = {
    junior: -1,
    mid: 0,
    senior: 1,
    staff: 2,
  };
  return Math.max(3, (base[sessionType] ?? 6) + (modifier[level] ?? 0));
}

export function shouldFollowUp(score: number, interviewMode?: string): boolean {
  if (interviewMode === "warmup") return score < 7; // dig deeper more often
  return score < 5;
}

export function getTopicForIndex(
  topics: string[],
  questionIndex: number,
  maxQuestions: number
): string {
  const topicsToUse = Math.min(topics.length, maxQuestions);
  const topicIndex = Math.floor((questionIndex / maxQuestions) * topicsToUse);
  return topics[Math.min(topicIndex, topics.length - 1)];
}
