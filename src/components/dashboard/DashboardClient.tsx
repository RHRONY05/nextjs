"use client";

import { useState } from "react";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import RatingBucketChart from "@/components/dashboard/RatingBucketChart";
import TopicTagChart from "@/components/dashboard/TopicTagChart";
import RatingGraph from "@/components/dashboard/RatingGraph";
import ContestTable from "@/components/dashboard/ContestTable";
import SyncButton from "@/components/dashboard/SyncButton";
import DailyProblem from "@/components/dashboard/DailyProblem";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

interface Props {
  user: any;
  hasCfHandle: boolean;
  solvedCount: number;
  contestCount: number;
  problemsByRating: any[];
  topicsSolved: any[];
  ratingHistory: any[];
  lastSynced: string | null;
}

export default function DashboardClient({
  user,
  hasCfHandle,
  solvedCount,
  contestCount,
  problemsByRating,
  topicsSolved,
  ratingHistory,
  lastSynced
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="dash-header">
        <h1 className="dash-header__title">Dashboard</h1>
        {hasCfHandle && <SyncButton lastSynced={lastSynced ? new Date(lastSynced) : null} />}
      </header>

      <div className="dash-content">
        <ProfileHeader
          user={user}
          solvedCount={solvedCount}
          contestCount={contestCount}
        />

        {!hasCfHandle ? (
          <div
            style={{
              marginTop: "1rem",
              background: "var(--color-surface-low)",
              borderRadius: "1.5rem",
              padding: "4rem 2rem",
              textAlign: "center",
              border: "1px dashed var(--color-outline-variant)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              boxShadow: "0 8px 32px rgba(12,14,20,0.4)"
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🔌</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "var(--color-on-surface)"
              }}
            >
              Connect Your Codeforces Account
            </h2>
            <p
              style={{
                color: "var(--color-on-surface-variant)",
                maxWidth: "600px",
                lineHeight: 1.7,
                marginBottom: "1rem",
                fontSize: "1.125rem"
              }}
            >
              To unlock your activity heatmap, daily problem recommendations, and the upsolving board, you need to link your Codeforces handle.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
                color: "#fff",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                fontWeight: 700,
                fontSize: "1.125rem",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 8px 24px rgba(88,101,242,0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(88,101,242,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(88,101,242,0.3)";
              }}
            >
              Connect Codeforces Handle
            </button>
          </div>
        ) : (
          <>
            {/* Daily Problem Challenge */}
            <DailyProblem />

            <ActivityHeatmap handle={user.cfHandle} />

            <div className="row-charts">
              <RatingBucketChart data={problemsByRating} />
              <TopicTagChart data={topicsSolved} />
            </div>

            <RatingGraph data={ratingHistory} />

            <ContestTable data={ratingHistory} />
          </>
        )}
      </div>

      <OnboardingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}