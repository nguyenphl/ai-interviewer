import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import type { SessionSummary } from "@/types";

export function RecentSessionsList({ sessions }: { sessions: SessionSummary[] }) {
  if (sessions.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Sessions</CardTitle>
          <Link
            href="/sessions"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-blue-400 transition-colors"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 px-3">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/sessions/${s.id}/review`}
            className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-white/[0.05] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="capitalize text-[11px]">{s.role}</Badge>
              <span className="text-sm text-white/60 capitalize">{s.level}</span>
              <span className="text-xs text-white/30">
                {new Date(s.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {s.totalScore != null ? (
                <span className={`text-sm font-bold tabular-nums ${
                  s.totalScore >= 7 ? "text-emerald-400" : s.totalScore >= 5 ? "text-amber-400" : "text-red-400"
                }`}>
                  {s.totalScore.toFixed(1)}
                </span>
              ) : (
                <span className="text-xs text-white/25">in progress</span>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
