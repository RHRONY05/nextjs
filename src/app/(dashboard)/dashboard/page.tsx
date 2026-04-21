// Stats Dashboard — Route: /dashboard
// Reference: frontend/dashboard.html + frontend/css/dashboard.css
// SRS: F03–F08
// Phase 6

import {
  MOCK_USER,
  MOCK_RATING_HISTORY,
  MOCK_PROBLEMS_BY_RATING,
  MOCK_TOPICS_SOLVED,
} from "@/lib/mock-data";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import SubmissionHeatmap from "@/components/dashboard/SubmissionHeatmap";
import RatingBucketChart from "@/components/dashboard/RatingBucketChart";
import TopicTagChart from "@/components/dashboard/TopicTagChart";
import RatingGraph from "@/components/dashboard/RatingGraph";
import ContestTable from "@/components/dashboard/ContestTable";

export default function DashboardPage() {
  // Aggregate stats from mock data (real values come from DB in backend phase)
  const solvedCount = MOCK_PROBLEMS_BY_RATING.reduce(
    (sum, d) => sum + d.count,
    0,
  );
  const contestCount = MOCK_RATING_HISTORY.length;

  const hasCfHandle = !!MOCK_USER.cfHandle;

  if (!hasCfHandle) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-surface)",
          padding: "2rem",
        }}
      >
        <ProfileHeader
          user={{ ...MOCK_USER, cfHandle: undefined, cfProfile: undefined }}
          solvedCount={0}
          contestCount={0}
        />
        <div
          style={{
            marginTop: "2rem",
            background: "var(--color-surface-low)",
            borderRadius: "1rem",
            padding: "3rem",
            textAlign: "center",
            border: "1px dashed var(--color-outline-variant)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Codeforces Account Not Connected
          </h2>
          <p
            style={{
              color: "var(--color-on-surface-variant)",
              marginBottom: "2rem",
            }}
          >
            Connect your Codeforces handle to unlock your stats, rating history,
            and upsolving board.
          </p>
          <button
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
            }}
          >
            Connect Codeforces Handle
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="dash-header">
        <h1 className="dash-header__title">Dashboard</h1>
        <div className="dash-header__right">
          <span className="dash-header__sync-text">
            Last synced <b>2 min ago</b>
          </span>
          <button className="btn-sync">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Sync Now
          </button>
        </div>
      </header>

      <div className="dash-content">
        <ProfileHeader
          user={MOCK_USER}
          solvedCount={solvedCount}
          contestCount={contestCount}
        />

        {/* Row 2: Submission heatmap */}
        <SubmissionHeatmap totalSubmissions={solvedCount} />

        {/* Row 3: Rating bucket chart (wider) + Topic tag chart */}
        <div className="row-charts">
          <RatingBucketChart data={MOCK_PROBLEMS_BY_RATING} />
          <TopicTagChart data={MOCK_TOPICS_SOLVED} />
        </div>

        {/* Row 4: Rating progress line chart */}
        <RatingGraph data={MOCK_RATING_HISTORY} />

        {/* Row 5: Contest history table */}
        <ContestTable data={MOCK_RATING_HISTORY} />
      </div>
    </>
  );
}
