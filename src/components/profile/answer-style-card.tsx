import { BarChart2 } from "lucide-react";
import { ProfileSectionCard } from "./profile-section-card";
import type { AnswerStyleData, CommunicationPatterns } from "@/types";

interface Props {
  answerStyle: AnswerStyleData;
  communicationPatterns: CommunicationPatterns;
}

export function AnswerStyleCard({ answerStyle, communicationPatterns }: Props) {
  const hasData =
    Object.keys(answerStyle).length > 0 || Object.keys(communicationPatterns).length > 0;
  if (!hasData) return null;

  const notes = answerStyle.notes ?? communicationPatterns.notes;
  const hasStats =
    answerStyle.verbosity || answerStyle.usesExamples !== undefined ||
    answerStyle.structuredThinking !== undefined || answerStyle.codeVsConceptualBias ||
    communicationPatterns.averageAnswerDepth || communicationPatterns.clarityScore !== undefined;

  return (
    <ProfileSectionCard icon={<BarChart2 className="h-4 w-4 text-white/40" />} title="Answer Style & Communication">
      {hasStats && (
        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {answerStyle.verbosity && (
            <StyleStat label="Verbosity" value={answerStyle.verbosity.replace(/_/g, " ")} />
          )}
          {answerStyle.usesExamples !== undefined && (
            <StyleStat label="Uses Examples" value={answerStyle.usesExamples ? "Yes" : "Rarely"} />
          )}
          {answerStyle.structuredThinking !== undefined && (
            <StyleStat label="Structured" value={answerStyle.structuredThinking ? "Yes" : "No"} />
          )}
          {answerStyle.codeVsConceptualBias && (
            <StyleStat label="Bias" value={answerStyle.codeVsConceptualBias.replace(/_/g, " ")} />
          )}
          {communicationPatterns.averageAnswerDepth && (
            <StyleStat label="Answer Depth" value={communicationPatterns.averageAnswerDepth} />
          )}
          {communicationPatterns.clarityScore !== undefined && (
            <StyleStat label="Clarity" value={`${communicationPatterns.clarityScore}/10`} />
          )}
        </div>
      )}
      {notes && (
        <div className={`px-5 py-4${hasStats ? " border-t border-white/[0.06]" : ""}`}>
          <p className="text-sm text-white/70 leading-relaxed">{notes}</p>
        </div>
      )}
    </ProfileSectionCard>
  );
}

function StyleStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-1">{label}</p>
      <p className="text-sm text-white/70 capitalize">{value}</p>
    </div>
  );
}
