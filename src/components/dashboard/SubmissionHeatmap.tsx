"use client";

import { useMemo } from "react";

interface Props {
  totalSubmissions?: number;
}

// Deterministic pseudo-random (same seed → same output)
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

type Level = 0 | 1 | 2 | 3 | 4;

interface Cell {
  key: string;
  count: number;
  level: Level;
  visible: boolean;
  title: string;
}

interface Week {
  cells: Cell[];
  monthLabel: string | null;
}

function buildHeatmapData(): { weeks: Week[]; totalSubs: number } {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Align to the Sunday of that week
  const startDate = new Date(oneYearAgo);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Build activity map using seeded random
  const activityMap: Record<string, number> = {};
  let totalSubs = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const recencyBoost = i > 300 ? 0.4 : 0;
    if (seededRandom(i) < 0.3 + recencyBoost) {
      const count = Math.ceil(seededRandom(i + 500) * 6);
      activityMap[key] = count;
      totalSubs += count;
    }
  }

  const weeks: Week[] = [];
  let currentMonth: number | null = null;
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const monthAtStart = cursor.getMonth();
    const monthLabel =
      monthAtStart !== currentMonth
        ? cursor.toLocaleDateString("en", { month: "short" })
        : null;
    if (monthAtStart !== currentMonth) currentMonth = monthAtStart;

    const cells: Cell[] = [];
    for (let day = 0; day < 7; day++) {
      const d = new Date(cursor);
      d.setDate(d.getDate() + day);
      const visible = d <= today;
      const key = d.toISOString().slice(0, 10);
      const count = visible ? (activityMap[key] ?? 0) : 0;
      const level: Level = !visible
        ? 0
        : count === 0
        ? 0
        : count <= 1
        ? 1
        : count <= 3
        ? 2
        : count <= 5
        ? 3
        : 4;
      const title = visible
        ? `${d.toLocaleDateString("en", { month: "short", day: "numeric" })}: ${count} submission${count !== 1 ? "s" : ""}`
        : "";
      cells.push({ key, count, level, visible, title });
    }

    weeks.push({ cells, monthLabel });
    cursor.setDate(cursor.getDate() + 7);
  }

  return { weeks, totalSubs };
}

const LEVEL_COLORS: Record<Level, string> = {
  0: "var(--color-surface-container)",
  1: "rgba(88,101,242,0.25)",
  2: "rgba(88,101,242,0.45)",
  3: "rgba(88,101,242,0.65)",
  4: "rgba(88,101,242,0.85)",
};

export default function SubmissionHeatmap({ totalSubmissions }: Props) {
  const { weeks, totalSubs } = useMemo(() => buildHeatmapData(), []);
  const displayTotal = totalSubmissions ?? totalSubs;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--color-surface-low)",
        padding: "1.25rem 1.5rem",
      }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-display font-bold"
          style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
        >
          Submission Activity
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--color-outline)" }}>
          {displayTotal} submissions in the last year
        </span>
      </div>

      {/* Scrollable grid */}
      <div className="overflow-x-auto">
        {/* Month labels row */}
        <div className="flex" style={{ gap: "3px", marginBottom: "6px", paddingLeft: "0px" }}>
          {weeks.map((week, i) => (
            <div
              key={i}
              style={{ width: "12px", minWidth: "12px", flexShrink: 0, overflow: "visible" }}
            >
              {week.monthLabel ? (
                <span
                  style={{
                    fontSize: "0.625rem",
                    color: "var(--color-outline)",
                    whiteSpace: "nowrap",
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {week.monthLabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        {/* Cell grid */}
        <div className="flex" style={{ gap: "3px" }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: "3px" }}>
              {week.cells.map((cell, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={cell.title}
                  className="heatmap-cell-hover"
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "2px",
                    background: LEVEL_COLORS[cell.level],
                    opacity: cell.visible ? 1 : 0,
                    cursor: cell.visible && cell.count > 0 ? "default" : "default",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <span style={{ fontSize: "0.6875rem", color: "var(--color-outline)" }}>
          Less
        </span>
        <div className="flex" style={{ gap: "3px" }}>
          {([0, 1, 2, 3, 4] as Level[]).map((level) => (
            <div
              key={level}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: LEVEL_COLORS[level],
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: "0.6875rem", color: "var(--color-outline)" }}>
          More
        </span>
      </div>
    </div>
  );
}
