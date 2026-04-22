"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Card {
  _id: string;
  contestId: number;
  problemIndex: string;
  problemName: string;
  problemUrl: string;
  rating?: number;
  tags: string[];
  column: "to_upsolve" | "trying" | "solved";
  position: number;
  source: string;
  contestName?: string;
  addedAt: string;
  solvedAt?: string;
  notes: string;
}

interface Columns {
  to_upsolve: Card[];
  trying: Card[];
  solved: Card[];
}

export default function BoardPage() {
  const router = useRouter();
  const [columns, setColumns] = useState<Columns>({
    to_upsolve: [],
    trying: [],
    solved: [],
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [problemUrl, setProblemUrl] = useState("");
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      const res = await fetch("/api/board");
      const data = await res.json();
      if (!data.error) {
        // Sort "To Upsolve" by rating (ascending)
        const sortedToUpsolve = [...data.columns.to_upsolve].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingA - ratingB;
        });
        
        setColumns({
          to_upsolve: sortedToUpsolve,
          trying: data.columns.trying,
          solved: data.columns.solved,
        });
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  async function handleSyncContests() {
    setSyncing(true);
    try {
      const res = await fetch("/api/board/sync-contests", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        if (data.addedCards === 0) {
          alert(data.message || "No new problems to add from your participated contests.");
        } else {
          alert(data.message || `Added ${data.addedCards} problem${data.addedCards > 1 ? 's' : ''}!`);
        }
        fetchCards();
      } else {
        alert(data.message || "Sync failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setSyncing(false);
    }
  }

  async function handleClearSynced() {
    if (!confirm("This will remove all contest-synced problems from your board. Manually added problems will remain. Continue?")) {
      return;
    }

    setClearing(true);
    try {
      const res = await fetch("/api/board/clear-synced", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || `Cleared ${data.deletedCount} problems`);
        fetchCards();
      } else {
        alert(data.message || "Failed to clear problems");
      }
    } catch {
      alert("Network error");
    } finally {
      setClearing(false);
    }
  }

  async function handleAddProblem() {
    if (!problemUrl.trim()) return;

    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Problem added to board!");
        setProblemUrl("");
        setShowAddModal(false);
        fetchCards();
      } else {
        alert(data.message || "Failed to add problem");
      }
    } catch {
      alert("Network error");
    }
  }

  async function handleMoveCard(card: Card, newColumn: string) {
    try {
      const res = await fetch("/api/board/move", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card._id,
          newColumn,
          newPosition: 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.xpAwarded) {
          alert(`🎉 Problem solved! +${data.xpAwarded} XP`);
        }
        fetchCards();
      } else {
        alert(data.message || "Failed to move card");
      }
    } catch {
      alert("Network error");
    }
  }

  async function handleDeleteCard(cardId: string) {
    if (!confirm("Delete this problem from your board?")) return;

    try {
      const res = await fetch(`/api/board/${cardId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCards();
      } else {
        alert("Failed to delete card");
      }
    } catch {
      alert("Network error");
    }
  }

  function handleDragStart(card: Card) {
    setDraggedCard(card);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(newColumn: string) {
    if (draggedCard && draggedCard.column !== newColumn) {
      handleMoveCard(draggedCard, newColumn);
    }
    setDraggedCard(null);
  }

  function ProblemCard({ card, showNumber, number }: { card: Card; showNumber?: boolean; number?: number }) {
    return (
      <div
        className="problem-card"
        draggable
        onDragStart={() => handleDragStart(card)}
        style={{
          background: "var(--color-surface-container)",
          borderRadius: "var(--radius-lg)",
          padding: "1rem",
          paddingLeft: showNumber ? "3rem" : "1rem",
          position: "relative",
          cursor: "grab",
          transition: "transform 0.2s, box-shadow 0.2s",
          border: "1px solid var(--color-outline-variant)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Number Badge */}
        {showNumber && number !== undefined && (
          <div
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "1rem",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "var(--color-on-primary-container)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              boxShadow: "0 2px 8px rgba(88, 101, 242, 0.3)",
            }}
          >
            {number}
          </div>
        )}

        {/* Header: ID + Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-primary)",
            }}
          >
            {card.contestId}
            {card.problemIndex}
          </span>
          {card.rating && (
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
              {card.rating}
            </span>
          )}
        </div>

        {/* Problem Name */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            marginBottom: "0.5rem",
            lineHeight: 1.4,
          }}
        >
          {card.problemName}
        </div>

        {/* Contest Name */}
        {card.contestName && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-on-surface-variant)",
              marginBottom: "0.75rem",
            }}
          >
            {card.contestName}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.75rem" }}>
          {card.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.6875rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                background: "var(--color-surface-high)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <a
            href={card.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.375rem",
              padding: "0.5rem",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "var(--color-on-primary-container)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <svg
              width="14"
              height="14"
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
            Open
          </a>
          <button
            onClick={() => handleDeleteCard(card._id)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "var(--radius-md)",
              background: "transparent",
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-error)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-error)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading board...</div>;
  }

  return (
    <>
      <header className="board-header">
        <div className="board-header__left">
          <h1 className="board-header__title">Upsolve Board</h1>
        </div>
        <div className="board-header__right">
          <button
            className="btn-clear"
            onClick={handleClearSynced}
            disabled={clearing}
            style={{ 
              opacity: clearing ? 0.6 : 1,
              background: "transparent",
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!clearing) {
                e.currentTarget.style.background = "var(--color-error)";
                e.currentTarget.style.color = "white";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-error)";
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            {clearing ? "Clearing..." : "Clear Synced"}
          </button>
          <button
            className="btn-sync"
            onClick={handleSyncContests}
            disabled={syncing}
            style={{ opacity: syncing ? 0.6 : 1 }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: syncing ? "spinCW 1s linear infinite" : "none" }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {syncing ? "Syncing..." : "Sync Contest Problems"}
          </button>
          <button className="btn-add-problem" onClick={() => setShowAddModal(true)}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Problem
          </button>
        </div>
      </header>

      <div className="board-area">
        {/* To Upsolve Column */}
        <div
          className="kanban-col"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("to_upsolve")}
          style={{
            maxHeight: "calc(100vh - 180px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="kanban-col__header">
            <span className="kanban-col__title">To Upsolve</span>
            <span className="kanban-col__badge">{columns.to_upsolve.length}</span>
          </div>
          <div
            className="kanban-col__body"
            style={{
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {columns.to_upsolve.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  color: "var(--color-outline)",
                  fontSize: "0.875rem",
                }}
              >
                No problems yet. Click "Sync Contest Problems" to add unsolved problems from contests you participated in, or "Add Problem" to manually add any problem!
              </div>
            ) : (
              columns.to_upsolve.map((card, index) => (
                <ProblemCard key={card._id} card={card} showNumber number={index + 1} />
              ))
            )}
          </div>
        </div>

        {/* Trying Column */}
        <div
          className="kanban-col kanban-col--trying"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("trying")}
          style={{
            maxHeight: "calc(100vh - 180px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="kanban-col__header">
            <span className="kanban-col__title">Trying</span>
            <span className="kanban-col__badge">{columns.trying.length}</span>
          </div>
          <div
            className="kanban-col__body"
            style={{
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {columns.trying.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  color: "var(--color-outline)",
                  fontSize: "0.875rem",
                }}
              >
                Drag problems here when you start working on them
              </div>
            ) : (
              columns.trying.map((card) => <ProblemCard key={card._id} card={card} />)
            )}
          </div>
        </div>

        {/* Solved Column */}
        <div
          className="kanban-col kanban-col--solved"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("solved")}
          style={{
            maxHeight: "calc(100vh - 180px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="kanban-col__header">
            <span className="kanban-col__title">Solved</span>
            <span className="kanban-col__badge">{columns.solved.length}</span>
          </div>
          <div
            className="kanban-col__body"
            style={{
              overflowY: "auto",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {columns.solved.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 1rem",
                  color: "var(--color-outline)",
                  fontSize: "0.875rem",
                }}
              >
                Drag problems here when you solve them to earn XP!
              </div>
            ) : (
              columns.solved.map((card) => <ProblemCard key={card._id} card={card} />)
            )}
          </div>
        </div>
      </div>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--color-surface-container)",
              borderRadius: "var(--radius-xl)",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              Add Problem to Board
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
              Paste a Codeforces problem URL:
            </p>
            <input
              type="text"
              value={problemUrl}
              onChange={(e) => setProblemUrl(e.target.value)}
              placeholder="https://codeforces.com/contest/1234/problem/A"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-high)",
                border: "1px solid var(--color-outline-variant)",
                color: "var(--color-on-surface)",
                marginBottom: "1rem",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddProblem();
              }}
            />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={handleAddProblem}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                  color: "var(--color-on-primary-container)",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add Problem
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface-high)",
                  color: "var(--color-on-surface)",
                  border: "1px solid var(--color-outline-variant)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
