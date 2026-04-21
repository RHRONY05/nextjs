"use client";

import { useState, useCallback } from "react";
import type { User } from "@/types";

interface Props {
  user: User;
  solvedCount: number;
  contestCount: number;
}

function capitalize(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "—";
}

export default function ProfileHeader({
  user,
  solvedCount,
  contestCount,
}: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncText, setSyncText] = useState("2 min ago");

  const handleSync = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncText("just now");
    }, 2000);
  }, [syncing]);

  const { cfProfile, gamification } = user;

  return (
    <>
      <div className="row-profile">
        <div className="profile-card">
          <div className="profile-card__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                user.avatar ??
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5865F2&color=fff&size=128&bold=true`
              }
              className="profile-card__avatar"
              alt="avatar"
            />
            <div className="profile-card__info">
              <div className="profile-card__handle">
                {user.cfHandle ?? user.name}
              </div>
              <span className="profile-card__rating-badge">
                {cfProfile?.rating ?? "—"} · {capitalize(cfProfile?.rank)}
              </span>
            </div>
          </div>
          <div className="profile-card__meta">
            {cfProfile?.country && (
              <span className="profile-card__meta-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>{cfProfile.country}</span>
              </span>
            )}
            {cfProfile?.organization && (
              <span className="profile-card__meta-item">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>{cfProfile.organization}</span>
              </span>
            )}
          </div>
          <div className="profile-card__peak">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Peak rating:{" "}
            <span>
              {cfProfile?.maxRating ?? "—"} ({capitalize(cfProfile?.maxRank)})
            </span>
          </div>
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--indigo">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#BEC2FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="stat-card__info">
              <div className="stat-card__value">{solvedCount}</div>
              <div className="stat-card__label">Problems Solved</div>
              <div className="stat-card__sub">
                Across all contests &amp; practice
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--teal">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5DDCB3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
            </div>
            <div className="stat-card__info">
              <div className="stat-card__value">{contestCount}</div>
              <div className="stat-card__label">Rated Contests</div>
              <div className="stat-card__sub">Since joining Codeforces</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--amber">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F5A623"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
            <div className="stat-card__info">
              <div className="stat-card__value">
                {gamification.currentStreak}🔥
              </div>
              <div className="stat-card__label">Day Streak</div>
              <div className="stat-card__sub">
                Longest: {gamification.longestStreak} days
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
