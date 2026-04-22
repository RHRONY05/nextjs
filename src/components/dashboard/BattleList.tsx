"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swords } from "lucide-react";

interface Battle {
  _id: string;
  userHandle: string;
  opponentHandle: string;
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
  startTime?: string;
  endTime?: string;
  status: "pending" | "active" | "completed" | "declined";
  winner: "user" | "opponent" | "draw" | null;
  userSolveTime?: string;
  opponentSolveTime?: string;
  createdAt: string;
}

export default function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [currentUserHandle, setCurrentUserHandle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const fetchBattles = async () => {
    try {
      const res = await fetch("/api/battles");
      const data = await res.json();
      if (data.battles) {
        setBattles(data.battles);
        setCurrentUserHandle(data.currentUserHandle);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  const startBattle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (opponent.trim().toLowerCase() === currentUserHandle.toLowerCase()) {
      setError("You cannot challenge yourself");
      return;
    }
    
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/battles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          opponentHandle: opponent.trim(),
          rating: rating ? Number(rating) : undefined
        }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to start battle");
      
      setOpponent("");
      setRating("");
      fetchBattles();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const syncBattle = async (id: string) => {
    try {
      const res = await fetch(`/api/battles/${id}/sync`, { method: "POST" });
      if (res.ok) fetchBattles();
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  const acceptBattle = async (id: string) => {
    try {
      const res = await fetch(`/api/battles/${id}/accept`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchBattles();
      } else {
        alert(data.message || "Failed to accept battle");
      }
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  const declineBattle = async (id: string) => {
    try {
      const res = await fetch(`/api/battles/${id}/decline`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        fetchBattles();
      } else {
        alert(data.message || "Failed to decline battle");
      }
    } catch (err) {
      console.error("Decline failed", err);
    }
  };

  const endBattle = async (id: string) => {
    if (!confirm("Are you sure you want to end this battle? It will be removed.")) return;
    try {
      const res = await fetch(`/api/battles/${id}`, { method: "DELETE" });
      if (res.ok) fetchBattles();
    } catch (err) {
      console.error("End battle failed", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", color: "var(--color-on-surface-variant)", padding: "3rem" }}>
        Loading arena...
      </div>
    );
  }

  const activeBattles = battles.filter(b => b.status === "active");
  const pastBattles = battles.filter(b => b.status === "completed" || b.status === "declined");
  const pendingReceived = battles.filter(b => b.status === "pending" && b.opponentHandle === currentUserHandle);
  const pendingSent = battles.filter(b => b.status === "pending" && b.userHandle === currentUserHandle);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Create Battle Form */}
      <div style={{
        background: "var(--color-surface-container)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        border: "1px solid var(--color-outline-variant)",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--color-on-surface)",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          ⚔️ Deploy Challenge
        </h2>
        <form onSubmit={startBattle} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 250px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface-variant)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Target Handle
            </label>
            <input
              type="text"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              placeholder="Codeforces ID"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-outline-variant)",
                background: "var(--color-surface-low)",
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                outline: "none"
              }}
            />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface-variant)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Difficulty
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value as any)}
              placeholder="1200 - 3500"
              step="100"
              min="800"
              max="3500"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-outline-variant)",
                background: "var(--color-surface-low)",
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.875rem",
                outline: "none"
              }}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "var(--color-on-primary-container)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.7 : 1,
              whiteSpace: "nowrap"
            }}
          >
            {creating ? "Sending..." : "Challenge"}
          </button>
        </form>
        {error && (
          <div style={{ marginTop: "1rem", color: "var(--color-error)", fontSize: "0.875rem", fontWeight: 500 }}>
            {error}
          </div>
        )}
      </div>

      {/* Main Grid for Battles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {/* Live Battles */}
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            🔥 Live Battles
          </h3>
          {activeBattles.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeBattles.map(b => (
                <BattleCard key={b._id} battle={b} onSync={() => syncBattle(b._id)} isActive onEnd={() => endBattle(b._id)} currentUserHandle={currentUserHandle} />
              ))}
            </div>
          ) : (
            <EmptyState message="No active duels right now." />
          )}
        </div>

        {/* Received Invites */}
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📩 Invites Received
          </h3>
          {pendingReceived.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pendingReceived.map(b => (
                <BattleCard key={b._id} battle={b} isPendingReceived onAccept={() => acceptBattle(b._id)} onDecline={() => declineBattle(b._id)} onEnd={() => endBattle(b._id)} currentUserHandle={currentUserHandle} />
              ))}
            </div>
          ) : (
            <EmptyState message="No pending invites." />
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
        {/* Sent Invites */}
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            📤 Sent Invites
          </h3>
          {pendingSent.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pendingSent.map(b => (
                <BattleCard key={b._id} battle={b} isPendingSent onEnd={() => endBattle(b._id)} currentUserHandle={currentUserHandle} />
              ))}
            </div>
          ) : (
            <EmptyState message="You haven't challenged anyone recently." />
          )}
        </div>
      </div>

      {/* History */}
      <div style={{ marginTop: "1rem", paddingTop: "2rem", borderTop: "1px solid var(--color-outline-variant)" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-on-surface)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          📜 Arena History
        </h3>
        {pastBattles.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {pastBattles.slice(0, 10).map(b => (
              <BattleCard key={b._id} battle={b} onEnd={() => endBattle(b._id)} currentUserHandle={currentUserHandle} />
            ))}
          </div>
        ) : (
          <EmptyState message="The records are empty." />
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: "2rem",
      textAlign: "center",
      background: "var(--color-surface-low)",
      borderRadius: "var(--radius-xl)",
      border: "1px dashed var(--color-outline-variant)",
      color: "var(--color-on-surface-variant)",
      fontSize: "0.875rem",
      fontWeight: 500
    }}>
      {message}
    </div>
  );
}

function BattleCard({
  battle,
  onSync,
  isActive = false,
  isPendingReceived = false,
  isPendingSent = false,
  onAccept,
  onDecline,
  onEnd,
  currentUserHandle
}: {
  battle: Battle;
  onSync?: () => void;
  isActive?: boolean;
  isPendingReceived?: boolean;
  isPendingSent?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  currentUserHandle: string;
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!isActive || !battle.endTime) return;
    
    const updateTimer = () => {
      const end = new Date(battle.endTime!).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      
      if (diff <= 0) {
        setTimeLeft("Time Expired");
        return;
      }
      
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${m}m ${s}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isActive, battle.endTime]);

  const isCurrentUserCreator = currentUserHandle.toLowerCase() === battle.userHandle.toLowerCase();
  const isWinner = battle.status === "completed" && (
    (isCurrentUserCreator && battle.winner === "user") ||
    (!isCurrentUserCreator && battle.winner === "opponent")
  );
  const isLoser = battle.status === "completed" && (
    (isCurrentUserCreator && battle.winner === "opponent") ||
    (!isCurrentUserCreator && battle.winner === "user")
  );

  let statusColor = "var(--color-outline)";
  let statusText = "Draw";

  if (battle.status === "pending") {
    statusColor = "#eab308";
    statusText = "Pending";
  } else if (battle.status === "declined") {
    statusColor = "#6b7280";
    statusText = "Declined";
  } else if (isActive) {
    statusColor = "var(--color-primary)";
    statusText = "Live";
  } else if (isWinner) {
    statusColor = "#10b981";
    statusText = "Victory";
  } else if (isLoser) {
    statusColor = "#ef4444";
    statusText = "Defeat";
  }

  return (
    <div style={{
      background: "var(--color-surface-container)",
      borderRadius: "var(--radius-lg)",
      padding: "1.25rem",
      border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-outline-variant)"}`,
      position: "relative",
      boxShadow: isActive ? "0 4px 12px rgba(88, 101, 242, 0.15)" : "none"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)" }}>
            {battle.userHandle} <span style={{ color: "var(--color-outline)", fontSize: "0.75rem", margin: "0 0.5rem" }}>VS</span> {battle.opponentHandle}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)" }}>
            {new Date(battle.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <div style={{
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
          background: `color-mix(in srgb, ${statusColor} 15%, transparent)`,
          color: statusColor,
          fontSize: "0.6875rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          {statusText}
        </div>
      </div>

      {isActive && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem", background: "var(--color-surface-low)", borderRadius: "var(--radius-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>Time Remaining</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-primary)" }}>{timeLeft}</span>
        </div>
      )}

      {isPendingReceived || isPendingSent ? (
        <div style={{ padding: "1rem", background: "var(--color-surface-low)", borderRadius: "var(--radius-md)", textAlign: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
            Mission Intel Locked
          </span>
        </div>
      ) : (
        <div style={{ padding: "1rem", background: "var(--color-surface-high)", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface-variant)" }}>
              Rating: {battle.problem.rating || "N/A"}
            </span>
            <Link 
              href={`https://codeforces.com/contest/${battle.problem.contestId}/problem/${battle.problem.index}`}
              target="_blank"
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}
            >
              View Problem ↗
            </Link>
          </div>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-on-surface)", marginBottom: "0.5rem" }}>
            {battle.problem.name}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {battle.problem.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: "0.625rem", padding: "0.15rem 0.4rem", borderRadius: "4px", background: "var(--color-surface-low)", color: "var(--color-on-surface-variant)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        {isActive && onSync && (
          <button onClick={onSync} style={{ padding: "0.5rem 1rem", borderRadius: "4px", background: "var(--color-primary)", color: "#fff", border: "none", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
            Sync Status
          </button>
        )}
        {isPendingReceived && onAccept && onDecline && (
          <>
            <button onClick={onAccept} style={{ padding: "0.5rem 1rem", borderRadius: "4px", background: "#10b981", color: "#fff", border: "none", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
              Accept
            </button>
            <button onClick={onDecline} style={{ padding: "0.5rem 1rem", borderRadius: "4px", background: "transparent", color: "var(--color-error)", border: "1px solid var(--color-error)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
              Decline
            </button>
          </>
        )}
        {onEnd && (
          <button onClick={onEnd} style={{ padding: "0.5rem 1rem", borderRadius: "4px", background: "transparent", color: "var(--color-on-surface-variant)", border: "1px solid var(--color-outline)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
