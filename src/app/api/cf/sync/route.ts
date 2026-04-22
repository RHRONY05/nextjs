// POST /api/cf/sync
// Syncs user's CF data (submissions, contests, profile)
// This is a simplified version - full implementation would be in Express worker

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import KanbanCardModel from "@/lib/models/KanbanCard";

const CF_API_BASE = "https://codeforces.com/api";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);

  if (!user || !user.cfHandle || !user.cfHandleVerified) {
    return NextResponse.json(
      { error: true, message: "CF handle not found or not verified", code: "HANDLE_NOT_VERIFIED" },
      { status: 404 },
    );
  }

  try {
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
        cfAvatar: cfUser.titlePhoto || cfUser.avatar,
        lastSyncedAt: new Date(),
      };
    }

    // Fetch ALL submissions (CF API returns max 100000 per request, we'll fetch in batches)
    const allSubmissions: any[] = [];
    let from = 1;
    const batchSize = 10000; // Fetch 10k at a time
    
    while (true) {
      const submissionsRes = await fetch(
        `${CF_API_BASE}/user.status?handle=${user.cfHandle}&from=${from}&count=${batchSize}`
      );
      const submissionsData = await submissionsRes.json();

      if (submissionsData.status !== "OK" || !submissionsData.result || submissionsData.result.length === 0) {
        break;
      }

      allSubmissions.push(...submissionsData.result);
      
      // If we got less than batchSize, we've reached the end
      if (submissionsData.result.length < batchSize) {
        break;
      }
      
      from += batchSize;
    }

    if (allSubmissions.length > 0) {
      const acceptedProblems = new Map<string, any>();
      const solvedDates = new Set<string>();

      allSubmissions.forEach((sub: any) => {
        if (sub.verdict === "OK") {
          const key = `${sub.problem.contestId}-${sub.problem.index}`;
          const solvedDate = new Date(sub.creationTimeSeconds * 1000);
          const dateStr = solvedDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          solvedDates.add(dateStr);
          
          if (!acceptedProblems.has(key)) {
            acceptedProblems.set(key, {
              contestId: sub.problem.contestId,
              problemIndex: sub.problem.index,
              problemName: sub.problem.name,
              rating: sub.problem.rating,
              tags: sub.problem.tags || [],
              solvedAt: solvedDate,
            });
          }
        }
      });

      user.solvedProblems = Array.from(acceptedProblems.values());
      
      // Calculate streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastSolvedDate: Date | null = null;
      
      // Sort dates descending
      const sortedDates = Array.from(solvedDates).sort().reverse();
      
      for (const dateStr of sortedDates) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        
        if (!lastSolvedDate) {
          // First date
          const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 0 || daysDiff === 1) {
            currentStreak = 1;
            tempStreak = 1;
          }
          lastSolvedDate = date;
        } else {
          const daysDiff = Math.floor((lastSolvedDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            tempStreak++;
            if (currentStreak > 0) currentStreak++;
          } else if (daysDiff > 1) {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
          lastSolvedDate = date;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
      
      user.gamification.currentStreak = currentStreak;
      user.gamification.longestStreak = longestStreak;
      user.gamification.lastSolvedDate = sortedDates.length > 0 ? new Date(sortedDates[0]) : undefined;
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

    // Auto-detect solved problems on the board
    let autoSolvedCount = 0;
    const boardCards = await KanbanCardModel.find({
      userId: user._id,
      column: { $in: ["to_upsolve", "trying"] },
    });

    if (boardCards.length > 0) {
      const solvedProblemsSet = new Set(
        user.solvedProblems.map((p: any) => `${p.contestId}-${p.problemIndex}`)
      );

      for (const card of boardCards) {
        const cardKey = `${card.contestId}-${card.problemIndex}`;
        if (solvedProblemsSet.has(cardKey)) {
          // Move to solved column
          card.column = "solved";
          card.solvedAt = new Date();
          card.autoSolved = true;
          
          // Award XP (problem rating)
          if (card.rating) {
            user.gamification.xp += card.rating;
          }
          
          await card.save();
          autoSolvedCount++;
        }
      }

      if (autoSolvedCount > 0) {
        await user.save(); // Save XP changes
      }
    }

    return NextResponse.json({
      message: "Sync completed",
      syncedAt: new Date().toISOString(),
      solvedProblems: user.solvedProblems.length,
      contests: user.contestHistory.length,
      autoSolvedCount,
    });
  } catch (error) {
    console.error("CF sync error:", error);
    return NextResponse.json(
      { error: true, message: "Codeforces API is currently unavailable", code: "CF_API_UNAVAILABLE" },
      { status: 503 },
    );
  }
}
