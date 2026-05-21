import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function ProfileSectionCard({ icon, title, children }: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
