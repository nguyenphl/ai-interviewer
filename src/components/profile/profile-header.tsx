import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { OverallAssessment } from "@/types";

interface Props {
  sessionCount: number;
  assessment: OverallAssessment;
}

const trendConfig = {
  improving: { icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  declining: { icon: TrendingDown, color: "text-red-400 bg-red-400/10 border-red-400/20" },
  stable:    { icon: Minus,        color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
};

export function ProfileHeader({ sessionCount, assessment }: Props) {
  const readiness = assessment.readinessScore ?? 0;
  const trend = assessment.trend ? trendConfig[assessment.trend] : null;
  const TrendIcon = trend?.icon;

  return (
    <div className="border-b border-white/[0.06] bg-white/[0.01] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">Learner Profile</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Your Profile</h1>
            <p className="text-white/40 text-sm mt-1">
              Based on {sessionCount} session{sessionCount !== 1 ? "s" : ""}
              {assessment.estimatedLevel ? ` · ${assessment.estimatedLevel} level` : ""}
            </p>
          </div>

          <div className="text-right">
            <p className={cn(
              "text-5xl font-bold tabular-nums leading-none",
              readiness >= 70 ? "text-emerald-400" : readiness >= 50 ? "text-amber-400" : "text-red-400"
            )}>
              {readiness > 0 ? readiness : "—"}
            </p>
            <p className="text-xs text-white/30 mt-1">readiness score</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          {trend && TrendIcon && (
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", trend.color)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {assessment.trend}
            </span>
          )}
          {assessment.estimatedLevel && (
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-white/60">
              {assessment.estimatedLevel}
            </span>
          )}
        </div>

        {readiness > 0 && (
          <div className="mt-4 max-w-xs">
            <Progress value={readiness} className="h-1.5" />
          </div>
        )}
      </div>
    </div>
  );
}
