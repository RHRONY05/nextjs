"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RANK_OPTIONS = [
  { key: "specialist", label: "Specialist", range: "1400 – 1599", icon: "🟢" },
  { key: "expert", label: "Expert", range: "1600 – 1899", icon: "🔵" },
  {
    key: "candidate_master",
    label: "Candidate Master",
    range: "1900 – 2099",
    icon: "🟣",
  },
  { key: "master", label: "Master", range: "2100+", icon: "🟠" },
] as const;

interface Props {
  onBack: () => void;
  onSuccess?: () => void;
}

export default function PreferencesStep({ onBack, onSuccess }: Props) {
  const router = useRouter();
  const [selectedRank, setSelectedRank] = useState<string>("expert");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [frequency, setFrequency] = useState("daily");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRank: selectedRank,
          emailPreferences: {
            enabled: emailEnabled,
            frequency: frequency,
            preferredHour: 9,
            timezone: "UTC",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message ?? "Failed to save preferences. Please try again.");
        setSaving(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(data.redirectTo ?? "/dashboard");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
      setSaving(false);
    }
  }

  return (
    <div className="animate-fade-slide-in">
      <h1
        className="mb-3 font-display font-bold tracking-tight"
        style={{ fontSize: "2rem", color: "var(--color-on-surface)" }}
      >
        Set your target rank
      </h1>
      <p
        className="mb-8"
        style={{
          fontSize: "1.125rem",
          color: "var(--color-on-surface-variant)",
          lineHeight: 1.6,
        }}
      >
        AlgoBoard tailors your learning path based on where you want to go. You
        can change this later in Settings.
      </p>

      {/* Section label */}
      <p
        className="mb-4 uppercase tracking-widest"
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--color-outline)",
        }}
      >
        I want to reach...
      </p>

      {/* Rank grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {RANK_OPTIONS.map(({ key, label, range, icon }) => {
          const selected = selectedRank === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedRank(key)}
              className="text-center rounded-2xl p-6 relative transition-all"
              style={{
                background: selected
                  ? "rgba(88,101,242,0.08)"
                  : "var(--color-surface-container)",
                border: selected
                  ? "2px solid var(--color-primary-container)"
                  : "2px solid var(--color-outline-variant)",
                cursor: "pointer",
                transform: "translateY(0)",
              }}
              onMouseEnter={(e) => {
                if (!selected)
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
              }}
            >
              {/* Selected checkmark */}
              {selected && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    top: "0.75rem",
                    right: "0.75rem",
                    width: "24px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: "var(--color-primary-container)",
                    color: "var(--color-on-primary-container)",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
              )}
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                {icon}
              </div>
              <div
                className="font-display font-bold"
                style={{
                  fontSize: "1.125rem",
                  color: "var(--color-on-surface)",
                  marginBottom: "0.375rem",
                }}
              >
                {label}
              </div>
              <div
                className="font-mono"
                style={{ fontSize: "0.875rem", color: "var(--color-outline)" }}
              >
                {range}
              </div>
            </button>
          );
        })}
      </div>

      {/* Section label */}
      <p
        className="mb-4 uppercase tracking-widest"
        style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--color-outline)",
        }}
      >
        Daily reminders
      </p>

      {/* Email toggle row */}
      <div
        className="flex items-center justify-between rounded-2xl p-5 mb-4"
        style={{ background: "var(--color-surface-container)" }}
      >
        <div className="flex-1">
          <div
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              marginBottom: "4px",
            }}
          >
            Email Problem Reminders
          </div>
          <div
            style={{
              fontSize: "0.9rem",
              color: "var(--color-on-surface-variant)",
            }}
          >
            3 personalized problems each morning
          </div>
        </div>

        {/* Toggle switch */}
        <label
          className="relative shrink-0"
          style={{ width: "52px", height: "28px", cursor: "pointer" }}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={emailEnabled}
            onChange={(e) => setEmailEnabled(e.target.checked)}
          />
          <div
            className="absolute inset-0 rounded-full transition-colors"
            style={{
              background: emailEnabled
                ? "var(--color-primary-container)"
                : "var(--color-outline-variant)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "22px",
              height: "22px",
              background: "white",
              top: "3px",
              left: "3px",
              transition: "transform 0.2s ease",
              transform: emailEnabled ? "translateX(24px)" : "translateX(0)",
            }}
          />
        </label>
      </div>

      {/* Frequency selector */}
      {emailEnabled && (
        <div
          className="rounded-2xl p-5 mb-4 animate-fade-slide-in"
          style={{ background: "var(--color-surface-container)" }}
        >
          <label
            htmlFor="freq-select"
            className="block mb-3"
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--color-on-surface-variant)",
              letterSpacing: "0.01em",
            }}
          >
            Send frequency
          </label>
          <select
            id="freq-select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-xl outline-none"
            style={{
              background: "var(--color-surface-high)",
              border: "1px solid var(--color-outline-variant)",
              padding: "0.875rem 1.25rem",
              color: "var(--color-on-surface)",
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            <option value="daily">Daily</option>
            <option value="every_2_days">Every 2 Days</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 rounded-xl font-display font-bold transition-all mt-6"
        style={{
          padding: "1.125rem 2rem",
          fontSize: "1.125rem",
          color: "var(--color-on-primary-container)",
          background:
            "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
          border: "none",
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? (
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
          "Finish Setup →"
        )}
      </button>

      {/* Back link */}
      <button
        onClick={onBack}
        className="block w-full text-center mt-6 transition-colors"
        style={{
          fontSize: "1rem",
          color: "var(--color-outline)",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}
