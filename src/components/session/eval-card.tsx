"use client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RefObject } from "react";

interface EvalCardProps {
  phase: "evaluating" | "done";
  feedbackText: string;
  currentScore: number | null;
  evalResult: { score: number; strengths: string[]; weaknesses: string[] } | null;
  evalRef: RefObject<HTMLDivElement | null>;
}

/**
 * Renders the evaluation result card: spinner header while streaming,
 * the live feedback text with caret, and the strengths/weaknesses grid
 * once parsing is complete.
 */
export function EvalCard({ phase, feedbackText, currentScore, evalResult, evalRef }: EvalCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
        {phase === "evaluating" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-400 shrink-0" />
            <span className="text-sm font-medium text-white/60">Evaluating your answer…</span>
          </>
        ) : (
          <>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-white/80">Feedback</span>
            {currentScore !== null && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-white/30">Score</span>
                <span className={cn("text-xl font-bold tabular-nums",
                  currentScore >= 7 ? "text-emerald-400" : currentScore >= 5 ? "text-amber-400" : "text-red-400"
                )}>
                  {currentScore.toFixed(1)}<span className="text-sm font-normal text-white/25">/10</span>
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Streaming text */}
      {feedbackText && (
        <div className="px-5 pt-4 pb-2">
          <p
            ref={evalRef}
            className="text-sm text-white/75 whitespace-pre-wrap leading-relaxed"
          >
            {feedbackText}
            {phase === "evaluating" && (
              <span className="inline-block h-4 w-0.5 bg-blue-400 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </p>
        </div>
      )}

      {/* Structured strengths / weaknesses after eval */}
      {phase === "done" && evalResult && (evalResult.strengths.length > 0 || evalResult.weaknesses.length > 0) && (
        <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] mt-3">
          {evalResult.strengths.length > 0 && (
            <div className="px-5 py-4 bg-emerald-500/[0.03]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500/70 mb-2">Strengths</p>
              <ul className="space-y-1.5">
                {evalResult.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/60 leading-relaxed">
                    <span className="text-emerald-400 shrink-0">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {evalResult.weaknesses.length > 0 && (
            <div className="px-5 py-4 bg-red-500/[0.03]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/70 mb-2">To Improve</p>
              <ul className="space-y-1.5">
                {evalResult.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-xs text-white/60 leading-relaxed">
                    <span className="text-red-400 shrink-0">→</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
