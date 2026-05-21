import { CheckCircle2 } from "lucide-react";
import { ProfileSectionCard } from "./profile-section-card";
import type { StrengthEntry } from "@/types";

export function StrengthsCard({ strengths }: { strengths: StrengthEntry[] }) {
  if (strengths.length === 0) return null;
  return (
    <ProfileSectionCard icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} title="Strengths">
      <div className="px-5 py-4 flex flex-wrap gap-2">
        {strengths.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            {s.area}
            {s.confidence === "high" && <span className="text-emerald-400/60">★</span>}
          </span>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
