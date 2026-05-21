"use client";
import {
  Monitor, Server, Layers, Container, Database, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";
import { OptionCard, SectionLabel } from "./option-card";

const ROLES: { value: Role; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "frontend", label: "Frontend", icon: <Monitor className="h-5 w-5" />, desc: "React, CSS, performance" },
  { value: "backend", label: "Backend", icon: <Server className="h-5 w-5" />, desc: "APIs, databases, scaling" },
  { value: "fullstack", label: "Full Stack", icon: <Layers className="h-5 w-5" />, desc: "End-to-end development" },
  { value: "devops", label: "DevOps", icon: <Container className="h-5 w-5" />, desc: "CI/CD, infra, cloud" },
  { value: "data-engineer", label: "Data Engineer", icon: <Database className="h-5 w-5" />, desc: "Pipelines, warehouses" },
  { value: "ml-engineer", label: "ML Engineer", icon: <Brain className="h-5 w-5" />, desc: "Models, MLOps, math" },
];

interface RoleStepProps {
  step: number;
  value: Role | "";
  onChange: (role: Role) => void;
}

export function RoleStep({ step, value, onChange }: RoleStepProps) {
  return (
    <div>
      <SectionLabel step={step} label="What role are you interviewing for?" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ROLES.map((r) => (
          <OptionCard
            key={r.value}
            selected={value === r.value}
            onClick={() => onChange(r.value)}
          >
            <div className="flex items-center gap-2.5">
              <span className={cn("shrink-0", value === r.value ? "text-blue-400" : "text-white/40")}>
                {r.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{r.label}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{r.desc}</p>
              </div>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
