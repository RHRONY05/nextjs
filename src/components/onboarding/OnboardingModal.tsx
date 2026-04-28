"use client";

import { useState } from "react";
import StepIndicator from "@/components/onboarding/StepIndicator";
import HandleStep, {
  type CfHandleData,
} from "@/components/onboarding/HandleStep";
import VerifyStep from "@/components/onboarding/VerifyStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cfData, setCfData] = useState<CfHandleData | null>(null);

  if (!isOpen) return null;

  function handleHandleComplete(data: CfHandleData) {
    setCfData(data);
    setStep(2);
  }

  function handleVerifyComplete() {
    setStep(3);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="w-full relative"
        style={{
          maxWidth: "750px", // Increased width for better proportions
          background: "var(--color-surface-container)",
          borderRadius: "1.5rem",
          padding: "3rem", // Increased padding
          boxShadow:
            "0 24px 64px rgba(12,14,20,0.7), 0 0 0 1px rgba(69,70,85,0.3)",
          overflow: "hidden",
        }}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "3px",
            background:
              "linear-gradient(to right, var(--color-primary-container), var(--color-primary))",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            background: "transparent",
            border: "none",
            color: "var(--color-on-surface-variant)",
            cursor: "pointer",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "var(--color-on-surface)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--color-on-surface-variant)";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ marginBottom: "1rem" }}>
          <StepIndicator currentStep={step} />
        </div>

        {step === 1 && (
          <HandleStep key="step-1" onComplete={handleHandleComplete} />
        )}
        {step === 2 && cfData && (
          <VerifyStep
            key="step-2"
            cfData={cfData}
            onComplete={handleVerifyComplete}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <PreferencesStep
            key="step-3"
            onBack={() => setStep(2)}
            onSuccess={() => {
              // Refresh page to show newly connected state
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
}
