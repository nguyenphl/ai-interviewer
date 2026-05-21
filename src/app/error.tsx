"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-white">
      <p className="text-lg font-semibold">Something went wrong</p>
      <p className="text-sm text-white/50 font-mono break-all max-w-lg text-center">
        {error.message}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
