"use client";
import { Progress } from "@/components/ui/progress";
import { SessionTimer } from "./session-timer";
import { Flag, Volume2, VolumeX } from "lucide-react";

interface InterviewHeaderProps {
  role: string;
  level: string;
  sessionType: string;
  progress: number;
  questionCount: number;
  maxQ: number;
  startTime: number;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  onFinish: () => void;
}

/**
 * Sticky top bar shown above the interview content. Renders the
 * session meta line, progress bar / count, timer, TTS toggle, and
 * End button.
 */
export function InterviewHeader({
  role,
  level,
  sessionType,
  progress,
  questionCount,
  maxQ,
  startTime,
  ttsEnabled,
  onToggleTts,
  onFinish,
}: InterviewHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-sm px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        {/* Session info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-semibold text-white capitalize">{role}</span>
          <span className="text-white/20">·</span>
          <span className="text-sm text-white/50 capitalize">{level}</span>
          <span className="text-white/20">·</span>
          <span className="text-sm text-white/50 capitalize">{sessionType}</span>
        </div>

        {/* Progress + count */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 w-28">
            <Progress value={progress} className="h-1" />
            <span className="text-xs text-white/30 tabular-nums shrink-0">
              {questionCount}/{maxQ}
            </span>
          </div>
          <SessionTimer startTime={startTime} />
          <button
            onClick={onToggleTts}
            title={ttsEnabled ? "Mute question reading" : "Read questions aloud"}
            className="flex items-center justify-center rounded-lg border border-white/15 p-1.5 text-white/50 hover:border-white/30 hover:text-white transition-colors"
          >
            {ttsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onFinish}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 hover:border-white/30 hover:text-white transition-colors"
          >
            <Flag className="h-3 w-3" />
            End
          </button>
        </div>
      </div>
    </header>
  );
}
