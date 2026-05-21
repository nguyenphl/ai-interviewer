import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    questionId: string;
    text: string;
    isCode?: boolean;
  };

  const answer = await prisma.answer.create({
    data: {
      questionId: body.questionId,
      text: body.text,
      isCode: body.isCode ?? false,
    },
  });
  return NextResponse.json(answer, { status: 201 });
}
