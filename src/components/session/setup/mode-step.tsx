"use client";
import {
  Sunrise, Crosshair, MessageSquare, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewMode, ReviewMode } from "@/types";
import { OptionCard, SectionLabel } from "./option-card";

const MODES: { value: InterviewMode; label: string; icon: React.ReactNode; desc: string; detail: string }[] = [
  {
    value: "warmup",
    label: "Warm Up",
    icon: <Sunrise className="h-5 w-5" />,
    desc: "Conversational & progressive",
    detail: "Starts easy, builds naturally from your answers. Great for relaxed practice.",
  },
  {
    value: "direct",
    label: "Direct",
    icon: <Crosshair className="h-5 w-5" />,
    desc: "Straight technical questions",
    detail: "Jumps right into technical depth. Simulates a high-pressure interview.",
  },
];

const REVIEW_MODES: { value: ReviewMode; label: string; icon: React.ReactNode; desc: string; detail: string }[] = [
  {
    value: "per-question",
    label: "Per Question",
    icon: <MessageSquare className="h-5 w-5" />,
    desc: "Feedback after each answer",
    detail: "See strengths & weaknesses right away. Good for learning as you go.",
  },
  {
    value: "end-only",
    label: "End Summary",
    icon: <Clock className="h-5 w-5" />,
    desc: "All feedback at the end",
    detail: "Focus on answering without distraction. Full review after all questions.",
  },
];

interface InterviewModeStepProps {
  step: number;
  value: InterviewMode;
  onChange: (mode: InterviewMode) => void;
}

export function InterviewModeStep({ step, value, onChange }: InterviewModeStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="Interview style" />
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
          <OptionCard
            key={m.value}
            selected={value === m.value}
            onClick={() => onChange(m.value)}
          >
            <div className="flex items-start gap-3">
              <span className={cn("shrink-0 mt-0.5", value === m.value ? "text-blue-400" : "text-white/40")}>
                {m.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{m.desc}</p>
                <p className="text-[11px] text-white/25 mt-1 leading-relaxed">{m.detail}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

interface ReviewModeStepProps {
  step: number;
  value: ReviewMode;
  onChange: (mode: ReviewMode) => void;
}

export function ReviewModeStep({ step, value, onChange }: ReviewModeStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="Feedback style" />
      <div className="grid grid-cols-2 gap-2">
        {REVIEW_MODES.map((m) => (
          <OptionCard
            key={m.value}
            selected={value === m.value}
            onClick={() => onChange(m.value)}
          >
            <div className="flex items-start gap-3">
              <span className={cn("shrink-0 mt-0.5", value === m.value ? "text-blue-400" : "text-white/40")}>
                {m.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{m.desc}</p>
                <p className="text-[11px] text-white/25 mt-1 leading-relaxed">{m.detail}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
