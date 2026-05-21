"use client";
import { Flame, Zap, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";
import { OptionCard, SectionLabel } from "./option-card";

const LEVELS: { value: Level; label: string; icon: React.ReactNode; years: string }[] = [
  { value: "junior", label: "Junior", icon: <Flame className="h-4 w-4" />, years: "0–2 yrs" },
  { value: "mid", label: "Mid", icon: <Zap className="h-4 w-4" />, years: "2–5 yrs" },
  { value: "senior", label: "Senior", icon: <Star className="h-4 w-4" />, years: "5–8 yrs" },
  { value: "staff", label: "Staff", icon: <Trophy className="h-4 w-4" />, years: "8+ yrs" },
];

interface LevelStepProps {
  step: number;
  value: Level | "";
  onChange: (level: Level) => void;
}

export function LevelStep({ step, value, onChange }: LevelStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="Experience level" />
      <div className="grid grid-cols-4 gap-2">
        {LEVELS.map((l) => (
          <OptionCard
            key={l.value}
            selected={value === l.value}
            onClick={() => onChange(l.value)}
            className="text-center"
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn(value === l.value ? "text-blue-400" : "text-white/40")}>
                {l.icon}
              </span>
              <p className="text-sm font-semibold text-white">{l.label}</p>
              <p className="text-[10px] text-white/35">{l.years}</p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
