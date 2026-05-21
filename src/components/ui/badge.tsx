import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "success" | "destructive" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-blue-600 text-white",
  secondary: "bg-white/10 text-white/80",
  success: "bg-green-600 text-white",
  destructive: "bg-red-600 text-white",
  outline: "border border-white/20 text-white/80",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
