// Step indicator — 3 bubbles with connecting lines
// States: default (gray) → active (indigo gradient) → complete (teal ✓)

const STEPS = [
  { num: 1, label: "Your Handle" },
  { num: 2, label: "Verify Ownership" },
  { num: 3, label: "Your Goals" },
] as const;

interface Props {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((step, i) => {
        const complete = step.num < currentStep;
        const active   = step.num === currentStep;

        return (
          <div key={step.num} className="contents">
            {/* Step bubble + label */}
            <div className="flex flex-col items-center gap-2 flex-1 relative z-10">
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  transition: "all 0.25s ease",
                  border: complete
                    ? "2px solid var(--color-secondary)"
                    : active
                    ? "2px solid var(--color-primary-container)"
                    : "2px solid var(--color-outline-variant)",
                  background: complete
                    ? "var(--color-secondary)"
                    : active
                    ? "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))"
                    : "var(--color-surface-container)",
                  color: complete
                    ? "var(--color-on-secondary)"
                    : active
                    ? "var(--color-on-primary-container)"
                    : "var(--color-outline)",
                  boxShadow: active ? "0 0 16px rgba(88,101,242,0.4)" : "none",
                }}
              >
                {complete ? "✓" : step.num}
              </div>
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: active ? 600 : 500,
                  whiteSpace: "nowrap",
                  color: complete
                    ? "var(--color-secondary)"
                    : active
                    ? "var(--color-primary)"
                    : "var(--color-outline)",
                  transition: "color 0.25s",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  height: "2px",
                  flex: 1,
                  marginTop: "-20px", // align with bubble center (label pushes column down)
                  position: "relative",
                  zIndex: 0,
                  background: step.num < currentStep
                    ? "var(--color-secondary)"
                    : "var(--color-outline-variant)",
                  transition: "background 0.4s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
