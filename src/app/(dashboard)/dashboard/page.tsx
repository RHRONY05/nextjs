// Stats Dashboard — Route: /dashboard
// Fetches real CF data from the database

import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import SubmissionHeatmap from "@/components/dashboard/SubmissionHeatmap";
import RatingBucketChart from "@/components/dashboard/RatingBucketChart";
import TopicTagChart from "@/components/dashboard/TopicTagChart";
import RatingGraph from "@/components/dashboard/RatingGraph";
import ContestTable from "@/components/dashboard/ContestTable";
import SyncButton from "@/components/dashboard/SyncButton";
import DailyProblem from "@/components/dashboard/DailyProblem";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectMongoose();
  const userDoc = await UserModel.findById(session.user.id).lean();

  if (!userDoc) {
    redirect("/api/auth/signin");
  }

  if (!userDoc.onboardingComplete) {
    redirect("/onboarding");
  }

  // Serialize user data for client components
  const user = JSON.parse(JSON.stringify(userDoc));

  const hasCfHandle = !!user.cfHandle && user.cfHandleVerified;

  if (!hasCfHandle) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-surface)",
          padding: "2rem",
        }}
      >
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
          <Link
            href="/onboarding"
            style={{
              display: "inline-block",
              background:
                "linear-gradient(135deg, var(--color-primary-container), var(--color-primary))",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Connect Codeforces Handle
          </Link>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const solvedCount = user.solvedProblems?.length || 0;
  const contestCount = user.contestHistory?.length || 0;

  // Group problems by rating bucket
  const ratingBuckets = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500];
  const problemsByRating = ratingBuckets.map((rating) => ({
    rating,
    count: user.solvedProblems?.filter((p) => p.rating === rating).length || 0,
  }));

  // Group problems by tag (top 10)
  const tagCounts = new Map<string, number>();
  user.solvedProblems?.forEach((p) => {
    p.tags.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const topicsSolved = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Rating history for graph
  const ratingHistory = user.contestHistory?.map((c) => ({
    contestId: c.contestId,
    contestName: c.contestName,
    rank: c.rank,
    oldRating: c.oldRating,
    newRating: c.newRating,
    ratingChange: c.ratingChange,
    participatedAt: c.participatedAt,
  })) || [];

  // Calculate last synced time
  const lastSynced = user.cfProfile?.lastSyncedAt
    ? new Date(user.cfProfile.lastSyncedAt)
    : null;

  return (
    <>
      <header className="dash-header">
        <h1 className="dash-header__title">Dashboard</h1>
        <SyncButton lastSynced={lastSynced} />
      </header>

      <div className="dash-content">
        <ProfileHeader
          user={user}
          solvedCount={solvedCount}
          contestCount={contestCount}
        />

        {/* Daily Problem Challenge */}
        <DailyProblem />

        <SubmissionHeatmap totalSubmissions={solvedCount} />

        <div className="row-charts">
          <RatingBucketChart data={problemsByRating} />
          <TopicTagChart data={topicsSolved} />
        </div>

        <RatingGraph data={ratingHistory} />

        <ContestTable data={ratingHistory} />
      </div>
    </>
  );
}
