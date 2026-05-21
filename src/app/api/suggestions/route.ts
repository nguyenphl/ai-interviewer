import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getResourcesForTopic } from "@/lib/suggestions/resources";

export async function GET() {
  const weakTopics = await prisma.topicStat.findMany({
    where: { totalAnswers: { gte: 1 } },
    orderBy: { avgScore: "asc" },
    take: 6,
  });

  const suggestions = weakTopics.map((t) => ({
    ...t,
    resources: getResourcesForTopic(t.tag),
  }));

  return NextResponse.json(suggestions);
}
