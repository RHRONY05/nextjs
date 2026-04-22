// POST /api/onboarding/complete
// Saves target rank, email preferences, marks onboarding complete
// PRD: POST /api/onboarding/complete

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";

const VALID_RANKS = ["specialist", "expert", "candidate_master", "master"] as const;
const RANK_TO_RATING: Record<string, number> = {
  specialist:       1400,
  expert:           1600,
  candidate_master: 1900,
  master:           2100,
};

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { targetRank, emailPreferences } = body;

  if (!targetRank || !VALID_RANKS.includes(targetRank)) {
    return NextResponse.json(
      { error: true, message: "targetRank is invalid or missing", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  if (
    emailPreferences?.preferredHour !== undefined &&
    (emailPreferences.preferredHour < 0 || emailPreferences.preferredHour > 23)
  ) {
    return NextResponse.json(
      { error: true, message: "preferredHour out of range (must be 0-23)", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);
  if (!user) {
    return NextResponse.json(
      { error: true, message: "User not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  user.targetRank = targetRank;
  user.targetRating = RANK_TO_RATING[targetRank];

  if (emailPreferences) {
    user.emailPreferences = {
      enabled: emailPreferences.enabled ?? false,
      frequency: emailPreferences.frequency ?? "weekly",
      preferredHour: emailPreferences.preferredHour ?? 9,
      timezone: emailPreferences.timezone ?? "UTC",
    };
  }

  user.onboardingComplete = true;
  await user.save();

  // Trigger initial CF data sync
  try {
    const CF_API_BASE = "https://codeforces.com/api";

    // Fetch user info
    const userInfoRes = await fetch(`${CF_API_BASE}/user.info?handles=${user.cfHandle}`);
    const userInfoData = await userInfoRes.json();

    if (userInfoData.status === "OK" && userInfoData.result?.[0]) {
      const cfUser = userInfoData.result[0];
      user.cfProfile = {
        rating: cfUser.rating,
        maxRating: cfUser.maxRating,
        rank: cfUser.rank,
        maxRank: cfUser.maxRank,
        country: cfUser.country,
        organization: cfUser.organization,
        cfAvatar: cfUser.titlePhoto ? `https:${cfUser.titlePhoto}` : (cfUser.avatar ? `https:${cfUser.avatar}` : undefined),
        lastSyncedAt: new Date(),
      };

      // Fetch submissions (last 100)
      const submissionsRes = await fetch(`${CF_API_BASE}/user.status?handle=${user.cfHandle}&from=1&count=100`);
      const submissionsData = await submissionsRes.json();

      if (submissionsData.status === "OK") {
        const acceptedProblems = new Map<string, any>();

        submissionsData.result.forEach((sub: any) => {
          if (sub.verdict === "OK") {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!acceptedProblems.has(key)) {
              acceptedProblems.set(key, {
                contestId: sub.problem.contestId,
                problemIndex: sub.problem.index,
                problemName: sub.problem.name,
                rating: sub.problem.rating,
                tags: sub.problem.tags || [],
                solvedAt: new Date(sub.creationTimeSeconds * 1000),
              });
            }
          }
        });

        user.solvedProblems = Array.from(acceptedProblems.values());
      }

      // Fetch rating changes (contest history)
      const ratingRes = await fetch(`${CF_API_BASE}/user.rating?handle=${user.cfHandle}`);
      const ratingData = await ratingRes.json();

      if (ratingData.status === "OK") {
        user.contestHistory = ratingData.result.map((contest: any) => ({
          contestId: contest.contestId,
          contestName: contest.contestName,
          rank: contest.rank,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          ratingChange: contest.newRating - contest.oldRating,
          participatedAt: new Date(contest.ratingUpdateTimeSeconds * 1000),
        }));
      }

      await user.save();
    }
  } catch (error) {
    console.error("Initial CF sync error:", error);
    // Don't fail onboarding if sync fails - user can sync manually later
  }

  return NextResponse.json({ message: "Onboarding complete", redirectTo: "/dashboard" });
}
