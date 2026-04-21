"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  tag: string;
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
        {label}
      </div>
      <div style={{ color: "var(--color-on-surface-variant)" }}>
        {payload[0].value} solved
      </div>
    </div>
  );
}

export default function TopicTagChart({ data }: Props) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--color-surface-low)" }}
    >
      <div
        className="font-display font-bold mb-4"
        style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
      >
        Top Topics
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
              tick={{
                fill: "var(--color-outline)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="tag"
              tick={{
                fill: "var(--color-outline)",
                fontSize: 11,
                fontFamily: "Inter, sans-serif",
              }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              cursor={{ fill: "rgba(93,220,179,0.05)" }}
            />
            <Bar
              dataKey="count"
              fill="rgba(93,220,179,0.5)"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
