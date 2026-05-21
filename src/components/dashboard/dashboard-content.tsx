import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Flame } from "lucide-react";
import { ScoreLineChart } from "./score-line-chart";
import { WeaknessBarChart } from "./weakness-bar-chart";
import { ActivityHeatmap } from "./activity-heatmap";
import { StatCard } from "./stat-card";
import { RecentSessionsList } from "./recent-sessions-list";
import { getDashboardData } from "@/lib/dashboard";

export async function DashboardContent() {
  let data;
  try {
    data = await getDashboardData();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-300">
        <p className="font-medium mb-1">Failed to load dashboard</p>
        <p className="font-mono text-xs text-red-400/70 break-all">{msg}</p>
      </div>
    );
  }

  if (data.totalSessions === 0) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 border border-white/10">
            <CheckCircle2 className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-white/60 text-sm font-medium">No sessions yet</p>
          <p className="text-white/30 text-xs mt-1">Start your first interview to see stats here</p>
          <Link
            href="/sessions/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            Start Interview
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Sessions Completed" value={data.totalSessions} icon={<CheckCircle2 className="h-5 w-5" />} accent="blue" />
        <StatCard label="Avg Score" value={data.totalSessions > 0 ? `${data.avgScore.toFixed(1)} / 10` : "—"} icon={<TrendingUp className="h-5 w-5" />} accent="violet" />
        <StatCard label="Current Streak" value={data.streak > 0 ? `${data.streak} day${data.streak !== 1 ? "s" : ""}` : "0 days"} icon={<Flame className="h-5 w-5" />} accent="orange" />
      </div>

      <Card>
        <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
        <CardContent><ActivityHeatmap data={data.activityDates} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Score Trend</CardTitle></CardHeader>
        <CardContent><ScoreLineChart data={data.scoreTrend} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Topic Performance</CardTitle></CardHeader>
        <CardContent><WeaknessBarChart data={data.topicStats} /></CardContent>
      </Card>

      <RecentSessionsList sessions={data.recentSessions} />
    </div>
  );
}
