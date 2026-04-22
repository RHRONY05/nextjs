"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import type { User } from "@/types";

const NAV_ITEMS = [
// ... (NAV_ITEMS and getIconFor remain same)
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upsolve Board", href: "/board" },
  { label: "Topic Ladder", href: "/topics" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Friend Compare", href: "/compare" },
  { label: "Badges", href: "/badges" },
] as const;

function getIconFor(label: string) {
  switch (label) {
    case "Dashboard":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "Upsolve Board":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      );
    case "Topic Ladder":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "Leaderboard":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "Friend Compare":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "Badges":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Handle Codeforces avatar URL protocol
  const getAvatarUrl = () => {
    // If the image fails to load, we'll try fallbacks in the onError handler
    // This function just returns the initial best candidate

    const avatar = user.cfProfile?.cfAvatar;
    if (avatar && !avatarError) {
      if (avatar.startsWith("https:https://")) {
        return avatar.replace("https:https://", "https://");
      }
      return avatar.startsWith("//") ? `https:${avatar}` : avatar;
    }

    if (user.avatar && !avatarError) {
      return user.avatar;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5865F2&color=fff&size=128&bold=true`;
  };

  if (!mounted) {
    return (
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-dot" />
          <span className="sidebar__logo-text">AlgoBoard</span>
        </div>
        <nav className="sidebar__nav" />
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      {/* ── Logo ── */}
      <Link href="/" className="sidebar__logo">
        <div className="sidebar__logo-dot" />
        <span className="sidebar__logo-text">AlgoBoard</span>
      </Link>

      {/* ── Main nav ── */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar__link ${active ? "active" : ""}`}
            >
              {getIconFor(label)}
              {label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="sidebar__divider" />

        {/* Settings */}
        <Link
          href="/settings"
          className={`sidebar__link ${isActive("/settings") ? "active" : ""}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </Link>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="sidebar__link logout-btn"
          style={{
            background: "none",
            border: "none",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            color: "var(--color-error, #ffb4ab)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "8px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="20"
            height="20"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </nav>

      {/* ── User section ── */}
      <div className="sidebar__user">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAvatarUrl()}
          alt={user.name}
          className="sidebar__user-avatar"
          onError={() => setAvatarError(true)}
        />

        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{user.name}</div>
          <div className="sidebar__user-rank">
            {user.cfProfile?.rank
              ? user.cfProfile.rank.charAt(0).toUpperCase() +
                user.cfProfile.rank.slice(1).replace(/_/g, " ")
              : "Newcomer"}
          </div>
        </div>
      </div>
    </aside>
  );
}
