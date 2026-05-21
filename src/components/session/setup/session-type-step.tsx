"use client";
import { TerminalSquare, LayoutTemplate, Users, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionType } from "@/types";
import { OptionCard, SectionLabel } from "./option-card";

const SESSION_TYPES: { value: SessionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "technical", label: "Technical", icon: <TerminalSquare className="h-5 w-5" />, desc: "Algorithms & coding" },
  { value: "system-design", label: "System Design", icon: <LayoutTemplate className="h-5 w-5" />, desc: "Architecture & scale" },
  { value: "behavioral", label: "Behavioral", icon: <Users className="h-5 w-5" />, desc: "Soft skills & stories" },
  { value: "mixed", label: "Mixed", icon: <Shuffle className="h-5 w-5" />, desc: "All of the above" },
];

interface SessionTypeStepProps {
  step: number;
  value: SessionType | "";
  onChange: (type: SessionType) => void;
}

export function SessionTypeStep({ step, value, onChange }: SessionTypeStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="Session type" />

      <div className="grid grid-cols-2 gap-2">
        {SESSION_TYPES.map((t) => (
          <OptionCard
            key={t.value}
            selected={value === t.value}
            onClick={() => onChange(t.value)}
          >
            <div className="flex items-center gap-3">
              <span className={cn("shrink-0", value === t.value ? "text-blue-400" : "text-white/40")}>
                {t.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t.label}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{t.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
