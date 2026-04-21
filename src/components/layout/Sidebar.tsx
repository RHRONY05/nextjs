"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_USER } from "@/lib/mock-data";

const NAV_ITEMS = [
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

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
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
      </nav>

      {/* ── User section ── */}
      <div className="sidebar__user">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            MOCK_USER.avatar ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(MOCK_USER.name)}&background=5865F2&color=fff&size=128&bold=true`
          }
          alt={MOCK_USER.name}
          className="sidebar__user-avatar"
        />

        <div className="sidebar__user-info">
          <div className="sidebar__user-name">{MOCK_USER.name}</div>
          <div className="sidebar__user-rank">
            {MOCK_USER.cfProfile?.rank
              ? MOCK_USER.cfProfile.rank.charAt(0).toUpperCase() +
                MOCK_USER.cfProfile.rank.slice(1).replace(/_/g, " ")
              : "Specialist"}
          </div>
        </div>
      </div>
    </aside>
  );
}
