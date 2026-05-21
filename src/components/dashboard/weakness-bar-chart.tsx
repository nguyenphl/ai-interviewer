"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { TopicStatData } from "@/types";

interface Props {
  data: TopicStatData[];
}

function scoreColor(score: number) {
  if (score >= 7) return "#4ade80";
  if (score >= 5) return "#facc15";
  return "#f87171";
}

export function WeaknessBarChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-center text-white/40 text-sm py-8">
        No topic data yet. Complete some interviews first.
      </p>
    );
  }

  const sorted = [...data].sort((a, b) => a.avgScore - b.avgScore).slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="displayName"
          width={120}
          tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "white",
            fontSize: 12,
          }}
          formatter={(value) => [`${Number(value).toFixed(1)} / 10`, "Avg Score"]}
        />
        <Bar dataKey="avgScore" radius={[0, 4, 4, 0]}>
          {sorted.map((entry) => (
            <Cell key={entry.tag} fill={scoreColor(entry.avgScore)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
