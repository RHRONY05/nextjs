"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SignInButton, { GoogleIcon } from "./SignInButton";

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

      {/* Google sign-in CTA */}
      <SignInButton
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--color-primary)",
          color: "var(--color-on-primary-container)",
          border: "none",
          borderRadius: "4px",
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: 500,
          textDecoration: "none",
          fontFamily: "var(--font-body)",
          whiteSpace: "nowrap",
        }}
      />
    </nav>
  );
}
