"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMaxQuestions, shouldFollowUp } from "@/lib/interview/question-engine";
import type { Level, SessionType } from "@/types";
import { generateQuestion } from "@/lib/api/questions";
import { submitAnswer as postAnswer, patchAnswer } from "@/lib/api/answers";
import { streamEvaluation } from "@/lib/api/evaluate";
import { completeSession } from "@/lib/api/sessions";

export interface InterviewAnswer {
  id: string;
  text: string;
  isCode: boolean;
  evaluationText?: string | null;
  score?: number | null;
  weaknesses?: string | null;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  topicTag: string;
  orderIndex: number;
  isFollowUp: boolean;
  answers: InterviewAnswer[];
}

export interface InterviewSession {
  id: string;
  role: string;
  level: string;
  language: string;
  sessionType: string;
  topic?: string | null;
  interviewMode?: string | null;
  reviewMode?: string | null;
  questions: InterviewQuestion[];
}

export type InterviewPhase = "loading" | "answering" | "evaluating" | "done";

interface UseInterviewSessionOptions {
  session: InterviewSession;
  /** Speaks a question aloud (when TTS is enabled). */
  speakText: (text: string) => void;
  /** Reflects the live TTS toggle so loadNextQuestion can decide whether to read aloud. */
  ttsEnabled: boolean;
  /** Stops any in-flight STT before submitting. */
  stopStt: () => void;
}

/**
 * Owns all interview state + side-effects: questions list, current
 * question, phase machine, evaluation streaming, scoring, follow-ups,
 * and finishing the session.
 *
 * Behavior is identical to the original implementation inside
 * `interview-client.tsx`.
 */
export function useInterviewSession({
  session,
  speakText,
  ttsEnabled,
  stopStt,
}: UseInterviewSessionOptions) {
  const router = useRouter();
  const [questions, setQuestions] = useState<InterviewQuestion[]>(session.questions);
  const [currentQ, setCurrentQ] = useState<InterviewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [isCode, setIsCode] = useState(false);
  const [phase, setPhase] = useState<InterviewPhase>("loading");
  const [evalText, setEvalText] = useState("");
  const [evalResult, setEvalResult] = useState<{ score: number; strengths: string[]; weaknesses: string[] } | null>(null);
  const [pendingFollowUp, setPendingFollowUp] = useState<null | { isFollowUp: true; parentId: string; weaknesses: string[]; originalQuestion: string; previousAnswer: string }>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(session.questions.length);
  const [loadError, setLoadError] = useState<string | null>(null);
  const startTimeRef = useRef(Date.now());
  const [startTime] = useState(() => Date.now());
  const evalRef = useRef<HTMLDivElement>(null);
  const initDone = useRef(false);

  const maxQ = getMaxQuestions(session.sessionType as SessionType, session.level as Level);

  const loadNextQuestion = useCallback(
    async (opts?: {
      isFollowUp?: boolean;
      parentId?: string;
      weaknesses?: string[];
      originalQuestion?: string;
      previousAnswer?: string;
    }) => {
      setPhase("loading");
      setAnswer("");
      setEvalText("");
      setEvalResult(null);
      setCurrentScore(null);
      setIsCode(false);
      setLoadError(null);
      try {
        const { res, data } = await generateQuestion({ sessionId: session.id, ...opts });
        if (!res.ok || "error" in data) {
          setLoadError(("error" in data ? data.error : null) ?? `HTTP ${res.status}`);
          setPhase("answering");
          return;
        }
        const q = { ...(data as InterviewQuestion), answers: [] as InterviewAnswer[] };
        setQuestions((prev) => [...prev, q]);
        setCurrentQ(q);
        setQuestionCount((n) => n + 1);
        setPhase("answering");
        if (ttsEnabled) speakText(q.text);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load question");
        setPhase("answering");
      }
    },
    [session.id, ttsEnabled, speakText]
  );

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    if (questions.length === 0) {
      loadNextQuestion();
    } else {
      const last = questions[questions.length - 1];
      if (last.answers.length === 0) {
        setCurrentQ(last);
        setPhase("answering");
      } else {
        loadNextQuestion();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!currentQ || !answer.trim()) return;
    stopStt();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setPhase("evaluating");
    setEvalText("");
    setCurrentScore(null);

    const savedAnswer = await postAnswer({
      questionId: currentQ.id,
      text: answer,
      isCode,
    });

    const reader = await streamEvaluation({
      role: session.role,
      level: session.level,
      question: currentQ.text,
      answer,
      isCode,
      topic: currentQ.topicTag,
    });

    let fullEval = "";
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullEval += chunk;
      setEvalText((t) => t + chunk);
      evalRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    await patchAnswer(savedAnswer.id, {
      evaluationText: fullEval,
      topicTag: currentQ.topicTag,
    });

    const { parseEvalJSON } = await import("@/lib/interview/scoring-parser");
    const result = parseEvalJSON(fullEval);
    if (result) {
      setCurrentScore(result.normalizedScore);
      setEvalResult({ score: result.normalizedScore, strengths: result.strengths, weaknesses: result.weaknesses });
    }

    const isLastQ = questionCount >= maxQ;
    if (!isLastQ && result && shouldFollowUp(result.normalizedScore, session.interviewMode ?? "direct")) {
      setPendingFollowUp({
        isFollowUp: true,
        parentId: currentQ.id,
        weaknesses: result.weaknesses,
        originalQuestion: currentQ.text,
        previousAnswer: answer,
      });
    }

    setPhase("done");
  }, [currentQ, answer, isCode, session.role, session.level, session.interviewMode, questionCount, maxQ, stopStt]);

  const handleNext = useCallback(() => {
    if (pendingFollowUp) {
      loadNextQuestion(pendingFollowUp);
    } else {
      loadNextQuestion();
    }
    setPendingFollowUp(null);
    setEvalResult(null);
  }, [pendingFollowUp, loadNextQuestion]);

  const finishSession = useCallback(async () => {
    const durationSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    await completeSession(session.id, durationSec);
    router.push(`/sessions/${session.id}/review`);
  }, [session.id, router]);

  return {
    // state
    questions,
    currentQ,
    answer,
    setAnswer,
    isCode,
    setIsCode,
    phase,
    evalText,
    evalResult,
    pendingFollowUp,
    currentScore,
    questionCount,
    loadError,
    setLoadError,
    startTime,
    evalRef,
    initDone,
    maxQ,
    // actions
    loadNextQuestion,
    submitAnswer,
    handleNext,
    finishSession,
  };
}
