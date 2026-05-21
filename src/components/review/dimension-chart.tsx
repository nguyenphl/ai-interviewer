"use client";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  accuracy: number;
  depth: number;
  communication: number;
  practical: number;
}

export function DimensionChart({ accuracy, depth, communication, practical }: Props) {
  const data = [
    { subject: "Accuracy", value: accuracy, full: 25 },
    { subject: "Depth", value: depth, full: 25 },
    { subject: "Communication", value: communication, full: 25 },
    { subject: "Practical", value: practical, full: 25 },
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "white",
            fontSize: 12,
          }}
          formatter={(value, _name, entry) => [
            `${Number(value)} / ${(entry.payload as { full?: number } | undefined)?.full ?? 25}`,
            "Score",
          ]}
        />
        <Radar
          dataKey="value"
          stroke="#60a5fa"
          fill="#3b82f6"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
