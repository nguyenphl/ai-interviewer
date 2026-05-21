"use client";
import { cn } from "@/lib/utils";

/**
 * Shared option-card primitive used by every setup step.
 */
export function OptionCard({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-xl border px-4 py-3 text-left transition-all duration-150 cursor-pointer outline-none",
        selected
          ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]"
          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15",
        className
      )}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-blue-400" />
      )}
      {children}
    </button>
  );
}

/**
 * Shared section label (numbered step header).
 */
export function SectionLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60">
        {step}
      </span>
      <p className="text-sm font-semibold text-white/60 tracking-wide">{label}</p>
    </div>
  );
}
