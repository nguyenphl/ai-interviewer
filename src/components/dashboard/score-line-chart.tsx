"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ScoreTrendPoint } from "@/types";

interface Props {
  data: ScoreTrendPoint[];
}

export function ScoreLineChart({ data }: Props) {
  if (data.length < 2) {
    return (
      <p className="text-center text-white/40 text-sm py-8">
        Complete at least 2 sessions to see your score trend.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
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
          formatter={(value) => [`${Number(value).toFixed(1)} / 10`, "Score"]}
          labelFormatter={(label) => `Session: ${label}`}
        />
        <ReferenceLine y={7} stroke="rgba(74,222,128,0.3)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#60a5fa"
          strokeWidth={2}
          dot={{ fill: "#60a5fa", strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: "#93c5fd" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
