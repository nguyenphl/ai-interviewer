import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { subDays, format } from "date-fns";

export async function GET() {
  const [totalSessions, topicStats, recentSessions, allSessions, scoreHistory] =
    await Promise.all([
      prisma.session.count({ where: { status: "completed" } }),
      prisma.topicStat.findMany({ orderBy: { avgScore: "asc" }, take: 10 }),
      prisma.session.findMany({
        where: { status: "completed" },
        orderBy: { completedAt: "desc" },
        take: 10,
        include: { _count: { select: { questions: true } } },
      }),
      prisma.session.findMany({
        where: { status: "completed", completedAt: { gte: subDays(new Date(), 365) } },
        select: { completedAt: true },
      }),
      prisma.session.findMany({
        where: { status: "completed", totalScore: { not: null } },
        orderBy: { completedAt: "asc" },
        take: 30,
        select: { completedAt: true, totalScore: true, role: true },
      }),
    ]);

  const avgScore =
    recentSessions.length > 0
      ? parseFloat(
          (
            recentSessions
              .map((s) => s.totalScore ?? 0)
              .reduce((a, b) => a + b, 0) / recentSessions.length
          ).toFixed(2)
        )
      : 0;

  const activityMap = new Map<string, number>();
  for (const s of allSessions) {
    if (!s.completedAt) continue;
    const d = format(s.completedAt, "yyyy-MM-dd");
    activityMap.set(d, (activityMap.get(d) ?? 0) + 1);
  }
  const activityDates = Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    if (activityMap.has(d)) streak++;
    else if (i > 0) break;
  }

  const scoreTrend = scoreHistory.map((s, idx) => ({
    index: idx + 1,
    score: parseFloat((s.totalScore ?? 0).toFixed(2)),
    date: s.completedAt ? format(s.completedAt, "MMM d") : "",
    role: s.role,
  }));

  return NextResponse.json({
    totalSessions,
    avgScore,
    streak,
    topicStats,
    recentSessions,
    activityDates,
    scoreTrend,
  });
}
