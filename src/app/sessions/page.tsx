import prisma from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Plus, ArrowUpRight, Clock } from "lucide-react";

export default async function SessionsPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { questions: true } } },
  });

  const completed = sessions.filter((s) => s.status === "completed");
  const active = sessions.filter((s) => s.status === "active");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Session History</h1>
          <p className="text-white/40 text-sm mt-1">{sessions.length} total sessions</p>
        </div>
        <Link
          href="/sessions/new"
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Interview
        </Link>
      </div>

      {sessions.length === 0 && (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] py-20 text-center">
          <p className="text-white/50 text-sm font-medium">No sessions yet</p>
          <Link href="/sessions/new" className="mt-2 inline-block text-blue-400 hover:underline text-sm">
            Start your first interview →
          </Link>
        </div>
      )}

      {active.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-white/30 uppercase tracking-widest">
            <Clock className="h-3 w-3" /> In Progress
          </p>
          <div className="space-y-1.5">
            {active.map((s) => <SessionRow key={s.id} session={s} />)}
          </div>
          <Separator className="opacity-10 mt-4" />
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          {active.length > 0 && (
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Completed</p>
          )}
          <div className="space-y-1.5">
            {completed.map((s) => <SessionRow key={s.id} session={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionRow({
  session: s,
}: {
  session: {
    id: string;
    role: string;
    level: string;
    language: string;
    sessionType: string;
    status: string;
    totalScore: number | null;
    createdAt: Date;
    _count: { questions: number };
  };
}) {
  const href = s.status === "completed" ? `/sessions/${s.id}/review` : `/sessions/${s.id}`;

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.06] hover:border-white/10 transition-all"
    >
      {/* Score */}
      <div className="shrink-0 w-12 text-center">
        {s.totalScore != null && (
          <span
            className={`text-lg font-bold tabular-nums ${
              s.totalScore >= 7
                ? "text-emerald-400"
                : s.totalScore >= 5
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {s.totalScore.toFixed(1)}
          </span>
        )}
      </div>

      <div className="h-8 w-px bg-white/[0.06] shrink-0" />

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white capitalize">{s.role}</span>
          <span className="text-xs text-white/40 capitalize">{s.level}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs text-white/40 capitalize">{s.sessionType}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs text-white/40">{s.language}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge
            variant={s.status === "completed" ? "success" : "secondary"}
            className="text-[10px] h-4 px-1.5"
          >
            {s.status}
          </Badge>
          <span className="text-xs text-white/25">{s._count.questions}q</span>
          <span className="text-xs text-white/25">
            {formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
    </Link>
  );
}
