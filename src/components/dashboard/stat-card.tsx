import type { ReactNode } from "react";

const accentMap = {
  blue:   { icon: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   bar: "from-blue-500 to-blue-400" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "from-violet-500 to-violet-400" },
  orange: { icon: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", bar: "from-orange-500 to-amber-400" },
};

interface Props {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: keyof typeof accentMap;
}

export function StatCard({ label, value, icon, accent = "blue" }: Props) {
  const a = accentMap[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${a.bar} opacity-60`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-widest">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white tabular-nums">{value}</p>
        </div>
        <div className={`rounded-lg ${a.bg} ${a.border} border p-2 ${a.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
