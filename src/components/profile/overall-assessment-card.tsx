import { Sparkles } from "lucide-react";
import { ProfileSectionCard } from "./profile-section-card";
import type { OverallAssessment } from "@/types";

export function OverallAssessmentCard({ assessment }: { assessment: OverallAssessment }) {
  if (!assessment.summary) return null;
  return (
    <ProfileSectionCard icon={<Sparkles className="h-4 w-4 text-violet-400" />} title="Overall Assessment">
      <div className="px-5 py-4">
        <p className="text-sm text-white/70 leading-relaxed">{assessment.summary}</p>
      </div>
    </ProfileSectionCard>
  );
}
