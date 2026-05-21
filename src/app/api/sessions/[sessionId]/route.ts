import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: { answers: { orderBy: { submittedAt: "asc" } } },
      },
    },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(session);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body = await req.json() as { status?: string };
  const session = await prisma.session.update({
    where: { id: sessionId },
    data: { status: body.status },
  });
  return NextResponse.json(session);
}
