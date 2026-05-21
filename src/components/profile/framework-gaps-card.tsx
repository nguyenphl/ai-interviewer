import { BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSectionCard } from "./profile-section-card";
import { severityColor } from "./severity";
import type { FrameworkGap } from "@/types";

export function FrameworkGapsCard({ gaps }: { gaps: FrameworkGap[] }) {
  if (gaps.length === 0) return null;
  return (
    <ProfileSectionCard icon={<BarChart2 className="h-4 w-4 text-white/40" />} title="Framework Gaps">
      <div className="divide-y divide-white/[0.04]">
        {gaps.map((fg, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-white/80">{fg.framework}</p>
              {fg.evidence && <p className="text-xs text-white/30 mt-0.5">{fg.evidence}</p>}
            </div>
            <span className={cn("shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", severityColor(fg.severity))}>
              {fg.severity}
            </span>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
