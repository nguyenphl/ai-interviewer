import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { parseEvalJSON } from "@/lib/interview/scoring-parser";
import { OverallSummary } from "@/components/review/overall-summary";
import { SessionHero } from "@/components/review/session-hero";
import { SkillBreakdown } from "@/components/review/skill-breakdown";
import { QuestionTranscript } from "@/components/review/question-transcript";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
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
  if (!session) notFound();

  const answeredQuestions = session.questions.filter((q) => q.answers.length > 0);

  const parsedResults = answeredQuestions.map((q) => {
    const answer = q.answers[0];
    const result = answer?.evaluationText ? parseEvalJSON(answer.evaluationText) : null;
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    if (result) {
      strengths = result.strengths;
      weaknesses = result.weaknesses;
    } else if (answer) {
      try { strengths = answer.strengths ? (JSON.parse(answer.strengths) as string[]) : []; } catch { strengths = []; }
      try { weaknesses = answer.weaknesses ? (JSON.parse(answer.weaknesses) as string[]) : []; } catch { weaknesses = []; }
    }
    return { question: q, answer, result, strengths, weaknesses };
  });

  const dimTotals = parsedResults.reduce(
    (acc, { result }) => {
      if (!result) return acc;
      return {
        accuracy: acc.accuracy + result.accuracy,
        depth: acc.depth + result.depth,
        communication: acc.communication + result.communication,
        practical: acc.practical + result.practical,
        count: acc.count + 1,
      };
    },
    { accuracy: 0, depth: 0, communication: 0, practical: 0, count: 0 }
  );

  const hasDimData = dimTotals.count > 0;
  const isEndOnly = session.reviewMode === "end-only";

  return (
    <div className="min-h-full">
      <SessionHero
        role={session.role}
        level={session.level}
        sessionType={session.sessionType}
        language={session.language}
        score={session.totalScore}
        answeredCount={answeredQuestions.length}
        durationSec={session.durationSec ?? null}
      />

      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Overall AI summary — always shown */}
          <OverallSummary sessionId={session.id} isEndOnly={isEndOnly} />

          {/* Dimension breakdown */}
          {hasDimData && (
            <SkillBreakdown
              accuracy={dimTotals.accuracy / dimTotals.count}
              depth={dimTotals.depth / dimTotals.count}
              communication={dimTotals.communication / dimTotals.count}
              practical={dimTotals.practical / dimTotals.count}
            />
          )}

          <QuestionTranscript items={parsedResults} />

          {answeredQuestions.length === 0 && (
            <div className="rounded-xl border border-white/[0.08] py-16 text-center">
              <p className="text-white/40 text-sm">No answers recorded for this session.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
