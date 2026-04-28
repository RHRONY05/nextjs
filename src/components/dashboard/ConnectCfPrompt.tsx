"use client";

import { useState } from "react";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function ConnectCfPrompt({
  featureName,
}: {
  featureName?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        style={{
          minHeight: "calc(100vh - 4rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "var(--color-surface-low)",
            borderRadius: "1.5rem",
            padding: "4rem 2rem",
            textAlign: "center",
            border: "1px dashed var(--color-outline-variant)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            maxWidth: "600px",
            width: "100%",
            boxShadow:
              "0 24px 64px rgba(12,14,20,0.7), 0 0 0 1px rgba(69,70,85,0.3)",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🔌</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-on-surface)",
            }}
          >
            Codeforces Account Required
          </h2>
          <p
            style={{
              color: "var(--color-on-surface-variant)",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              fontSize: "1.05rem",
            }}
          >
            {featureName
              ? `To access ${featureName}, you need to link your Codeforces handle.`
              : "To unlock your stats, activity heatmap, daily problem recommendations, and the upsolving board, you need to link your Codeforces handle."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background:
                "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "#fff",
              padding: "0.875rem 1.75rem",
              borderRadius: "0.75rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontFamily: "var(--font-body)",
              transition: "transform 0.2s, filter 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Connect Codeforces Handle
          </button>
        </div>
      </div>
      
      <OnboardingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
