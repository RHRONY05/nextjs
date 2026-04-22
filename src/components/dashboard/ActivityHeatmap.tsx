"use client";

import { useEffect, useState, useMemo } from "react";

interface Submission {
  id: number;
  verdict: string;
  creationTimeSeconds: number;
  problem: { contestId: number; index: string };
}

type DayMap = Map<string, number>; // "2024-04-22" → count

function toDateKey(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 10);
}

function buildDayMap(submissions: Submission[]): DayMap {
  const seen = new Set<string>();
  const map: DayMap = new Map();

  for (const s of submissions) {
    if (s.verdict !== "OK") continue;
    // Deduplicate: same problem solved twice on same day = 1 solve
    const key = `${s.problem.contestId}-${s.problem.index}-${toDateKey(s.creationTimeSeconds)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const d = toDateKey(s.creationTimeSeconds);
    map.set(d, (map.get(d) ?? 0) + 1);
  }
  return map;
}

function getColor(count: number): string {
  if (count === 0) return "rgba(128, 128, 128, 0.1)"; // Semi-transparent grey for zero
  if (count <= 2) return "#9be9a8";
  if (count <= 4) return "#40c463";
  if (count <= 6) return "#30a14e";
  return "#216e39";
}

function buildGrid(year: number): Date[] {
  // Start from the Sunday before Jan 1
  const jan1 = new Date(year, 0, 1);
  const start = new Date(jan1);
  start.setDate(jan1.getDate() - jan1.getDay()); // rewind to Sunday

  const end = new Date(year, 11, 31);
  const days: Date[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "Wed", "Fri"];

export default function ActivityHeatmap({ handle }: { handle: string }) {
  const [dayMap, setDayMap] = useState<DayMap>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const cleanHandle = handle?.trim();
    if (!cleanHandle) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    setLoading(true);
    setError(null);

    fetch(`https://codeforces.com/api/user.status?handle=${cleanHandle}&from=1&count=10000`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data.status !== "OK") throw new Error(data.comment ?? "API error");
        setDayMap(buildDayMap(data.result));
      })
      .catch((e) => {
        if (e.name === "AbortError") {
          setError("Request timed out. Codeforces API might be slow.");
        } else {
          setError(e.message);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [handle, mounted]);

  const grid = useMemo(() => buildGrid(year), [year]);
  const weeks = useMemo(() => {
    const w: Date[][] = [];
    for (let i = 0; i < grid.length; i += 7) w.push(grid.slice(i, i + 7));
    return w;
  }, [grid]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: { month: number; col: number }[] = [];
    weeks.forEach((week, col) => {
      const m = week[0].getMonth();
      if (col === 0 || weeks[col - 1][0].getMonth() !== m) {
        labels.push({ month: m, col });
      }
    });
    return labels;
  }, [weeks]);

  const CELL = 13; // px
  const GAP = 3;
  const STEP = CELL + GAP;

  // Stats
  const allTime = useMemo(() => [...dayMap.values()].reduce((a, b) => a + b, 0), [dayMap]);
  const yearKeys = useMemo(() => [...dayMap.keys()].filter((k) => k.startsWith(`${year}-`)), [dayMap, year]);
  const yearSolves = useMemo(() => yearKeys.reduce((a, k) => a + (dayMap.get(k) ?? 0), 0), [yearKeys, dayMap]);

  // Streak (longest in year)
  const maxStreak = useMemo(() => {
    let best = 0,
      cur = 0;
    grid.forEach((d) => {
      if (d.getFullYear() !== year) return;
      const k = d.toISOString().slice(0, 10);
      if ((dayMap.get(k) ?? 0) > 0) {
        cur++;
        best = Math.max(best, cur);
      } else cur = 0;
    });
    return best;
  }, [grid, dayMap, year]);

  if (!mounted) {
    return (
      <div className="activity-heatmap" style={{ marginTop: "2rem" }}>
        <div className="activity-heatmap--skeleton" style={{ height: "200px", background: "var(--color-surface-low)", borderRadius: "8px", opacity: 0.5 }} />
      </div>
    );
  }

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.875rem",
          color: "var(--color-on-surface-variant)",
          padding: "1rem 0",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            border: "2px solid var(--color-outline-variant)",
            borderTop: "2px solid var(--color-primary)",
            borderRadius: "50%",
            animation: "spinCW 0.8s linear infinite",
          }}
        />
        Loading activity…
      </div>
    );
  if (error)
    return (
      <p style={{ fontSize: "0.875rem", color: "var(--color-error)", padding: "1rem 0" }}>
        Error loading activity: {error}
      </p>
    );

  return (
    <div className="activity-heatmap" style={{ marginTop: "2rem" }}>
      {/* Year picker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            margin: 0,
            color: "var(--color-on-surface)",
          }}
        >
          Submission Activity
        </h3>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            fontSize: "0.75rem",
            background: "var(--color-surface-low)",
            color: "var(--color-on-surface)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem" }}>
        <svg
          width={weeks.length * STEP + 32}
          height={7 * STEP + 28}
          suppressHydrationWarning // ← fix for SSR mismatch on dynamic widths
        >
          {/* Month labels */}
          {monthLabels.map(({ month, col }) => (
            <text
              key={`${month}-${col}`}
              x={32 + col * STEP}
              y={10}
              fontSize={10}
              fill="var(--color-on-surface-variant)"
              opacity={0.8}
            >
              {MONTHS[month]}
            </text>
          ))}

          {/* Day labels */}
          {DAYS.map((d, i) => (
            <text
              key={d}
              x={0}
              y={20 + (i * 2 + 1) * STEP + CELL / 2}
              fontSize={10}
              fill="var(--color-on-surface-variant)"
              opacity={0.8}
              dominantBaseline="middle"
            >
              {d}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, col) =>
            week.map((day, row) => {
              const k = day.toISOString().slice(0, 10);
              const count = dayMap.get(k) ?? 0;
              const inYear = day.getFullYear() === year;
              return (
                <rect
                  key={k}
                  x={32 + col * STEP}
                  y={20 + row * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={inYear ? getColor(count) : "transparent"}
                >
                  <title>
                    {k}: {count} problem{count !== 1 ? "s" : ""}
                  </title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Footer: Legend & Stats */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.75rem",
            color: "var(--color-on-surface-variant)",
          }}
        >
          <span>Less</span>
          {[0, 1, 3, 5, 7].map((n) => (
            <div
              key={n}
              style={{
                width: CELL,
                height: CELL,
                borderRadius: 2,
                background: getColor(n),
                border: n === 0 ? "1px solid var(--color-outline-variant)" : "none",
              }}
            />
          ))}
          <span>More</span>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "2rem" }}>
          {[
            { label: "Solved all time", value: allTime },
            { label: `Solved in ${year}`, value: yearSolves },
            { label: `Max streak (${year})`, value: `${maxStreak}d` },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: 0,
                  color: "var(--color-on-surface)",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
