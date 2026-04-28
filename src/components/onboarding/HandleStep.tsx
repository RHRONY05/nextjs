"use client";

import { useState, useRef } from "react";

export interface CfHandleData {
  handle: string;
  rating: number;
  rank: string;
  avatar: string;
}

interface Props {
  onComplete: (data: CfHandleData) => void;
}

type Phase = "idle" | "loading" | "found" | "error";

export default function HandleStep({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [found, setFound] = useState<CfHandleData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleLookup() {
    const handle = inputRef.current?.value.trim() ?? "";
    setError("");

    if (!handle) {
      setError("Please enter your Codeforces handle.");
      inputRef.current?.focus();
      return;
    }

    setPhase("loading");

    try {
      const res = await fetch("/api/onboarding/handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cfHandle: handle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Please try again.");
        setPhase("error");
        return;
      }

      const p = data.cfProfile;
      setFound({
        handle: p.handle,
        rating: p.rating ?? 0,
        rank: p.rank ?? "unrated",
        avatar:
          p.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(p.handle)}&background=5865F2&color=fff`,
      });
      setPhase("found");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setPhase("error");
    }
  }

  function handleContinue() {
    if (found) onComplete(found);
  }

  const isFound = phase === "found";

  return (
    <div className="animate-fade-slide-in">
      <h1
        className="mb-3 font-display font-bold tracking-tight"
        style={{ fontSize: "2rem", color: "var(--color-on-surface)" }}
      >
        Connect your Codeforces account
      </h1>
      <p
        className="mb-8"
        style={{
          fontSize: "1.125rem",
          color: "var(--color-on-surface-variant)",
          lineHeight: 1.6,
        }}
      >
        Enter your CF handle so we can sync your contest history, solved
        problems, and stats.
      </p>

      {/* Profile result card */}
      {isFound && found && (
        <div
          className="flex items-center gap-4 rounded-2xl p-5 mb-6 animate-fade-slide-in"
          style={{
            background: "var(--color-surface-container)",
            border: "1px solid rgba(93,220,179,0.25)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={found.avatar}
            alt={found.handle}
            className="rounded-full shrink-0"
            style={{
              width: "64px",
              height: "64px",
              objectFit: "cover",
              border: "2px solid var(--color-secondary)",
            }}
          />
          <div className="flex-1 min-w-0">
            <div
              className="font-display font-bold"
              style={{ fontSize: "1.5rem", color: "var(--color-on-surface)" }}
            >
              {found.handle}
            </div>
            <span
              className="font-mono inline-block mt-1"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(93,220,179,0.15)",
                color: "var(--color-secondary)",
              }}
            >
              {found.rating} · {found.rank}
            </span>
          </div>
          <span style={{ fontSize: "1.5rem", color: "var(--color-secondary)" }}>
            ✓
          </span>
        </div>
      )}

      {/* Handle input */}
      <div className="mb-6">
        <label
          htmlFor="cf-handle-input"
          className="block mb-4"
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--color-on-surface)",
            letterSpacing: "0.01em",
          }}
        >
          Codeforces Handle
        </label>
        <input
          ref={inputRef}
          id="cf-handle-input"
          type="text"
          placeholder="e.g. tourist, rony_cf"
          autoComplete="off"
          spellCheck={false}
          disabled={isFound}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isFound) handleLookup();
          }}
          className="w-full rounded-2xl outline-none transition-all"
          style={{
            background: "var(--color-surface-container)",
            border: error
              ? "2px solid var(--color-error)"
              : "2px solid var(--color-outline-variant)",
            padding: "1.25rem 1.5rem",
            color: "var(--color-on-surface)",
            fontFamily: "var(--font-body)",
            fontSize: "1.25rem",
            opacity: isFound ? 0.6 : 1,
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
        <div style={{ marginTop: "1rem", minHeight: "24px" }}>
          {error ? (
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-error)",
                margin: 0,
              }}
            >
              {error}
            </p>
          ) : (
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--color-outline)",
                margin: 0,
              }}
            >
              Your handle is the username you use to sign in to codeforces.com
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={isFound ? handleContinue : handleLookup}
        disabled={phase === "loading"}
        className="w-full flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-all"
        style={{
          padding: "1rem 2rem",
          fontSize: "1.125rem",
          color: "var(--color-on-primary-container)",
          background:
            "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
          border: "none",
          cursor: phase === "loading" ? "not-allowed" : "pointer",
          opacity: phase === "loading" ? 0.7 : 1,
        }}
      >
        {phase === "loading" ? (
          <span
            className="inline-block rounded-full"
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              animation: "spinCW 0.7s linear infinite",
            }}
          />
        ) : (
          <span>{isFound ? "Continue →" : "Look up Handle →"}</span>
        )}
      </button>
    </div>
  );
}
