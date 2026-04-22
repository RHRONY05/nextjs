"use client";

import { useEffect, useState } from "react";

interface Problem {
  contestId: number;
  problemIndex: string;
  problemName: string;
  problemUrl: string;
  rating: number;
  tags: string[];
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(800);
  const [maxRating, setMaxRating] = useState(1600);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  async function fetchTopics() {
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();
      if (!data.error) {
        setTopics(data.topics);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  }

  async function fetchProblems(topic: string) {
    setLoading(true);
    setSelectedTopic(topic);
    try {
      const res = await fetch(
        `/api/topics?topic=${encodeURIComponent(topic)}&minRating=${minRating}&maxRating=${maxRating}`
      );
      const data = await res.json();
      if (!data.error) {
        setProblems(data.problems);
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addToBoard(problem: Problem) {
    setAdding(`${problem.contestId}-${problem.problemIndex}`);
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemUrl: problem.problemUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Added "${problem.problemName}" to Trying column!`);
      } else {
        alert(data.message || "Failed to add problem");
      }
    } catch (error) {
      alert("Network error");
    } finally {
      setAdding(null);
    }
  }

  return (
    <>
      <header
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid var(--color-outline-variant)",
          background: "var(--color-surface-container-low)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--color-on-surface)",
          }}
        >
          Topic Ladder
        </h1>
        <p
          style={{
            marginTop: "0.5rem",
            color: "var(--color-on-surface-variant)",
            fontSize: "0.875rem",
          }}
        >
          Practice problems by topic and rating range
        </p>
      </header>

      <div style={{ padding: "2rem" }}>
        {/* Rating Range Selector */}
        <div
          style={{
            background: "var(--color-surface-container)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "2rem",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Rating Range
          </h3>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  marginBottom: "0.5rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Min Rating
              </label>
              <input
                type="number"
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                min={800}
                max={3500}
                step={100}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-high)",
                  border: "1px solid var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  marginBottom: "0.5rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                Max Rating
              </label>
              <input
                type="number"
                value={maxRating}
                onChange={(e) => setMaxRating(parseInt(e.target.value))}
                min={800}
                max={3500}
                step={100}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-high)",
                  border: "1px solid var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        {!selectedTopic && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => fetchProblems(topic)}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-surface-container)",
                  border: "1px solid var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  textTransform: "capitalize",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-primary-container)";
                  e.currentTarget.style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface-container)";
                  e.currentTarget.style.borderColor = "var(--color-outline-variant)";
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        )}

        {/* Problems List */}
        {selectedTopic && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setProblems([]);
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-container)",
                  border: "1px solid var(--color-outline-variant)",
                  color: "var(--color-on-surface)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {selectedTopic}
              </h2>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                ({problems.length} problems)
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>Loading problems...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {problems.map((problem, index) => (
                  <div
                    key={`${problem.contestId}-${problem.problemIndex}`}
                    style={{
                      background: "var(--color-surface-container)",
                      borderRadius: "var(--radius-lg)",
                      padding: "1rem",
                      border: "1px solid var(--color-outline-variant)",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                        color: "var(--color-on-primary-container)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "var(--color-primary)",
                          }}
                        >
                          {problem.contestId}
                          {problem.problemIndex}
                        </span>
                        {problem.rating && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(88, 101, 242, 0.15)",
                              color: "var(--color-primary)",
                              fontWeight: 600,
                            }}
                          >
                            {problem.rating}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--color-on-surface)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {problem.problemName}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a
                        href={problem.problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "var(--radius-md)",
                          background:
                            "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                          color: "var(--color-on-primary-container)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                        }}
                      >
                        Open
                      </a>
                      <button
                        onClick={() => addToBoard(problem)}
                        disabled={adding === `${problem.contestId}-${problem.problemIndex}`}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "var(--radius-md)",
                          background: "var(--color-surface-high)",
                          border: "1px solid var(--color-primary)",
                          color: "var(--color-primary)",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity:
                            adding === `${problem.contestId}-${problem.problemIndex}` ? 0.6 : 1,
                        }}
                      >
                        {adding === `${problem.contestId}-${problem.problemIndex}`
                          ? "Adding..."
                          : "Add to Board"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
