"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSttOptions {
  /** Current answer text — used as the starting "final transcript" when STT begins. */
  answer: string;
  /** Setter for the answer text — STT appends transcripts here. */
  setAnswer: (text: string) => void;
}

/**
 * Encapsulates browser Speech Recognition (STT) state + handlers.
 *
 * Behavior is identical to the inline implementation in
 * `interview-client.tsx` — only the location changed.
 */
export function useStt({ answer, setAnswer }: UseSttOptions) {
  const [sttActive, setSttActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const hasStt =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stopStt = useCallback(() => {
    recognitionRef.current?.stop();
    setSttActive(false);
  }, []);

  const toggleStt = useCallback(() => {
    if (sttActive) {
      stopStt();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    let finalTranscript = answer;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      window.speechSynthesis.cancel();
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + t;
        } else {
          interim = t;
        }
      }
      setAnswer(finalTranscript + (interim ? " " + interim : ""));
    };
    rec.onfinalresult = () => {
      finalTranscript = answer;
    };
    rec.onend = () => setSttActive(false);
    rec.onerror = () => setSttActive(false);
    recognitionRef.current = rec;
    rec.start();
    setSttActive(true);
  }, [answer, setAnswer, sttActive, stopStt]);

  // Stop recognition on unmount.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return { sttActive, recognitionRef, hasStt, toggleStt, stopStt };
}
