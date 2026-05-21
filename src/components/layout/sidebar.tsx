"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, History, Lightbulb, Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sessions/new", label: "New Interview", icon: PlayCircle },
  { href: "/sessions", label: "History", icon: History },
  { href: "/suggestions", label: "Suggestions", icon: Lightbulb },
  { href: "/profile", label: "My Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-60 flex-col bg-neutral-950 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">AI Interviewer</p>
            <p className="text-[10px] text-white/40 leading-none mt-0.5">Practice & Improve</p>
          </div>
        </Link>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1">
        <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
          Menu
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/sessions/new" &&
              pathname.startsWith(href + "/") &&
              !pathname.startsWith("/sessions/new"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/[0.06] hover:text-white/90"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/40")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="px-4 pb-5">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-600/10 border border-white/[0.06] p-3">
          <p className="text-xs font-medium text-white/70">Ready to practice?</p>
          <p className="text-[11px] text-white/35 mt-0.5 leading-relaxed">
            Get AI feedback on your answers instantly.
          </p>
          <Link
            href="/sessions/new"
            className="mt-2.5 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            Start Interview
          </Link>
        </div>
      </div>
    </aside>
  );
}
