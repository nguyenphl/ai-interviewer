import prisma from "@/lib/db/prisma";
import { getResourcesForTopic } from "@/lib/suggestions/resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { BookOpen, Video, FileText, GraduationCap, ExternalLink } from "lucide-react";

const typeIcon = {
  article: FileText,
  video: Video,
  docs: BookOpen,
  course: GraduationCap,
} as const;

export default async function SuggestionsPage() {
  let topicStats: Awaited<ReturnType<typeof prisma.topicStat.findMany>> = [];
  let dbError: string | null = null;

  try {
    topicStats = await prisma.topicStat.findMany({
      where: { totalAnswers: { gte: 1 } },
      orderBy: { avgScore: "asc" },
      take: 8,
    });
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  const suggestions = topicStats.map((t) => ({
    ...t,
    resources: getResourcesForTopic(t.tag),
  }));

  const weakCount = suggestions.filter((s) => s.avgScore < 6).length;

  return (
    <div className="min-h-full px-6 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Study Suggestions</h1>
          <p className="text-white/40 text-sm mt-1">Personalised from your interview history</p>
        </div>
        <Link
          href="/sessions/new"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
        >
          Practice Now →
        </Link>
      </div>

      {dbError && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="py-4">
            <p className="text-sm text-red-300 font-medium mb-1">Failed to load suggestions</p>
            <p className="text-xs text-red-400/70 font-mono break-all">{dbError}</p>
          </CardContent>
        </Card>
      )}

      {!dbError && suggestions.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-white/40">
            Complete some interviews first to get personalised suggestions.
          </CardContent>
        </Card>
      )}

      {!dbError && weakCount > 0 && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="py-4 flex items-center gap-3">
            <span className="text-yellow-400 text-lg">⚠</span>
            <p className="text-sm text-yellow-200/80">
              You have <strong>{weakCount}</strong> topic
              {weakCount !== 1 ? "s" : ""} scoring below 6/10. Focus on these first.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {suggestions.map((t) => {
          return (
            <Card key={t.tag}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{t.displayName}</CardTitle>
                    <p className="text-xs text-white/40 mt-1">
                      {t.totalAnswers} answer{t.totalAnswers !== 1 ? "s" : ""} · avg{" "}
                      <span
                        className={
                          t.avgScore >= 7
                            ? "text-green-400"
                            : t.avgScore >= 5
                            ? "text-yellow-400"
                            : "text-red-400"
                        }
                      >
                        {t.avgScore.toFixed(1)}
                      </span>
                      {" "}/ 10
                    </p>
                  </div>
                  <span
                    className={`text-2xl font-bold tabular-nums ${
                      t.avgScore >= 7
                        ? "text-green-400"
                        : t.avgScore >= 5
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {t.avgScore.toFixed(1)}
                  </span>
                </div>
                <Progress value={(t.avgScore / 10) * 100} className="mt-3" />
              </CardHeader>

              {t.resources.length > 0 && (
                <CardContent className="space-y-1">
                  <Separator className="mb-3" />
                  {t.resources.map((r) => {
                    const RIcon = typeIcon[r.type];
                    return (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/5 transition-colors group"
                      >
                        <RIcon className="h-4 w-4 text-white/30 shrink-0" />
                        <span className="text-sm text-blue-400 group-hover:underline flex-1">
                          {r.title}
                        </span>
                        <ExternalLink className="h-3 w-3 text-white/20 shrink-0" />
                      </a>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
