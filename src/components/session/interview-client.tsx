"use client";
import { useEffect, useRef } from "react";
import { ThinkingIndicator } from "./thinking-indicator";
import { InterviewHeader } from "./interview-header";
import { QuestionCard } from "./question-card";
import { AnswerSection } from "./answer-section";
import { EvalCard } from "./eval-card";
import { AlertCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { useTts } from "@/hooks/use-tts";
import { useStt } from "@/hooks/use-stt";
import {
  useInterviewSession,
  type InterviewSession,
} from "@/hooks/use-interview-session";

export function InterviewClient({ session: initial }: { session: InterviewSession }) {
  const { ttsEnabled, speakText, toggleTts } = useTts();

  // Forward-ref the STT stop fn so the interview hook can invoke it
  // inside submitAnswer without creating a circular hook dependency.
  const stopSttRef = useRef<() => void>(() => {});

  const interview = useInterviewSession({
    session: initial,
    speakText,
    ttsEnabled,
    stopStt: () => stopSttRef.current(),
  });

  const stt = useStt({ answer: interview.answer, setAnswer: interview.setAnswer });
  
  useEffect(() => {
    stopSttRef.current = stt.stopStt;
  }, [stt.stopStt]);

  const session = initial;
  const {
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
    maxQ,
    loadNextQuestion,
    submitAnswer,
    handleNext,
    finishSession,
  } = interview;

  // Strip JSON block from eval text for display
  const feedbackText = evalText.replace(/```json[\s\S]*?```/g, "").trim();
  const isEndOnly = session.reviewMode === "end-only";

  const progress = Math.min(100, (questionCount / maxQ) * 100);
  const isLastQuestion = questionCount >= maxQ;

  const handleToggleTts = () => {
    toggleTts();
  };

  return (
    <div className="min-h-full flex flex-col">
      <InterviewHeader
        role={session.role}
        level={session.level}
        sessionType={session.sessionType}
        progress={progress}
        questionCount={questionCount}
        maxQ={maxQ}
        startTime={startTime}
        ttsEnabled={ttsEnabled}
        onToggleTts={handleToggleTts}
        onFinish={finishSession}
      />

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Thinking */}
          {phase === "loading" && (
            <ThinkingIndicator role={session.role} level={session.level} />
          )}

          {/* Error */}
          {loadError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-red-300">Failed to generate question</p>
                <p className="text-xs text-red-400/70 font-mono break-all">{loadError}</p>
                <button
                  onClick={() => { setLoadError(null); loadNextQuestion(); }}
                  className="text-xs text-red-400 hover:text-red-300 underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Question */}
          {currentQ && phase !== "loading" && (
            <div className="space-y-4">
              <QuestionCard
                topicTag={currentQ.topicTag}
                isFollowUp={currentQ.isFollowUp}
                questionCount={questionCount}
                maxQ={maxQ}
                text={currentQ.text}
              />

              {/* Answer section */}
              {phase === "answering" && (
                <AnswerSection
                  language={session.language}
                  isCode={isCode}
                  setIsCode={setIsCode}
                  answer={answer}
                  setAnswer={setAnswer}
                  hasStt={stt.hasStt}
                  sttActive={stt.sttActive}
                  onToggleStt={stt.toggleStt}
                  onSubmit={submitAnswer}
                  sttError={stt.sttError}
                  sttLang={stt.sttLang}
                  onToggleSttLang={stt.toggleSttLang}
                />
              )}

              {/* Evaluating / done */}
              {(phase === "evaluating" || phase === "done") && !isEndOnly && (
                <EvalCard
                  phase={phase}
                  feedbackText={feedbackText}
                  currentScore={currentScore}
                  evalResult={evalResult}
                  evalRef={evalRef}
                />
              )}

              {/* end-only: show subtle saving indicator while evaluating */}
              {isEndOnly && phase === "evaluating" && (
                <div className="flex items-center gap-2 text-xs text-white/30 py-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Saving evaluation…
                </div>
              )}

              {/* Actions after eval */}
              {phase === "done" && (
                <div className="flex gap-3">
                  {isLastQuestion ? (
                    <button
                      onClick={finishSession}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                    >
                      <Sparkles className="h-4 w-4" /> View Full Results
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-3 text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/25 transition-all"
                    >
                      {pendingFollowUp ? "Follow-up Question" : "Next Question"}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
