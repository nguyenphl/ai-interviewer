import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { updateUserModel } from "@/lib/user-model";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body = await req.json() as { durationSec?: number };

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        include: { answers: { orderBy: { submittedAt: "desc" }, take: 1 } },
      },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const scores = session.questions
    .flatMap((q) => q.answers)
    .map((a) => a.score)
    .filter((s): s is number => s !== null);

  const totalScore =
    scores.length > 0
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2))
      : null;

  const updated = await prisma.session.update({
    where: { id: sessionId },
    data: {
      status: "completed",
      totalScore,
      durationSec: body.durationSec,
      completedAt: new Date(),
    },
  });
  // fire-and-forget: update user model in background
  void updateUserModel(sessionId);

  return NextResponse.json(updated);
}
