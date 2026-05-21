import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateQuestion } from "@/lib/llm/ollama";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: { answers: { orderBy: { submittedAt: "asc" }, take: 1 } },
      },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answered = session.questions.filter((q) => q.answers.length > 0);
  if (answered.length === 0) {
    return NextResponse.json({ error: "No answers to summarize" }, { status: 400 });
  }

  const qa = answered
    .map((q) => {
      const a = q.answers[0];
      const score = a.score != null ? ` (score: ${a.score.toFixed(1)}/10)` : "";
      return `Q: ${q.text}\nA: ${a.text.slice(0, 300)}${score}`;
    })
    .join("\n\n");

  const prompt = `You are a senior technical interviewer. Review this ${session.level} ${session.role} candidate's full interview session and write a concise overall assessment.

Session: ${session.sessionType} interview
${qa}

Write a 3-5 sentence overall assessment covering:
1. General performance and consistency
2. Key strengths demonstrated across the session
3. Most important areas to improve
4. A clear, actionable recommendation

Be honest but constructive. Output only the assessment text.`;

  try {
    const summary = await generateQuestion(prompt);
    return NextResponse.json({ summary });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
