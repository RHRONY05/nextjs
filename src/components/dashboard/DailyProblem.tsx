"use client";

import { useEffect, useState } from "react";

interface Problem {
  contestId: number;
  index: string;
  name: string;
  rating: number;
  tags: string[];
  url: string;
}

interface Recommendation {
  currentRating: number;
  targetRating: number;
  difficulty: "challenging" | "moderate" | "practice";
}

export default function DailyProblem() {
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/daily-problem")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.message);
        } else {
          setProblem(data.problem);
          setRecommendation(data.recommendation);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load daily problem");
        setLoading(false);
      });
  }, []);

  const difficultyColors = {
    challenging: { bg: "rgba(255, 107, 107, 0.1)", text: "#FF6B6B", label: "Challenging" },
    moderate: { bg: "rgba(255, 184, 77, 0.1)", text: "#FFB84D", label: "Moderate" },
    practice: { bg: "rgba(93, 220, 179, 0.1)", text: "#5DDCB3", label: "Practice" },
  };

  if (loading) {
    return (
      <div
        className="daily-problem-card"
        style={{
          background: "var(--color-surface-container)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div style={{ textAlign: "center", color: "var(--color-on-surface-variant)" }}>
          Loading daily problem...
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div
        className="daily-problem-card"
        style={{
          background: "var(--color-surface-container)",
          borderRadius: "var(--radius-xl)",
          padding: "1.5rem",
          border: "1px solid var(--color-outline-variant)",
        }}
      >
        <div style={{ textAlign: "center", color: "var(--color-error)" }}>
          {error || "No problem available"}
        </div>
      </div>
    );
  }

  const diffStyle = difficultyColors[recommendation?.difficulty || "moderate"];

  return (
    <div
      className="daily-problem-card"
      style={{
        background: "var(--color-surface-container)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        border: "1px solid var(--color-primary-container)",
        boxShadow: "0 4px 12px rgba(88, 101, 242, 0.1)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
          }}
        >
          🎯
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--color-on-surface)",
            }}
          >
            Daily Problem Challenge
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>
            Keep your streak alive!
          </div>
        </div>
        <div
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            background: diffStyle.bg,
            color: diffStyle.text,
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {diffStyle.label}
        </div>
      </div>

      {/* Problem Info */}
      <div
        style={{
          background: "var(--color-surface-high)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-primary)",
            }}
          >
            {problem.contestId}{problem.index}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              background: "rgba(88, 101, 242, 0.1)",
              color: "var(--color-primary)",
            }}
          >
            {problem.rating}
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            marginBottom: "0.75rem",
          }}
        >
          {problem.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {problem.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.6875rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                background: "var(--color-surface-container)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Info */}
      {recommendation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "var(--color-surface-low)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>
            Your rating: <span style={{ fontWeight: 600, color: "var(--color-on-surface)" }}>{recommendation.currentRating}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>
            Target: <span style={{ fontWeight: 600, color: "var(--color-secondary)" }}>{recommendation.targetRating}</span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <a
        href={problem.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "0.75rem",
          borderRadius: "var(--radius-md)",
          background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
          color: "var(--color-on-primary-container)",
          fontFamily: "var(--font-display)",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Solve on Codeforces
      </a>
    </div>
  );
}
