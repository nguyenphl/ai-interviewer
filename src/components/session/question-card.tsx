"use client";
import { Badge } from "@/components/ui/badge";
import { QuestionText } from "@/components/ui/question-text";
import { TOPIC_DISPLAY } from "@/lib/prompts";
import { CornerDownRight } from "lucide-react";

interface QuestionCardProps {
  topicTag: string;
  isFollowUp: boolean;
  questionCount: number;
  maxQ: number;
  text: string;
}

/**
 * Renders the question card: topic badge, optional follow-up badge,
 * the Q# label, and the question text body.
 */
export function QuestionCard({
  topicTag,
  isFollowUp,
  questionCount,
  maxQ,
  text,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      {/* Card top bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
        <Badge variant="secondary" className="text-[11px]">
          {TOPIC_DISPLAY[topicTag] ?? topicTag}
        </Badge>
        {isFollowUp && (
          <span className="flex items-center gap-1 text-[11px] text-amber-400/80 font-medium">
            <CornerDownRight className="h-3 w-3" /> Follow-up
          </span>
        )}
        <span className="ml-auto text-[11px] text-white/25 capitalize">
          Q{questionCount} of {maxQ}
        </span>
      </div>

      {/* Question text */}
      <div className="px-5 py-5">
        <QuestionText text={text} />
      </div>
    </div>
  );
}
