"use client";
import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function OverallSummary({ sessionId, isEndOnly }: { sessionId: string; isEndOnly: boolean }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}/summary`, { method: "POST" })
      .then((r) => r.json())
      .then((d: { summary?: string; error?: string }) => {
        if (d.summary) setSummary(d.summary);
        else setError(d.error ?? "Failed to generate summary");
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (error) return null;

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] to-violet-500/[0.04] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06]">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-violet-500/30">
          <Sparkles className="h-3.5 w-3.5 text-blue-300" />
        </div>
        <h2 className="text-sm font-semibold text-white/80">Overall Assessment</h2>
        {isEndOnly && (
          <span className="ml-auto text-[10px] font-medium text-blue-400/60 uppercase tracking-wider">End Summary</span>
        )}
      </div>

      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating assessment…
          </div>
        ) : (
          <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{summary}</p>
        )}
      </div>
    </div>
  );
}
