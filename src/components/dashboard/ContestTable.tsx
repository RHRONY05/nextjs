"use client";

import { useState } from "react";
import type { ContestHistoryEntry } from "@/types";

interface Props {
  data: ContestHistoryEntry[];
}

const ROWS_PER_PAGE = 5;

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContestTable({ data }: Props) {
  const [page, setPage] = useState(1);

  const sorted = [...data].reverse(); // most recent first
  const totalPages = Math.ceil(sorted.length / ROWS_PER_PAGE);
  const slice = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <div
      className="rounded-xl"
      style={{ background: "var(--color-surface-low)", padding: "1.25rem 1.5rem" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-display font-bold"
          style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}
        >
          Contest History
        </span>
        <span style={{ fontSize: "0.75rem", color: "var(--color-outline)" }}>
          Last {data.length} rated contests
        </span>
      </div>

      {/* Table */}
      <table className="w-full" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Contest", "Rank", "Old Rating", "New Rating", "Change"].map((h) => (
              <th
                key={h}
                className="text-left"
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--color-outline)",
                  padding: "0.5rem 0.75rem",
                  borderBottom: "1px solid var(--color-outline-variant)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slice.map((d, i) => {
            const delta = d.ratingChange;
            const sign = delta >= 0 ? "+" : "";
            const isLast = i === slice.length - 1;
            return (
              <ContestRow
                key={d.contestId}
                entry={d}
                delta={delta}
                sign={sign}
                isLast={isLast}
                formatDate={formatDate}
              />
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <PageBtn
          label="‹"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          active={false}
        />
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PageBtn
            key={p}
            label={String(p)}
            onClick={() => setPage(p)}
            disabled={false}
            active={p === page}
          />
        ))}
        <PageBtn
          label="›"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          active={false}
        />
      </div>
    </div>
  );
}

// Separate component so hover state can be managed per-row
function ContestRow({
  entry,
  delta,
  sign,
  isLast,
  formatDate,
}: {
  entry: ContestHistoryEntry;
  delta: number;
  sign: string;
  isLast: boolean;
  formatDate: (d: Date | string) => string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--color-surface-container)" : "transparent",
        borderBottom: isLast ? "none" : "1px solid rgba(69,70,85,0.3)",
        transition: "background 0.15s",
      }}
    >
      <td style={{ padding: "0.75rem" }}>
        <div style={{ color: "var(--color-on-surface)", fontWeight: 500 }}>
          {entry.contestName}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--color-outline)",
            marginTop: "2px",
          }}
        >
          {formatDate(entry.participatedAt)}
        </div>
      </td>
      <td style={{ padding: "0.75rem" }}>
        <span
          className="font-mono font-semibold"
          style={{ fontSize: "0.8125rem", color: "var(--color-on-surface)" }}
        >
          #{entry.rank.toLocaleString()}
        </span>
      </td>
      <td style={{ padding: "0.75rem" }}>
        <span
          className="font-mono"
          style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)" }}
        >
          {entry.oldRating}
        </span>
      </td>
      <td style={{ padding: "0.75rem" }}>
        <span
          className="font-mono"
          style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)" }}
        >
          {entry.newRating}
        </span>
      </td>
      <td style={{ padding: "0.75rem" }}>
        <span
          className="font-mono font-bold"
          style={{
            fontSize: "0.8125rem",
            color: delta >= 0 ? "var(--color-secondary)" : "var(--color-error)",
          }}
        >
          {sign}{delta}
        </span>
      </td>
    </tr>
  );
}

function PageBtn({
  label,
  onClick,
  disabled,
  active,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  active: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-md transition-colors"
      style={{
        width: "32px",
        height: "32px",
        fontSize: "0.8125rem",
        border: "1px solid var(--color-outline-variant)",
        background: active ? "var(--color-primary-container)" : "transparent",
        color: active ? "var(--color-on-primary-container)" : "var(--color-on-surface-variant)",
        fontWeight: active ? 700 : 400,
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}
