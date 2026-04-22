"use client";

import { useEffect, useRef, useState } from "react";
import type { CfHandleData } from "./HandleStep";

interface Props {
  cfData: CfHandleData;
  onComplete: () => void;
  onBack:     () => void;
}

type VerifyPhase = "waiting" | "success" | "expired";

interface VerificationProblem {
  contestId: number;
  problemIndex: string;
  problemName: string;
  url: string;
}

export default function VerifyStep({ cfData, onComplete, onBack }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [phase, setPhase]             = useState<VerifyPhase>("waiting");
  const [pollText, setPollText]       = useState("Waiting for your submission on Codeforces...");
  const [problem, setProblem]         = useState<VerificationProblem | null>(null);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const successRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  function stop() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (pollRef.current)      clearInterval(pollRef.current);
    if (successRef.current)   clearTimeout(successRef.current);
  }

  useEffect(() => {
    // Initiate verification
    (async () => {
      try {
        const res = await fetch("/api/onboarding/verify/initiate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ cfHandle: cfData.handle }),
        });
        const data = await res.json();

        if (!res.ok) {
          setPollText(data.message ?? "Failed to initiate verification. Please go back and try again.");
          setPhase("expired");
          return;
        }

        setProblem(data.verificationProblem);

        // Calculate time remaining from server response
        const expiresAt = new Date(data.expiresAt).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setSecondsLeft(remaining);
      } catch {
        setPollText("Network error. Please go back and try again.");
        setPhase("expired");
      }
    })();

    // Countdown every second
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          stop();
          setPhase("expired");
          setPollText("Time expired. Please go back and try again.");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // Poll status every 5 seconds
    const pollTexts = [
      "Waiting for your submission on Codeforces...",
      "Checking for recent submissions...",
      "Still watching for your solve...",
    ];
    let pollCount = 0;

    pollRef.current = setInterval(async () => {
      pollCount++;
      setPollText(pollTexts[Math.min(pollCount, pollTexts.length - 1)]);

      try {
        const res = await fetch("/api/onboarding/verify/status");
        const data = await res.json();

        if (data.status === "verified") {
          stop();
          setPhase("success");
          successRef.current = setTimeout(() => onComplete(), 2000);
        } else if (data.status === "expired") {
          stop();
          setPhase("expired");
          setPollText(data.message ?? "Time expired. Please go back and try again.");
        }
      } catch {
        // Network error — keep polling
      }
    }, 5000);

    return stop;
  }, [cfData.handle, onComplete]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const expiring = secondsLeft <= 60;

  return (
    <div className="animate-fade-slide-in">
      <h1
        className="mb-2 font-display font-bold tracking-tight"
        style={{ fontSize: "1.375rem", color: "var(--color-on-surface)" }}
      >
        Prove you own this handle
      </h1>
      <p className="mb-5" style={{ fontSize: "0.9rem", color: "var(--color-on-surface-variant)", lineHeight: 1.6 }}>
        Submit any solution to the problem below — even Wrong Answer counts. This proves you control the account.
      </p>

      {/* Mini CF profile */}
      <div
        className="flex items-center gap-3 mb-5 pb-5"
        style={{ borderBottom: "1px solid var(--color-outline-variant)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cfData.avatar}
          alt={cfData.handle}
          className="rounded-full shrink-0"
          style={{ width: "40px", height: "40px", objectFit: "cover", border: "2px solid var(--color-secondary)" }}
        />
        <div>
          <div className="font-display font-bold" style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}>
            {cfData.handle}
          </div>
          <span
            className="font-mono inline-block mt-0.5"
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              padding: "0.15rem 0.5rem",
              borderRadius: "9999px",
              background: "rgba(93,220,179,0.15)",
              color: "var(--color-secondary)",
            }}
          >
            {cfData.rating} · {cfData.rank}
          </span>
        </div>
      </div>

      {/* Instruction box */}
      <div
        className="rounded-xl mb-5"
        style={{
          background: "var(--color-surface-container)",
          border: "1px solid var(--color-outline-variant)",
          padding: "1rem 1.25rem",
        }}
      >
        <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)", lineHeight: 1.6, marginBottom: "0.75rem" }}>
          To verify this handle belongs to you, submit any solution to the problem below via Codeforces:
        </p>

        {/* Problem card */}
        {problem && (
          <div
            className="flex items-center justify-between gap-3 rounded-lg mb-3"
            style={{ background: "var(--color-surface-high)", padding: "0.75rem 1rem" }}
          >
            <span className="font-display font-bold" style={{ fontSize: "0.9375rem", color: "var(--color-on-surface)" }}>
              {problem.contestId}{problem.problemIndex} — {problem.problemName}
            </span>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 shrink-0 rounded-md transition-colors"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-primary)",
                border: "1px solid var(--color-primary-container)",
                padding: "0.4rem 0.9rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open on Codeforces
            </a>
          </div>
        )}

        <p style={{ fontSize: "0.75rem", color: "var(--color-outline)", fontStyle: "italic" }}>
          Any verdict counts — even Wrong Answer. We just need to see a recent submission from this handle.
        </p>
      </div>

      {/* Countdown timer */}
      {phase !== "success" && (
        <div className="text-center mb-5">
          <div
            className="font-mono"
            style={{
              fontSize: "2.75rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              lineHeight: 1,
              color: expiring || phase === "expired" ? "var(--color-error)" : "var(--color-on-surface)",
            }}
          >
            {mm}:{ss}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-outline)", marginTop: "0.25rem" }}>
            {phase === "expired" ? "time expired" : "remaining to submit"}
          </div>
        </div>
      )}

      {/* Polling animation */}
      {phase === "waiting" && (
        <div
          className="flex items-center justify-center gap-3 rounded-lg mb-5"
          style={{ padding: "0.75rem", background: "var(--color-surface-container)" }}
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  background: "var(--color-primary)",
                  animation: `dotBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)" }}>
            {pollText}
          </span>
        </div>
      )}

      {/* Success state */}
      {phase === "success" && (
        <div className="flex flex-col items-center text-center py-6 animate-fade-slide-in">
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(93,220,179,0.15)",
              border: "2px solid var(--color-secondary)",
              fontSize: "1.75rem",
              boxShadow: "0 0 24px rgba(93,220,179,0.2)",
            }}
          >
            ✓
          </div>
          <div className="font-display font-bold mb-2" style={{ fontSize: "1.125rem", color: "var(--color-secondary)" }}>
            Handle Verified!
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
            Submission detected. Moving to the next step...
          </p>
        </div>
      )}

      {/* Back link */}
      <button
        onClick={() => { stop(); onBack(); }}
        className="block w-full text-center mt-4 transition-colors"
        style={{ fontSize: "0.8125rem", color: "var(--color-outline)", background: "none", border: "none", cursor: "pointer" }}
      >
        ← Wrong handle? Go back
      </button>
    </div>
  );
}
