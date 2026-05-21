"use client";
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

const PHRASES = [
  "Reviewing your profile…",
  "Formulating a question…",
  "Considering the right challenge…",
  "Tailoring difficulty to your level…",
  "Almost ready…",
];

export function ThinkingIndicator({ role, level }: { role: string; level: string }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      {/* Pulsing brain icon */}
      <div className="relative flex items-center justify-center">
        <span className="absolute h-16 w-16 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: "2s" }} />
        <span className="absolute h-12 w-12 rounded-full bg-violet-500/10 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.4s" }} />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 border border-white/10">
          <Brain className="h-7 w-7 text-blue-400" />
        </div>
      </div>

      {/* Cycling phrase */}
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-sm font-medium text-white/70 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {PHRASES[phraseIndex]}
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-400/60"
              style={{
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Context badge */}
      <p className="text-xs text-white/25 capitalize">
        {role} · {level}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
