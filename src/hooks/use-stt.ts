"use client";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSttOptions {
  answer: string;
  setAnswer: (text: string) => void;
}

export function useStt({ answer, setAnswer }: UseSttOptions) {
  const [sttActive, setSttActive] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);

  // Default to browser locale if it's Vietnamese, otherwise English
  const [sttLang, setSttLang] = useState<"en-US" | "vi-VN" >(() => {
    if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("vi")) {
      return "vi-VN";
    }
    return "en-US";
  });

  // Refs so callbacks always read the latest value without stale closures
  const isListeningRef = useRef(false);
  const answerRef = useRef(answer);
  const setAnswerRef = useRef(setAnswer);
  
  // Refs to manage SpeechRecognition instance and restart safety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const consecutiveRestartsRef = useRef(0);
  const initialAnswerRef = useRef("");
  const startRecRef = useRef<(forcedLang?: "en-US" | "vi-VN") => void>(() => {});
  const sttLangRef = useRef(sttLang);

  // Keep refs in sync with latest props
  useEffect(() => { answerRef.current = answer; }, [answer]);
  useEffect(() => { setAnswerRef.current = setAnswer; }, [setAnswer]);
  useEffect(() => { sttLangRef.current = sttLang; }, [sttLang]);

  const hasStt =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const createAndStart = useCallback((forcedLang?: "en-US" | "vi-VN") => {
    if (!isListeningRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) return;

    // Discard any existing instance before building a new one
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = new SR();
    recognitionRef.current = rec;

    // Set active spoken language
    rec.lang = forcedLang ?? sttLangRef.current;
    rec.continuous = true;
    rec.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      window.speechSynthesis?.cancel();
      setSttError(null); // Clear errors on successful capture
      consecutiveRestartsRef.current = 0; // reset error/restart count on success

      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + t;
        } else {
          interimTranscript += t;
        }
      }

      const newSessionText = finalTranscript + (interimTranscript ? " " + interimTranscript : "");
      const initial = initialAnswerRef.current || "";
      const separator = initial && newSessionText ? " " : "";
      setAnswerRef.current(initial + separator + newSessionText);
    };

    rec.onerror = (e: { error: string }) => {
      console.error("Speech recognition error:", e.error);
      
      let msg = "";
      if (e.error === "not-allowed") {
        msg = "Microphone access denied. Please enable mic permissions in your browser.";
      } else if (e.error === "service-not-allowed") {
        msg = "Speech recognition service is currently unavailable.";
      } else if (e.error === "language-not-supported") {
        msg = `Language ${rec.lang} is not supported by your browser/OS.`;
      } else if (e.error === "network") {
        msg = "Network connection error. Check your internet connection.";
      } else if (e.error === "no-speech") {
        msg = "No speech detected. Please speak closer to your microphone.";
      } else {
        msg = `Speech recognition error: ${e.error}`;
      }
      setSttError(msg);

      // Stop immediately on fatal permission or support errors
      if (
        e.error === "not-allowed" ||
        e.error === "service-not-allowed" ||
        e.error === "language-not-supported"
      ) {
        isListeningRef.current = false;
        setSttActive(false);
      }
    };

    rec.onend = () => {
      // If recognition stopped unexpectedly and we are still listening, restart safely
      if (isListeningRef.current) {
        if (consecutiveRestartsRef.current < 3) {
          consecutiveRestartsRef.current += 1;
          console.log(`Speech recognition ended unexpectedly. Restarting (${consecutiveRestartsRef.current}/3) in 1s...`);
          restartTimeoutRef.current = setTimeout(() => {
            startRecRef.current();
          }, 1000); // 1s throttle delay to prevent flashing or loops
        } else {
          console.warn("Speech recognition stopped due to too many consecutive restarts.");
          isListeningRef.current = false;
          setSttActive(false);
        }
      } else {
        setSttActive(false);
      }
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      if (isListeningRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          startRecRef.current();
        }, 1000);
      }
    }
  }, []);

  // Sync the stable startRecRef with the callback
  useEffect(() => {
    startRecRef.current = createAndStart;
  }, [createAndStart]);

  const stopStt = useCallback(() => {
    isListeningRef.current = false;
    setSttActive(false);

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Failed to stop SpeechRecognition:", err);
      }
      recognitionRef.current = null;
    }
  }, []);

  const toggleStt = useCallback(() => {
    if (isListeningRef.current) {
      stopStt();
      return;
    }

    setSttError(null);
    initialAnswerRef.current = answerRef.current || "";
    consecutiveRestartsRef.current = 0;
    isListeningRef.current = true;
    setSttActive(true);
    createAndStart();
  }, [createAndStart, stopStt]);

  const toggleSttLang = useCallback(() => {
    setSttLang((prev) => {
      const next = prev === "en-US" ? "vi-VN" : "en-US";
      
      if (isListeningRef.current) {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }
        // Force restart with the new language setting immediately
        setTimeout(() => {
          if (isListeningRef.current) {
            createAndStart(next);
          }
        }, 100);
      }
      return next;
    });
  }, [createAndStart]);

  // Clean up mic capture and timers on component unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  return { sttActive, hasStt, toggleStt, stopStt, sttError, sttLang, toggleSttLang };
}
