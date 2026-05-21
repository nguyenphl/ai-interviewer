import { Target, Repeat2 } from "lucide-react";
import { ProfileSectionCard } from "./profile-section-card";
import type { RecommendedFocusItem } from "@/types";

export function RecommendedFocusCard({ items }: { items: RecommendedFocusItem[] }) {
  if (items.length === 0) return null;
  const sorted = [...items].sort((a, b) => a.priority - b.priority);
  return (
    <ProfileSectionCard icon={<Target className="h-4 w-4 text-blue-400" />} title="Recommended Focus">
      <div className="divide-y divide-white/[0.04]">
        {sorted.map((item, i) => (
          <div key={i} className="px-5 py-3.5 flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-400">
              {item.priority}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-white">{item.area}</p>
                {item.revisitMistake && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    <Repeat2 className="h-2.5 w-2.5" /> revisit
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
