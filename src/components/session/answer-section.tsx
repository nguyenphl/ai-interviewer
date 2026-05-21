"use client";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { AlignLeft, Code2, ChevronRight, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const monacoLang: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  go: "go",
  java: "java",
  rust: "rust",
  cpp: "cpp",
  csharp: "csharp",
};

interface AnswerSectionProps {
  language: string;
  isCode: boolean;
  setIsCode: (v: boolean) => void;
  answer: string;
  setAnswer: (v: string) => void;
  hasStt: boolean;
  sttActive: boolean;
  onToggleStt: () => void;
  onSubmit: () => void;
}

/**
 * Renders the answer entry area: Text/Code toggle, optional STT mic,
 * Textarea or Monaco editor, and the Submit button.
 */
export function AnswerSection({
  language,
  isCode,
  setIsCode,
  answer,
  setAnswer,
  hasStt,
  sttActive,
  onToggleStt,
  onSubmit,
}: AnswerSectionProps) {
  return (
    <div className="space-y-3">
      {/* Text / Code toggle */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] border border-white/[0.06] p-1 w-fit">
        <button
          type="button"
          onClick={() => setIsCode(false)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            !isCode
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <AlignLeft className="h-3.5 w-3.5" /> Text
        </button>
        <button
          type="button"
          onClick={() => setIsCode(true)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            isCode
              ? "bg-white/10 text-white shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <Code2 className="h-3.5 w-3.5" /> Code
        </button>
      </div>

      {/* Mic button (STT) */}
      {hasStt && !isCode && (
        <button
          type="button"
          onClick={onToggleStt}
          title={sttActive ? "Stop recording" : "Speak your answer"}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border transition-all",
            sttActive
              ? "border-red-500/50 bg-red-500/10 text-red-400 animate-pulse"
              : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
          )}
        >
          {sttActive ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          {sttActive ? "Stop" : "Speak"}
        </button>
      )}

      {/* Input */}
      {isCode ? (
        <div className="rounded-xl overflow-hidden border border-white/[0.08]" style={{ height: 280 }}>
          <MonacoEditor
            height="280px"
            language={monacoLang[language.split(",")[0].trim()] ?? "typescript"}
            theme="vs-dark"
            value={answer}
            onChange={(v) => setAnswer(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 12 },
              fontFamily: "var(--font-mono), monospace",
            }}
          />
        </div>
      ) : (
        <Textarea
          rows={8}
          placeholder="Type your answer here…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="rounded-xl text-sm leading-relaxed resize-y"
        />
      )}

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!answer.trim()}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
          answer.trim()
            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:opacity-90 active:scale-[0.99]"
            : "bg-white/[0.04] text-white/20 cursor-not-allowed"
        )}
      >
        Submit Answer <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
