export type Role =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "data-engineer"
  | "ml-engineer";

export type Level = "junior" | "mid" | "senior" | "staff";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "java"
  | "rust"
  | "cpp"
  | "csharp";

export type SessionType = "technical" | "system-design" | "behavioral" | "mixed";
export type InterviewMode = "warmup" | "direct";
export type ReviewMode = "per-question" | "end-only";

export type SessionStatus = "active" | "completed" | "abandoned";

export interface SessionSummary {
  id: string;
  role: Role;
  level: Level;
  language: Language;
  sessionType: SessionType;
  topic?: string;
  status: SessionStatus;
  totalScore?: number;
  durationSec?: number;
  createdAt: string;
  completedAt?: string;
  _count?: { questions: number };
}

export interface QuestionData {
  id: string;
  sessionId: string;
  text: string;
  topicTag: string;
  difficulty: string;
  orderIndex: number;
  isFollowUp: boolean;
  parentId?: string;
  answers: AnswerData[];
}

export interface AnswerData {
  id: string;
  questionId: string;
  text: string;
  isCode: boolean;
  submittedAt: string;
  evaluationText?: string;
  score?: number;
  strengths?: string;
  weaknesses?: string;
}

export interface EvalResult {
  accuracy: number;
  depth: number;
  communication: number;
  practical: number;
  total: number;
  normalizedScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

export interface TopicStatData {
  id: string;
  tag: string;
  displayName: string;
  totalAnswers: number;
  totalScore: number;
  avgScore: number;
  lastSeenAt: string;
}

export interface FrameworkGap {
  framework: string;
  severity: "low" | "medium" | "high";
  evidence: string;
}

export interface RecurringMistake {
  pattern: string;
  occurrences: number;
  lastSeen: string;
}

export interface KnowledgeGap {
  topic: string;
  concept: string;
  severity: "low" | "medium" | "high";
  sessionsSeen: number;
}

export interface StrengthEntry {
  area: string;
  confidence: "low" | "medium" | "high";
  sessionsSeen: number;
}

export interface AnswerStyleData {
  verbosity?: "too_verbose" | "balanced" | "too_brief";
  usesExamples?: boolean;
  structuredThinking?: boolean;
  codeVsConceptualBias?: "code_heavy" | "balanced" | "conceptual_heavy";
  notes?: string;
}

export interface CommunicationPatterns {
  clarityScore?: number;
  usesAnalogies?: boolean;
  averageAnswerDepth?: "surface" | "adequate" | "deep";
  notes?: string;
}

export interface OverallAssessment {
  estimatedLevel?: string;
  readinessScore?: number;
  trend?: "improving" | "stable" | "declining";
  summary?: string;
}

export interface RecommendedFocusItem {
  area: string;
  reason: string;
  priority: number;
  revisitMistake?: boolean;
}

export interface UserModelData {
  answerStyle: AnswerStyleData;
  frameworkGaps: FrameworkGap[];
  recurringMistakes: RecurringMistake[];
  knowledgeGaps: KnowledgeGap[];
  strengths: StrengthEntry[];
  communicationPatterns: CommunicationPatterns;
  overallAssessment: OverallAssessment;
  recommendedFocus: RecommendedFocusItem[];
  sessionCount: number;
  lastUpdatedAt: string;
}

export interface ScoreTrendPoint {
  index: number;
  score: number;
  date: string;
  role: string;
}

export interface DashboardStats {
  totalSessions: number;
  avgScore: number;
  streak: number;
  topicStats: TopicStatData[];
  recentSessions: SessionSummary[];
  activityDates: { date: string; count: number }[];
  scoreTrend: ScoreTrendPoint[];
}
