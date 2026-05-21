import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { questions: true } } },
  });
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      role: string;
      level: string;
      language: string;
      sessionType: string;
      topic?: string;
      interviewMode?: string;
      reviewMode?: string;
    };
    const session = await prisma.session.create({
      data: {
        role: body.role,
        level: body.level,
        language: body.language,
        sessionType: body.sessionType,
        topic: body.topic,
        interviewMode: body.interviewMode ?? "direct",
        reviewMode: body.reviewMode ?? "per-question",
        status: "active",
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/sessions]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
