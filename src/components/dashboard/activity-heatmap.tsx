"use client";
import { useMemo } from "react";
import { subDays, format, startOfWeek, eachDayOfInterval } from "date-fns";

interface Props {
  data: { date: string; count: number }[];
}

function levelColor(count: number): string {
  if (count === 0) return "bg-white/5";
  if (count === 1) return "bg-blue-900";
  if (count === 2) return "bg-blue-700";
  if (count <= 4) return "bg-blue-500";
  return "bg-blue-400";
}

export function ActivityHeatmap({ data }: Props) {
  const countMap = useMemo(
    () => new Map(data.map((d) => [d.date, d.count])),
    [data]
  );

  const weeks = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(subDays(today, 52 * 7), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end: today });

    const result: { date: string; count: number }[][] = [];
    let week: { date: string; count: number }[] = [];
    for (const day of days) {
      const dateStr = format(day, "yyyy-MM-dd");
      week.push({ date: dateStr, count: countMap.get(dateStr) ?? 0 });
      if (week.length === 7) {
        result.push(week);
        week = [];
      }
    }
    if (week.length) result.push(week);
    return result;
  }, [countMap]);

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-2">
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                className={`w-3 h-3 rounded-sm ${levelColor(day.count)} transition-colors`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-white/30">{total} session{total !== 1 ? "s" : ""} in the past year</p>
    </div>
  );
}
