import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TOPIC_DISPLAY } from "@/lib/prompts";
import { QuestionText } from "@/components/ui/question-text";
import { Code2, CornerDownRight } from "lucide-react";
import type { EvalResult } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Minimal shape of question / answer rows used by the transcript.
 * Keeping it structural lets the page pass Prisma rows directly
 * without adapter code.
 */
export interface TranscriptQuestion {
  id: string;
  text: string;
  topicTag: string;
  isFollowUp: boolean;
}

export interface TranscriptAnswer {
  text: string;
  isCode: boolean;
  score: number | null;
}

export interface TranscriptItem {
  question: TranscriptQuestion;
  answer: TranscriptAnswer | undefined;
  result: EvalResult | null;
  strengths: string[];
  weaknesses: string[];
}

interface QuestionTranscriptProps {
  items: TranscriptItem[];
}

/**
 * Renders the Q&A transcript list shown on the review page.
 */
export function QuestionTranscript({ items }: QuestionTranscriptProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest">Transcript</h2>

      {items.map(({ question: q, answer, result, strengths, weaknesses }, idx) => (
        <div key={q.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
          {/* Q header */}
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-white/25">Q{idx + 1}</span>
            <Badge variant="secondary" className="text-[11px]">
              {TOPIC_DISPLAY[q.topicTag] ?? q.topicTag}
            </Badge>
            {q.isFollowUp && (
              <span className="flex items-center gap-1 text-[11px] text-amber-400/70 font-medium">
                <CornerDownRight className="h-3 w-3" /> Follow-up
              </span>
            )}
            {answer?.score != null && (
              <span
                className={cn(
                  "ml-auto text-sm font-bold tabular-nums",
                  answer.score >= 7 ? "text-emerald-400"
                  : answer.score >= 5 ? "text-amber-400"
                  : "text-red-400"
                )}
              >
                {answer.score.toFixed(1)}<span className="text-white/25 font-normal text-xs">/10</span>
              </span>
            )}
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Question text */}
            <QuestionText text={q.text} className="[&_p]:text-sm [&_p]:font-medium [&_p]:text-white/85" />

            {answer && (
              <>
                <Separator className="opacity-[0.06]" />

                {/* Answer */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Your Answer</p>
                  <div
                    className={cn(
                      "text-sm text-white/65 whitespace-pre-wrap leading-relaxed rounded-xl p-3.5",
                      answer.isCode
                        ? "bg-neutral-900 font-mono border border-white/[0.08]"
                        : "bg-white/[0.03] border border-white/[0.06]"
                    )}
                  >
                    {answer.isCode && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/[0.06]">
                        <Code2 className="h-3 w-3 text-white/30" />
                        <span className="text-[10px] text-white/30">Code</span>
                      </div>
                    )}
                    {answer.text}
                  </div>
                </div>

                {/* Score bar */}
                {answer.score != null && (
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        answer.score >= 7 ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                        : answer.score >= 5 ? "bg-gradient-to-r from-amber-500 to-amber-400"
                        : "bg-gradient-to-r from-red-500 to-red-400"
                      )}
                      style={{ width: `${(answer.score / 10) * 100}%` }}
                    />
                  </div>
                )}

                {/* Dimension scores */}
                {result && (
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["Accuracy", result.accuracy],
                      ["Depth", result.depth],
                      ["Communication", result.communication],
                      ["Practical", result.practical],
                    ] as [string, number][]).map(([label, val]) => (
                      <div key={label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-white/45">{label}</span>
                          <span className="text-white/30 tabular-nums">{val}/25</span>
                        </div>
                        <Progress value={(val / 25) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Strengths / weaknesses */}
                {(strengths.length > 0 || weaknesses.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {strengths.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500/70 mb-2">Strengths</p>
                        <ul className="space-y-1.5">
                          {strengths.map((s, i) => (
                            <li key={i} className="flex gap-2 text-xs text-white/55 leading-relaxed">
                              <span className="text-emerald-400 shrink-0 mt-px">✓</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {weaknesses.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-400/70 mb-2">To Improve</p>
                        <ul className="space-y-1.5">
                          {weaknesses.map((w, i) => (
                            <li key={i} className="flex gap-2 text-xs text-white/55 leading-relaxed">
                              <span className="text-red-400 shrink-0 mt-px">→</span>{w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
