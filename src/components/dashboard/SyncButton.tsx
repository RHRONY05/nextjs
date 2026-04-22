"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  lastSynced?: Date | null;
}

export default function SyncButton({ lastSynced }: Props) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const syncText = lastSynced ? getTimeAgo(lastSynced) : "Never";

  async function handleSync() {
    if (syncing) return;

    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cf/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.autoSolvedCount > 0) {
          setMessage(`${data.autoSolvedCount} problem${data.autoSolvedCount > 1 ? 's' : ''} auto-solved!`);
          setTimeout(() => setMessage(null), 5000); // Clear after 5 seconds
        }
        router.refresh(); // Refresh server component data
      } else {
        const data = await res.json();
        alert(data.message || "Sync failed");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="dash-header__right">
      <span className="dash-header__sync-text">
        Last synced <b>{syncText}</b>
      </span>
      <button 
        onClick={handleSync} 
        disabled={syncing}
        className="btn-sync"
        style={{ opacity: syncing ? 0.6 : 1 }}
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
          style={{ animation: syncing ? "spinCW 1s linear infinite" : "none" }}
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        {syncing ? "Syncing..." : "Sync Now"}
      </button>
      {message && (
        <span className="sync-success-message" style={{
          marginLeft: '12px',
          color: '#10b981',
          fontWeight: 600,
          fontSize: '14px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          ✓ {message}
        </span>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
