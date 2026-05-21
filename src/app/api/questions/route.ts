import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { generateQuestion } from "@/lib/llm/ollama";
import { buildQuestionPrompt, buildFollowUpPrompt, buildUserModelContext, buildMentorQuestionContext } from "@/lib/prompts";
import { getTopicForIndex, getSessionTopics, getMaxQuestions } from "@/lib/interview/question-engine";
import { getOrCreateUserModel, deserializeUserModel } from "@/lib/user-model";
import type { Role, Level, Language, SessionType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      sessionId: string;
      isFollowUp?: boolean;
      parentId?: string;
      weaknesses?: string[];
      originalQuestion?: string;
      previousAnswer?: string;
    };

    const session = await prisma.session.findUnique({
      where: { id: body.sessionId },
      include: {
        questions: {
          orderBy: { orderIndex: "asc" },
          include: { answers: { orderBy: { submittedAt: "desc" }, take: 1 } },
        },
      },
    });
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const userModelRaw = await getOrCreateUserModel();
    const userModel = deserializeUserModel(userModelRaw);
    const userModelContext = buildUserModelContext(userModel);

    const mode = session.interviewMode ?? "direct";
    const orderIndex = session.questions.length;
    const previousTopics = [...new Set(session.questions.map((q) => q.topicTag))];

    // For warmup: build a short summary from the last answer to give context
    const lastAnswer = session.questions
      .flatMap((q) => q.answers)
      .at(-1);
    const previousAnswerSummary =
      mode === "warmup" && lastAnswer
        ? lastAnswer.text.slice(0, 200)
        : undefined;

    let topic: string;
    let prompt: string;

    if (
      body.isFollowUp &&
      body.parentId &&
      body.weaknesses &&
      body.originalQuestion &&
      body.previousAnswer
    ) {
      const parent = session.questions.find((q) => q.id === body.parentId);
      topic =
        parent?.topicTag ??
        previousTopics[previousTopics.length - 1] ??
        "general";
      prompt = buildFollowUpPrompt({
        role: session.role as Role,
        level: session.level as Level,
        language: session.language as Language,
        originalQuestion: body.originalQuestion,
        answer: body.previousAnswer,
        weaknesses: body.weaknesses,
        interviewMode: mode,
      });
    } else {
      const topics = getSessionTopics(session.role as Role, session.topic ?? undefined);
      const maxQ = getMaxQuestions(session.sessionType as SessionType, session.level as Level);
      topic = getTopicForIndex(topics, orderIndex, maxQ);
      const mentor = buildMentorQuestionContext(userModel, orderIndex, maxQ);
      prompt = buildQuestionPrompt({
        role: session.role as Role,
        level: session.level as Level,
        language: session.language as Language,
        sessionType: session.sessionType as SessionType,
        topic,
        orderIndex,
        previousTopics,
        interviewMode: mode,
        previousAnswerSummary,
        userModelContext,
        mentorHint: mentor.revisitContext ?? mentor.expandContext,
      });
    }

    const text = await generateQuestion(prompt);

    const question = await prisma.question.create({
      data: {
        sessionId: body.sessionId,
        text,
        topicTag: topic,
        difficulty: session.level,
        orderIndex,
        isFollowUp: body.isFollowUp ?? false,
        parentId: body.parentId ?? null,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/questions]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
