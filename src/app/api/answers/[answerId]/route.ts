import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { parseEvalJSON, updateTopicStat } from "@/lib/interview/scoring";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ answerId: string }> }
) {
  const { answerId } = await params;
  const body = await req.json() as {
    evaluationText: string;
    topicTag: string;
  };

  const result = parseEvalJSON(body.evaluationText);
  console.log("[eval-parse] score:", result?.normalizedScore ?? null);
  console.log("[eval-parse] raw tail:", body.evaluationText.slice(-300));

  const answer = await prisma.answer.update({
    where: { id: answerId },
    data: {
      evaluationText: body.evaluationText,
      score: result?.normalizedScore ?? null,
      strengths: result ? JSON.stringify(result.strengths) : null,
      weaknesses: result ? JSON.stringify(result.weaknesses) : null,
    },
  });

  if (result) {
    await updateTopicStat(body.topicTag, result.normalizedScore);
  }

  return NextResponse.json(answer);
}
