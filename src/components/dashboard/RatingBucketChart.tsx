"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";

interface DataPoint {
  rating: number;
  count: number;
}

interface Props {
  data: DataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2"
      style={{
        background: "#22263A",
        border: "1px solid var(--color-outline-variant)",
        fontSize: "0.8125rem",
      }}
    >
      <div style={{ color: "var(--color-on-surface)", marginBottom: "2px" }}>
        Rating {label}
      </div>
      <div style={{ color: "var(--color-on-surface-variant)" }}>
        {payload[0].value} problems
      </div>
    </div>
  );
}

export default function RatingBucketChart({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--color-surface-low)", height: "318px" }}
      >
        <div
          className="font-display font-bold mb-4"
          style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
        >
          Problems by Rating
        </div>
        <div className="animate-pulse w-full h-[240px] bg-surface-container rounded-lg"></div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--color-surface-low)" }}
    >
      <div
        className="font-display font-bold mb-4"
        style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
      >
        Problems by Rating
      </div>
      <div style={{ height: "240px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fill: "var(--color-outline)", fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="rating"
              tick={{
                fill: "var(--color-outline)",
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
              }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              cursor={{ fill: "rgba(88,101,242,0.05)" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={`rgba(88,101,242,${(0.4 + (i / data.length) * 0.5).toFixed(2)})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
