"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Encapsulates browser TTS state (toggle + ref mirror) and the
 * `speakText` helper used to read questions aloud.
 *
 * Behavior is identical to the inline implementation in
 * `interview-client.tsx` — only the location changed.
 */
export function useTts() {
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const ttsEnabledRef = useRef(true);

  const speakText = useCallback((text: string) => {
    if (!ttsEnabledRef.current || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/```[\s\S]*?```/g, "code block"));
    utt.lang = "en-US";
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
  }, []);

  const toggleTts = useCallback(() => {
    setTtsEnabled((v) => {
      ttsEnabledRef.current = !v;
      if (v) window.speechSynthesis?.cancel();
      return !v;
    });
  }, []);

  const stopTts = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  // Cancel any in-flight speech on unmount.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  return { ttsEnabled, ttsEnabledRef, speakText, toggleTts, stopTts };
}
