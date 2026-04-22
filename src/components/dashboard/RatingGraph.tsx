"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import type { ContestHistoryEntry } from "@/types";

interface Props {
  data: ContestHistoryEntry[];
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en", { month: "short", year: "2-digit" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  const delta = entry.ratingChange;
  const sign = delta >= 0 ? "+" : "";
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{
        background: "#22263A",
        border: "1px solid var(--color-outline-variant)",
        fontSize: "0.8125rem",
        minWidth: "190px",
      }}
    >
      <div
        className="font-medium mb-1.5"
        style={{ color: "var(--color-on-surface)" }}
      >
        {entry.contestName}
      </div>
      <div style={{ color: "var(--color-on-surface-variant)" }}>
        Rating:{" "}
        <span className="font-mono">{entry.newRating}</span>
      </div>
      <div
        style={{
          color: delta >= 0 ? "var(--color-secondary)" : "var(--color-error)",
        }}
      >
        Change:{" "}
        <span className="font-mono font-bold">
          {sign}{delta}
        </span>
      </div>
      <div style={{ color: "var(--color-on-surface-variant)" }}>
        Rank: <span className="font-mono">#{entry.rank.toLocaleString()}</span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined || !payload) return null;
  const color = payload.ratingChange >= 0 ? "#5DDCB3" : "#FFB4AB";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
      stroke="#111319"
      strokeWidth={2}
    />
  );
}

export default function RatingGraph({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-surface-low)", height: "294px" }}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-display font-bold"
            style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
          >
            Rating Progress
          </span>
        </div>
        <div className="animate-pulse w-full h-[220px] bg-surface-container rounded-lg"></div>
      </div>
    );
  }

  const minRating = Math.min(...data.map((d) => d.newRating)) - 80;

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--color-surface-low)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-display font-bold"
          style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
        >
          Rating Progress
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--color-outline)" }}>
          Hover over points for contest details
        </span>
      </div>
      <div style={{ height: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="ratingAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5865F2" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5865F2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="participatedAt"
              tickFormatter={(v) => formatDate(v)}
              tick={{
                fill: "var(--color-outline)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[minRating, "auto"]}
              tick={{
                fill: "var(--color-outline)",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Area
              type="monotone"
              dataKey="newRating"
              stroke="#5865F2"
              strokeWidth={2.5}
              fill="url(#ratingAreaFill)"
              dot={(props) => <CustomDot {...props} />}
              activeDot={{ r: 7, strokeWidth: 2, stroke: "#111319", fill: "#BEC2FF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
