import { TrendingUp } from "lucide-react";
import { DimensionChart } from "./dimension-chart";

interface SkillBreakdownProps {
  accuracy: number;
  depth: number;
  communication: number;
  practical: number;
}

/**
 * Skill breakdown section: dimension chart + four labelled progress bars.
 */
export function SkillBreakdown({
  accuracy,
  depth,
  communication,
  practical,
}: SkillBreakdownProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-white/80">Skill Breakdown</h2>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <DimensionChart
          accuracy={accuracy}
          depth={depth}
          communication={communication}
          practical={practical}
        />
        <div className="space-y-3 self-center">
          {([
            ["Accuracy", accuracy],
            ["Depth", depth],
            ["Communication", communication],
            ["Practical", practical],
          ] as [string, number][]).map(([label, val]) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/60">{label}</span>
                <span className="text-white/40 tabular-nums">{val.toFixed(1)} / 25</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                  style={{ width: `${(val / 25) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
