"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role, Level, Language, SessionType, InterviewMode, ReviewMode } from "@/types";
import { TOPIC_MAP, TOPIC_DISPLAY } from "@/lib/prompts";
import { ChevronRight, Loader2 } from "lucide-react";
import { createSession } from "@/lib/api/sessions";
import { RoleStep } from "./setup/role-step";
import { LevelStep } from "./setup/level-step";
import { LanguageStep } from "./setup/language-step";
import { InterviewModeStep, ReviewModeStep } from "./setup/mode-step";
import { SessionTypeStep } from "./setup/session-type-step";
import { TopicStep } from "./setup/topic-step";

export function SetupWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "" as Role | "",
    level: "" as Level | "",
    languages: [] as Language[],
    sessionType: "" as SessionType | "",
    topic: "",
    interviewMode: "warmup" as InterviewMode,
    reviewMode: "per-question" as ReviewMode,
  });

  const topicOptions = form.role
    ? (TOPIC_MAP[form.role as Role] ?? []).map((t) => ({
        value: t,
        label: TOPIC_DISPLAY[t] ?? t,
      }))
    : [];

  const toggleLanguage = (lang: Language) =>
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }));

  const ready = form.role && form.level && form.languages.length > 0 && form.sessionType;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setLoading(true);
    const session = await createSession({
      role: form.role,
      level: form.level,
      language: form.languages.join(", "),
      sessionType: form.sessionType,
      topic: form.topic || undefined,
      interviewMode: form.interviewMode,
      reviewMode: form.reviewMode,
    });
    router.push(`/sessions/${session.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <RoleStep
        step={1}
        value={form.role}
        onChange={(role) => setForm((f) => ({ ...f, role, topic: "" }))}
      />

      <LevelStep
        step={2}
        value={form.level}
        onChange={(level) => setForm((f) => ({ ...f, level }))}
      />

      <LanguageStep
        step={3}
        value={form.languages}
        onToggle={toggleLanguage}
      />

      <InterviewModeStep
        step={4}
        value={form.interviewMode}
        onChange={(interviewMode) => setForm((f) => ({ ...f, interviewMode }))}
      />

      <ReviewModeStep
        step={5}
        value={form.reviewMode}
        onChange={(reviewMode) => setForm((f) => ({ ...f, reviewMode }))}
      />

      <SessionTypeStep
        step={6}
        value={form.sessionType}
        onChange={(sessionType) => setForm((f) => ({ ...f, sessionType }))}
      />

      <TopicStep
        step={7}
        value={form.topic}
        options={topicOptions}
        onChange={(topic) => setForm((f) => ({ ...f, topic }))}
      />

      {/* Submit */}
      <div className="pt-2 pb-6">
        <button
          type="submit"
          disabled={!ready || loading}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all",
            ready
              ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:opacity-90 active:scale-[0.99]"
              : "bg-white/[0.04] text-white/20 cursor-not-allowed"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Starting session…
            </>
          ) : (
            <>
              Start Interview <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
        {!ready && (
          <p className="text-center text-xs text-white/20 mt-2">
            Complete all sections above to continue
          </p>
        )}
      </div>
    </form>
  );
}
