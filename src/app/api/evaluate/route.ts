import { NextRequest } from "next/server";
import { streamEvaluation } from "@/lib/llm/ollama";
import { buildEvaluationPrompt } from "@/lib/prompts";
import type { Role, Level } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    role: string;
    level: string;
    question: string;
    answer: string;
    isCode: boolean;
    topic: string;
  };

  const prompt = buildEvaluationPrompt({
    role: body.role as Role,
    level: body.level as Level,
    question: body.question,
    answer: body.answer,
    isCode: body.isCode,
    topic: body.topic,
  });

  const ollamaStream = await streamEvaluation(prompt);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = ollamaStream.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line) as { response?: string; done?: boolean };
              if (json.response) {
                controller.enqueue(encoder.encode(json.response));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
