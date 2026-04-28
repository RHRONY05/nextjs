// Stats Dashboard — Route: /dashboard
// Fetches real CF data from the database

import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { redirect } from "next/navigation";
import DashboardClient from "../../../components/dashboard/DashboardClient";
import type { ContestHistoryEntry, SolvedProblem } from "@/types";

type DashboardUser = {
  cfHandle?: string;
  cfHandleVerified?: boolean;
  solvedProblems?: SolvedProblem[];
  contestHistory?: ContestHistoryEntry[];
  cfProfile?: {
    lastSyncedAt?: string | Date;
  };
};

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

  // Serialize user data for client components
  const user = JSON.parse(JSON.stringify(userDoc)) as DashboardUser;

  const hasCfHandle = Boolean(user.cfHandle && user.cfHandleVerified);
  const solvedProblems = user.solvedProblems ?? [];
  const contestHistory = user.contestHistory ?? [];

  // Aggregate stats
  const solvedCount = solvedProblems.length;
  const contestCount = contestHistory.length;

  // Group problems by rating bucket
  const ratingBuckets = [
    800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000,
    2100, 2200, 2300, 2400, 2500,
  ];
  const problemsByRating = ratingBuckets.map((rating) => ({
    rating,
    count: solvedProblems.filter((problem) => problem.rating === rating).length,
  }));

  // Group problems by tag (top 10)
  const tagCounts = new Map<string, number>();
  solvedProblems.forEach((problem) => {
    problem.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const topicsSolved = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Rating history for graph
  const ratingHistory = contestHistory.map((contest) => ({
    contestId: contest.contestId,
    contestName: contest.contestName,
    rank: contest.rank,
    oldRating: contest.oldRating,
    newRating: contest.newRating,
    ratingChange: contest.ratingChange,
    participatedAt: contest.participatedAt,
  }));

  // Calculate last synced time
  const lastSynced = user.cfProfile?.lastSyncedAt
    ? new Date(user.cfProfile.lastSyncedAt)
    : null;

  return (
    <DashboardClient
      user={user}
      hasCfHandle={hasCfHandle}
      solvedCount={solvedCount}
      contestCount={contestCount}
      problemsByRating={problemsByRating}
      topicsSolved={topicsSolved}
      ratingHistory={ratingHistory}
      lastSynced={lastSynced ? lastSynced.toISOString() : null}
    />
  );
}
