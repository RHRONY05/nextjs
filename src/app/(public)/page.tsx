// Landing Page — Route: /
// Reference: frontend/landingPage.html + frontend/css/landingPage.css
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LandingNavbar from "@/components/layout/LandingNavbar";
import SignInButton from "@/components/layout/SignInButton";

// ── Shared ────────────────────────────────────────────────────
const gradientPrimary =
  "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))";

function ArrowRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Static Kanban Mockup ──────────────────────────────────────
function KanbanMockup() {
  const colTitle: React.CSSProperties = {
    fontSize: "0.75rem", // was 0.6875rem
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-on-surface-variant)",
  };
  const colBadge: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem", // was 0.625rem
    background: "var(--color-surface-container)",
    color: "var(--color-on-surface-variant)",
    padding: "0.15rem 0.5rem",
    borderRadius: "9999px",
  };
  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--color-surface-high)",
    borderRadius: "0.5rem",
    padding: "0.875rem", // was 0.75rem
    marginBottom: "0.625rem", // was 0.5rem
    fontSize: "0.8125rem", // was 0.6875rem — 11px → 13px, much more readable
    borderLeft: "3px solid transparent",
    ...extra,
  });
  const cardName: React.CSSProperties = {
    fontWeight: 600,
    color: "var(--color-on-surface)",
    marginBottom: "0.3rem", // was 0.2rem
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  const cardContest: React.CSSProperties = {
    color: "var(--color-outline)",
    marginBottom: "0.625rem", // was 0.5rem
    fontSize: "0.75rem", // explicit — slightly smaller than card name
  };
  const ratingBadge = (bg: string, color: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: "0.6875rem", // was 0.5625rem
    fontWeight: 600,
    padding: "0.15rem 0.4rem",
    borderRadius: "0.125rem",
    background: bg,
    color,
  });
  const tagPill: React.CSSProperties = {
    fontSize: "0.6875rem", // was 0.5625rem
    color: "var(--color-on-surface-variant)",
    background: "var(--color-surface-highest)",
    padding: "0.15rem 0.4rem",
    borderRadius: "0.125rem",
  };

  return (
    <div
      style={{
        background: "var(--color-surface-low)",
        borderRadius: "1.25rem", // was 1rem
        padding: "1.25rem", // was 1rem
        position: "relative",
        boxShadow:
          "0 8px 32px rgba(12,14,20,0.6), 0 0 60px rgba(88,101,242,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Indigo top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: gradientPrimary,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
          padding: "0 0.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--color-on-surface)",
          }}
        >
          Upsolve Board
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-outline)",
            background: "var(--color-surface-container)",
            padding: "0.25rem 0.75rem",
            borderRadius: "0.375rem",
          }}
        >
          Last synced 2 min ago
        </span>
      </div>

      {/* Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "0.875rem",
        }}
      >
        {/* To Upsolve */}
        <div
          style={{
            background: "var(--color-surface-lowest)",
            borderRadius: "0.875rem",
            padding: "0.875rem",
            minHeight: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <span style={colTitle}>To Upsolve</span>
            <span style={colBadge}>4</span>
          </div>
          <div
            style={card({ borderLeftColor: "var(--color-primary-container)" })}
          >
            <div style={cardName}>Subtraction Game</div>
            <div style={cardContest}>Round 884 Div.2</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                flexWrap: "wrap",
              }}
            >
              <span style={ratingBadge("rgba(3,168,158,0.15)", "#03A89E")}>
                1200
              </span>
              <span style={tagPill}>math</span>
            </div>
          </div>
          <div
            style={card({ borderLeftColor: "var(--color-primary-container)" })}
          >
            <div style={cardName}>Powering the Hero</div>
            <div style={cardContest}>Round 891 Div.3</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(245,166,35,0.15)", "#F5A623")}>
                1400
              </span>
              <span style={tagPill}>greedy</span>
            </div>
          </div>
          <div style={card({ borderLeftColor: "var(--color-secondary)" })}>
            <div style={cardName}>Cellular Network</div>
            <div style={cardContest}>Topic Ladder</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(0,0,255,0.12)", "#88A0FF")}>
                1600
              </span>
              <span style={tagPill}>binary search</span>
            </div>
          </div>
        </div>

        {/* Trying */}
        <div
          style={{
            background: "var(--color-surface-lowest)",
            borderRadius: "0.875rem",
            padding: "0.875rem",
            minHeight: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <span style={{ ...colTitle, color: "var(--color-amber)" }}>
              Trying
            </span>
            <span style={colBadge}>2</span>
          </div>
          {/* Dragging card */}
          <div
            style={{
              ...card({ borderLeftColor: "var(--color-secondary)" }),
              opacity: 0.9,
              transform: "rotate(1.5deg) scale(1.03)",
              boxShadow:
                "0 8px 24px rgba(12,14,20,0.7), 0 0 20px rgba(88,101,242,0.3)",
            }}
          >
            <div style={cardName}>Round Corridor</div>
            <div style={cardContest}>Round 876 Div.2</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(0,0,255,0.12)", "#88A0FF")}>
                1600
              </span>
              <span style={tagPill}>number theory</span>
            </div>
          </div>
          <div
            style={card({ borderLeftColor: "var(--color-primary-container)" })}
          >
            <div style={cardName}>Boats Competition</div>
            <div style={cardContest}>Round 667 Div.3</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(0,0,255,0.12)", "#88A0FF")}>
                1500
              </span>
              <span style={tagPill}>two pointers</span>
            </div>
          </div>
        </div>

        {/* Solved */}
        <div
          style={{
            background: "var(--color-surface-lowest)",
            borderRadius: "0.875rem",
            padding: "0.875rem",
            minHeight: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.875rem",
            }}
          >
            <span style={{ ...colTitle, color: "var(--color-secondary)" }}>
              Solved
            </span>
            <span style={colBadge}>15</span>
          </div>
          <div
            style={{
              ...card({ borderLeftColor: "var(--color-primary-container)" }),
              opacity: 0.7,
            }}
          >
            <div
              style={{
                color: "var(--color-secondary)",
                fontSize: "0.8125rem",
                textAlign: "right",
              }}
            >
              ✓
            </div>
            <div style={cardName}>Stripes</div>
            <div style={cardContest}>Round 824 Div.2</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(93,220,179,0.15)", "#5DDCB3")}>
                1300
              </span>
              <span style={tagPill}>constructive</span>
            </div>
          </div>
          <div
            style={{
              ...card({ borderLeftColor: "var(--color-primary-container)" }),
              opacity: 0.7,
            }}
          >
            <div
              style={{
                color: "var(--color-secondary)",
                fontSize: "0.8125rem",
                textAlign: "right",
              }}
            >
              ✓
            </div>
            <div style={cardName}>Good Subarrays</div>
            <div style={cardContest}>Round 666 Div.2</div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            >
              <span style={ratingBadge("rgba(245,166,35,0.15)", "#F5A623")}>
                1400
              </span>
              <span style={tagPill}>two pointers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────
export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div
      style={{
        background: "var(--color-surface)",
        color: "var(--color-on-surface)",
        overflowX: "hidden",
      }}
    >
      <LandingNavbar />

      {/* ══════════════ HERO ══════════════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "96px 2rem 6rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(88,101,242,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(93,220,179,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(88,101,242,0.12)",
              color: "var(--color-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "0.5rem 1.25rem",
              borderRadius: "9999px",
              marginBottom: "2.5rem",
              letterSpacing: "0.02em",
              border: "1px solid rgba(88,101,242,0.2)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "var(--color-primary-container)",
                borderRadius: "9999px",
                boxShadow: "0 0 10px var(--color-primary-container)",
              }}
            />
            Built by a lost CF user, for every lost CF user
          </div>

          {/* Headline — bigger and bolder */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "var(--color-on-surface)",
              marginBottom: "2rem",
              letterSpacing: "-0.03em",
              maxWidth: "1000px",
            }}
          >
            Stop forgetting what you{" "}
            <span
              style={{
                background: gradientPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                padding: "0 0.1em",
              }}
            >
              failed.
            </span>{" "}
            Start actually{" "}
            <span style={{ position: "relative", whiteSpace: "nowrap" }}>
              improving.
              <svg
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: 0,
                  width: "100%",
                  height: "12px",
                  color: "var(--color-secondary)",
                }}
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2,10 Q50,2 100,6 T198,8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
              color: "var(--color-on-surface-variant)",
              lineHeight: 1.6,
              marginBottom: "3.5rem",
              maxWidth: "700px",
            }}
          >
            AlgoBoard{" "}
            <strong style={{ color: "var(--color-on-surface)" }}>
              syncs your Codeforces contests
            </strong>
            , tracks every problem you didn&apos;t solve, and builds your{" "}
            <strong style={{ color: "var(--color-on-surface)" }}>
              personal learning path
            </strong>{" "}
            — all in one dashboard.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <SignInButton
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "var(--color-primary)",
                color: "var(--color-on-primary-container)",
                border: "none",
                borderRadius: "0.75rem",
                padding: "1.125rem 2.5rem",
                fontSize: "1.125rem",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                boxShadow: "0 8px 24px rgba(88,101,242,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Sign in with Google
            </SignInButton>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "var(--color-on-surface)",
                background: "var(--color-surface-high)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "0.75rem",
                padding: "1.125rem 2.5rem",
                fontSize: "1.125rem",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
                transition: "background 0.2s",
              }}
            >
              View Demo
            </Link>
          </div>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-outline)",
              fontStyle: "italic",
              marginTop: "2rem",
            }}
          >
            No credit card · Free forever for core features · Syncs with
            Codeforces
          </p>
        </div>
      </section>

      {/* ══════════════ STATS BAR ══════════════ */}
      <div
        style={{
          background: "var(--color-surface-low)",
          borderTop: "1px solid rgba(69,70,85,0.4)",
          borderBottom: "1px solid rgba(69,70,85,0.4)",
          padding: "3.5rem 3rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "3rem",
          }}
        >
          {[
            { number: "10,000+", label: "Problems curated from CF & CSES" },
            { number: "6", label: "Problems per topic — no more, no less" },
            { number: "6h", label: "Auto-sync interval with your CF account" },
          ].map(({ number, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    background: gradientPrimary,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {number}
                </span>
              </div>
              <div
                style={{
                  fontSize: "1.0625rem",
                  color: "var(--color-on-surface-variant)",
                  lineHeight: 1.5,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ FEATURES ══════════════ */}
      <section id="features" style={{ padding: "7rem 3rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              marginBottom: "1rem",
            }}
          >
            What AlgoBoard does
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem,3vw,2.75rem)",
              fontWeight: 700,
              color: "var(--color-on-surface)",
              textAlign: "center",
              marginBottom: "1.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-on-surface-variant)",
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto 4rem",
              lineHeight: 1.8,
            }}
          >
            Three focused tools, each solving one real problem that CF users
            face every day.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "2rem",
            }}
          >
            {[
              {
                emoji: "📋",
                iconBg: "rgba(88,101,242,0.15)",
                title: "Upsolve Tracker",
                desc: `Every contest you participate in, AlgoBoard automatically pulls the problems you didn't solve into a Kanban board. Drag them to "Trying" or "Solved" as you go. The board persists forever — no more forgetting.`,
                tag: "F09 · F10 · F11",
                tagBg: "rgba(88,101,242,0.15)",
                tagColor: "var(--color-primary)",
              },
              {
                emoji: "📊",
                iconBg: "rgba(93,220,179,0.15)",
                title: "Stats Dashboard",
                desc: "See your rating over time, submission heatmap, problems solved by rating bucket, and your strongest and weakest topics — all in one place, synced live to your Codeforces account.",
                tag: "F03 · F04 · F05 · F06",
                tagBg: "rgba(93,220,179,0.15)",
                tagColor: "var(--color-secondary)",
              },
              {
                emoji: "🎯",
                iconBg: "rgba(213,188,255,0.15)",
                title: "Topic Learning Path",
                desc: "Curated problem ladders for every algorithm topic — exactly 6 handpicked problems per topic, ordered by difficulty. Tell AlgoBoard your target rating and it shows you exactly which topics to focus on.",
                tag: "F13 · F14 · F16",
                tagBg: "rgba(213,188,255,0.15)",
                tagColor: "var(--color-tertiary)",
              },
            ].map(({ emoji, iconBg, title, desc, tag, tagBg, tagColor }) => (
              <div
                key={title}
                style={{
                  background: "var(--color-surface-low)",
                  borderRadius: "1rem",
                  padding: "2.5rem", // was 2rem
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top shine line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, var(--color-outline-variant), transparent)",
                  }}
                />
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    marginBottom: "1.5rem",
                    background: iconBg,
                  }}
                >
                  {emoji}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--color-on-surface)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "var(--color-on-surface-variant)",
                    lineHeight: 1.8,
                  }}
                >
                  {desc}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "1.5rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.3rem 0.75rem",
                    borderRadius: "9999px",
                    background: tagBg,
                    color: tagColor,
                  }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section
        id="how-it-works"
        style={{
          padding: "7rem 3rem",
          background: "var(--color-surface-lowest)",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-primary)",
              marginBottom: "1rem",
            }}
          >
            Get started in minutes
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem,3vw,2.75rem)",
              fontWeight: 700,
              color: "var(--color-on-surface)",
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Four steps to a better CF journey
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "2rem",
              marginTop: "4rem",
              position: "relative",
            }}
          >
            {/* Connecting line — top aligned to center of 56px step circles */}
            <div
              style={{
                position: "absolute",
                top: "28px",
                left: "calc(12.5% + 28px)",
                right: "calc(12.5% + 28px)",
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--color-primary-container), var(--color-secondary-container))",
              }}
            />

            {[
              {
                num: "1",
                title: "Sign in with Google",
                desc: "One click. No forms. Your account is created instantly.",
              },
              {
                num: "2",
                title: "Verify your CF handle",
                desc: "Submit any solution to a designated problem — even Wrong Answer counts.",
              },
              {
                num: "3",
                title: "Pick your target rank",
                desc: "Tell us where you want to go and we'll tailor your learning path.",
              },
              {
                num: "4",
                title: "Start improving",
                desc: "Your contest data syncs automatically. Just open the board and get to work.",
              },
            ].map(({ num, title, desc }) => (
              <div
                key={num}
                style={{ textAlign: "center", position: "relative" }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "9999px",
                    background: gradientPrimary,
                    color: "var(--color-on-primary-container)",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {num}
                </div>
                <h4
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--color-on-surface)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {title}
                </h4>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--color-on-surface-variant)",
                    lineHeight: 1.7,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA STRIP ══════════════ */}
      <section
        style={{
          padding: "7rem 3rem",
          background: "var(--color-surface-low)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(88,101,242,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem,3vw,2.75rem)",
              fontWeight: 700,
              color: "var(--color-on-surface)",
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            Your CF improvement
            <br />
            starts today.
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-on-surface-variant)",
              marginBottom: "2.5rem",
              lineHeight: 1.7,
            }}
          >
            Join competitive programmers who stopped forgetting their unsolved
            problems.
          </p>
          <SignInButton
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              background: gradientPrimary,
              color: "var(--color-on-primary-container)",
              borderRadius: "0.625rem",
              border: "none",
              padding: "0.9375rem 2rem",
              fontSize: "1.0625rem",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-body)",
            }}
          >
            Get Started Free <ArrowRight />
          </SignInButton>
          <p
            style={{
              marginTop: "1.25rem",
              fontSize: "0.9375rem",
              color: "var(--color-outline)",
            }}
          >
            Free · No credit card · Syncs with Codeforces
          </p>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer
        style={{
          background: "var(--color-surface-lowest)",
          padding: "2.5rem",
          textAlign: "center",
          fontSize: "0.9375rem",
          color: "var(--color-outline)",
        }}
      >
        <p>
          © 2026 AlgoBoard · Built by{" "}
          <a
            href="https://codeforces.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
            }}
          >
            a lost CF user
          </a>{" "}
          for every lost CF user ·{" "}
          <Link
            href="/dashboard"
            style={{
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
            }}
          >
            Demo
          </Link>
        </p>
      </footer>
    </div>
  );
}
