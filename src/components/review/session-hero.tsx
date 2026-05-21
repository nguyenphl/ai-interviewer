import Link from "next/link";
import { CheckCircle2, Clock, Plus, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionHeroProps {
  role: string;
  level: string;
  sessionType: string;
  language: string;
  score: number | null;
  answeredCount: number;
  durationSec: number | null;
}

/**
 * Renders the review-page hero: session meta line, big score number,
 * Q-count + duration meta row, and the CTA links.
 */
export function SessionHero({
  role,
  level,
  sessionType,
  language,
  score,
  answeredCount,
  durationSec,
}: SessionHeroProps) {
  const scoreColor =
    score == null ? "text-white/30"
    : score >= 7 ? "text-emerald-400"
    : score >= 5 ? "text-amber-400"
    : "text-red-400";

  return (
    <div className="border-b border-white/[0.06] bg-white/[0.01] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">Session Complete</p>
            <h1 className="text-2xl font-bold text-white tracking-tight capitalize">
              {role} Interview
            </h1>
            <p className="text-white/40 text-sm mt-1 capitalize">
              {level} · {sessionType} · {language}
            </p>
          </div>

          {/* Score */}
          <div className="text-right">
            <p className={cn("text-5xl font-bold tabular-nums leading-none", scoreColor)}>
              {score != null ? score.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-white/30 mt-1">out of 10</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-5 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {answeredCount} question{answeredCount !== 1 ? "s" : ""}
          </span>
          {durationSec != null && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {Math.floor(durationSec / 60)}m {durationSec % 60}s
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/sessions/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Interview
          </Link>
          <Link
            href="/sessions"
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/70 hover:border-white/30 hover:text-white transition-colors"
          >
            <History className="h-4 w-4" /> History
          </Link>
        </div>
      </div>
    </div>
  );
}
