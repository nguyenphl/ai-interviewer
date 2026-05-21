"use client";
import {
  Code2, FileCode, Coffee, Cog, Cpu, Boxes, TerminalSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Language } from "@/types";
import { SectionLabel } from "./option-card";

const LANGUAGES: { value: Language; label: string; icon: React.ReactNode }[] = [
  { value: "typescript", label: "TypeScript", icon: <FileCode className="h-4 w-4" /> },
  { value: "javascript", label: "JavaScript", icon: <Code2 className="h-4 w-4" /> },
  { value: "python", label: "Python", icon: <Cpu className="h-4 w-4" /> },
  { value: "go", label: "Go", icon: <Cog className="h-4 w-4" /> },
  { value: "java", label: "Java", icon: <Coffee className="h-4 w-4" /> },
  { value: "rust", label: "Rust", icon: <Boxes className="h-4 w-4" /> },
  { value: "cpp", label: "C++", icon: <TerminalSquare className="h-4 w-4" /> },
  { value: "csharp", label: "C#", icon: <Code2 className="h-4 w-4" /> },
];

interface LanguageStepProps {
  step: number;
  value: Language[];
  onToggle: (lang: Language) => void;
}

export function LanguageStep({ step, value, onToggle }: LanguageStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="Languages (select all that apply)" />
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((l) => {
          const selected = value.includes(l.value);
          return (
            <button
              key={l.value}
              type="button"
              onClick={() => onToggle(l.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-150",
                selected
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-300 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
                  : "border-white/[0.08] bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/80 hover:border-white/15"
              )}
            >
              <span className={cn(selected ? "text-blue-400" : "text-white/35")}>
                {l.icon}
              </span>
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
