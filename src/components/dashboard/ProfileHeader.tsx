"use client";

import { useState, useCallback, useEffect } from "react";
import type { User } from "@/types";

interface Props {
  user: User;
  solvedCount: number;
  contestCount: number;
}

function capitalize(s?: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "—";
}

function getRankColor(rank?: string) {
  if (!rank) return "var(--color-on-surface)";
  const r = rank.toLowerCase();
  if (r.includes("legendary")) return "#ff0000";
  if (r.includes("international grandmaster")) return "#ff0000";
  if (r.includes("grandmaster")) return "#ff0000";
  if (r.includes("international master")) return "#ff8c00";
  if (r.includes("master")) return "#ff8c00";
  if (r.includes("candidate master")) return "#a0a";
  if (r.includes("expert")) return "#0000ff";
  if (r.includes("specialist")) return "#03a89e";
  if (r.includes("pupil")) return "#008000";
  if (r.includes("newbie")) return "#808080";
  return "var(--color-on-surface)";
}

export default function ProfileHeader({
  user,
  solvedCount,
  contestCount,
}: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncText, setSyncText] = useState("2 min ago");
  const [mounted, setMounted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Fallback state if DB doesn't have the CF profile or we want to fetch it live
  const [liveProfile, setLiveProfile] = useState(user.cfProfile);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user.cfHandle) return;
    
    // Always try to get the freshest data for the profile header directly from CF
    const controller = new AbortController();
    fetch(`https://codeforces.com/api/user.info?handles=${user.cfHandle}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "OK" && data.result?.length > 0) {
          const p = data.result[0];
          setLiveProfile({
            ...user.cfProfile, // merge with existing in case of missing fields
            handle: p.handle,
            rating: p.rating,
            maxRating: p.maxRating,
            rank: p.rank,
            maxRank: p.maxRank,
            country: p.country,
            organization: p.organization,
            cfAvatar: p.titlePhoto || p.avatar,
          });
        }
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch live CF profile:", err);
        }
      });

    return () => controller.abort();
  }, [user.cfHandle, user.cfProfile]);

  const handleSync = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncText("just now");
    }, 2000);
  }, [syncing]);

  const { gamification = { currentStreak: 0, longestStreak: 0 } } = user;

  const getAvatarUrl = () => {
    // If the image fails to load, we'll try fallbacks in the onError handler
    // This function just returns the initial best candidate

    const avatar = liveProfile?.cfAvatar;
    if (avatar && !avatarError) {
      // Fix double protocol if it was accidentally saved as https:https://
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
      <div className="row-profile">
        <div className="profile-card profile-card--skeleton" style={{ height: "160px" }} />
        <div className="stat-cards">
          <div className="stat-card stat-card--skeleton" style={{ height: "100px" }} />
          <div className="stat-card stat-card--skeleton" style={{ height: "100px" }} />
          <div className="stat-card stat-card--skeleton" style={{ height: "100px" }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row-profile">
        <div className="profile-card">
          <div className="profile-card__top">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getAvatarUrl()}
              className="profile-card__avatar"
              alt="avatar"
              onError={() => setAvatarError(true)}
            />
            <div className="profile-card__info">
              <div 
                className="profile-card__handle"
                style={{ color: getRankColor(liveProfile?.rank), fontWeight: "bold" }}
              >
                {liveProfile?.rank?.toLowerCase().includes("legendary") ? (
                  <>
                    <span style={{ color: "var(--color-on-surface)" }}>{(liveProfile?.handle ?? user.cfHandle)?.[0] ?? user.name[0]}</span>
                    <span>{((liveProfile as any)?.handle ?? user.cfHandle ?? user.name).slice(1)}</span>
                  </>
                ) : (
                  (liveProfile as any)?.handle ?? user.cfHandle ?? user.name
                )}
              </div>
              <span 
                className="profile-card__rating-badge"
                style={{ color: getRankColor(liveProfile?.rank), fontWeight: 600 }}
              >
                {liveProfile?.rating ?? "—"} · {capitalize(liveProfile?.rank)}
              </span>
            </div>
          </div>
          <div className="profile-card__meta">
            {liveProfile?.country && (
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
                <span>{liveProfile.country}</span>
              </span>
            )}
            {liveProfile?.organization && (
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
                <span>{liveProfile.organization}</span>
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
            <span style={{ color: getRankColor(liveProfile?.maxRank), fontWeight: 600 }}>
              {liveProfile?.maxRating ?? "—"} ({capitalize(liveProfile?.maxRank)})
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
                {gamification?.currentStreak ?? 0}🔥
              </div>
              <div className="stat-card__label">Day Streak</div>
              <div className="stat-card__sub">
                Longest: {gamification?.longestStreak ?? 0} days
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
