import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSectionCard } from "./profile-section-card";
import { severityColor } from "./severity";
import type { KnowledgeGap } from "@/types";

export function KnowledgeGapsCard({ gaps }: { gaps: KnowledgeGap[] }) {
  if (gaps.length === 0) return null;
  return (
    <ProfileSectionCard icon={<BookOpen className="h-4 w-4 text-red-400" />} title="Knowledge Gaps">
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {gaps.map((gap, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-white leading-snug">{gap.concept}</p>
              <span className={cn("shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium", severityColor(gap.severity))}>
                {gap.severity}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/40">{gap.topic}</p>
            {gap.sessionsSeen > 1 && (
              <p className="mt-1 text-[10px] text-white/25">seen in {gap.sessionsSeen} sessions</p>
            )}
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
