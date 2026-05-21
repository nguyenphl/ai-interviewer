"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props {
  startTime: number; // Date.now() snapshot
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function SessionTimer({ startTime }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(Math.floor((Date.now() - startTime) / 1000));
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
      <Clock className="h-3.5 w-3.5" />
      {fmt(elapsed)}
    </span>
  );
}
