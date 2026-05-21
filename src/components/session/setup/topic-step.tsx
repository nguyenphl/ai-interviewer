"use client";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./option-card";

interface TopicOption {
  value: string;
  label: string;
}

interface TopicStepProps {
  step: number;
  value: string;
  options: TopicOption[];
  onChange: (topic: string) => void;
}

export function TopicStep({ step, value, options, onChange }: TopicStepProps) {
  if (options.length === 0) return null;

  return (
    <div>
      <SectionLabel step={step} label="Focus topic (optional)" />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("")}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150",
            !value
              ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
              : "border-white/[0.08] bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white/70"
          )}
        >
          Auto
        </button>
        {options.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-150",
              value === t.value
                ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                : "border-white/[0.08] bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white/70"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
