import { AlertTriangle } from "lucide-react";
import { ProfileSectionCard } from "./profile-section-card";
import type { RecurringMistake } from "@/types";

export function RecurringMistakesCard({ mistakes }: { mistakes: RecurringMistake[] }) {
  if (mistakes.length === 0) return null;
  const sorted = [...mistakes].sort((a, b) => b.occurrences - a.occurrences);
  return (
    <ProfileSectionCard icon={<AlertTriangle className="h-4 w-4 text-amber-400" />} title="Recurring Mistakes">
      <div className="divide-y divide-white/[0.04]">
        {sorted.map((m, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-white/80">{m.pattern}</p>
            <span className="shrink-0 inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-400">
              ×{m.occurrences}
            </span>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
