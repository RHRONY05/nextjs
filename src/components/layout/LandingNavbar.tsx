"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

// Google "G" logo SVG (official multicolor version)
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="18"
      height="18"
    >
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
  );
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        background: scrolled ? "rgba(17,19,25,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.2s ease, backdrop-filter 0.2s ease",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "9999px",
            background:
              "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "var(--color-on-surface)",
          }}
        >
          AlgoBoard
        </span>
      </Link>

      {/* Nav links */}
      <ul
        style={{
          display: "flex",
          gap: "2rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a
            href="#features"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
            }}
          >
            Features
          </a>
        </li>
        <li>
          <a
            href="#how-it-works"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--color-on-surface-variant)",
              textDecoration: "none",
            }}
          >
            How it works
          </a>
        </li>
      </ul>

      {/* Google sign-in CTA — directly calls NextAuth signIn, redirecting to dashboard */}
      <button
        onClick={() => {
          setIsLoading(true);
          signIn("google", { redirectTo: "/dashboard" });
        }}
        disabled={isLoading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--color-primary)",
          color: "#1f1f1f",
          border: "1px solid #747775",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: 500,
          textDecoration: "none",
          fontFamily: "var(--font-body)",
          whiteSpace: "nowrap",
          cursor: isLoading ? "wait" : "pointer",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <span
            style={{
              display: "inline-block",
              width: "18px",
              height: "18px",
              border: "2px solid rgba(0,0,0,0.1)",
              borderTop: "2px solid #1f1f1f",
              borderRadius: "50%",
              animation: "spinCW 0.8s linear infinite",
            }}
          />
        ) : (
          <GoogleIcon />
        )}
        {isLoading ? "Redirecting..." : "Sign in with Google"}
      </button>
    </nav>
  );
}
