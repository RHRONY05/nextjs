"use client";

// Onboarding Wizard — Route: /onboarding
// Reference: frontend/onboarding.html
// SRS: F01, F02, Flow 1

import { useState } from "react";
import Link from "next/link";
import StepIndicator from "@/components/onboarding/StepIndicator";
import HandleStep, { type CfHandleData } from "@/components/onboarding/HandleStep";
import VerifyStep from "@/components/onboarding/VerifyStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";

export default function OnboardingPage() {
  const [step, setStep]     = useState<1 | 2 | 3>(1);
  const [cfData, setCfData] = useState<CfHandleData | null>(null);

  function handleHandleComplete(data: CfHandleData) {
    setCfData(data);
    setStep(2);
  }

  function handleVerifyComplete() {
    setStep(3);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-x-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      {/* Ambient background blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(88,101,242,0.10) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(93,220,179,0.06) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Fixed logo — top left */}
      <Link
        href="/"
        className="fixed flex items-center gap-2"
        style={{
          top: "1.5rem",
          left: "2rem",
          textDecoration: "none",
          color: "var(--color-on-surface)",
          zIndex: 10,
        }}
      >
        <div
          className="rounded-full shrink-0"
          style={{ width: "8px", height: "8px", background: "var(--color-primary-container)" }}
        />
        <span className="font-display font-bold" style={{ fontSize: "1.125rem" }}>
          AlgoBoard
        </span>
      </Link>

      {/* Wizard card */}
      <div
        className="w-full relative"
        style={{
          maxWidth: "540px",
          background: "var(--color-surface-container)",
          borderRadius: "var(--radius-2xl)",
          padding: "2rem",
          boxShadow: "0 24px 64px rgba(12,14,20,0.7), 0 0 0 1px rgba(69,70,85,0.3)",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "2px",
            background: "linear-gradient(to right, var(--color-primary-container), var(--color-primary))",
          }}
        />

        <StepIndicator currentStep={step} />

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
          <PreferencesStep key="step-3" onBack={() => setStep(2)} />
        )}
      </div>
    </main>
  );
}
