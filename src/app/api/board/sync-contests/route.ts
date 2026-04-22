// POST /api/board/sync-contests
// Syncs ONLY unsolved problems from contests the user participated in

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
    // Get contests the user participated in
    const contestHistory = user.contestHistory || [];
    
    if (contestHistory.length === 0) {
      return NextResponse.json({
        message: "You haven't participated in any contests yet!",
        addedCards: 0,
      });
    }

    // Get user's rating range based on current rating and target
    const currentRating = user.cfProfile?.rating || 1200;
    const targetRating = user.targetRating || 1600;
    
    // Only add problems within a reasonable range of user's skill level
    // Range: currentRating - 200 to targetRating + 200
    const minRating = Math.max(800, currentRating - 200);
    const maxRating = Math.min(3500, targetRating + 200);

    // Get contest IDs user participated in
    const participatedContestIds = new Set(
      contestHistory.map((c: any) => c.contestId)
    );

    // Get solved problem IDs
    const solvedIds = new Set(
      user.solvedProblems?.map((p: any) => `${p.contestId}-${p.problemIndex}`) || []
    );

    // Get problems already on the board
    const existingBoardCards = await KanbanCardModel.find({
      userId: session.user.id,
    }).select("contestId problemIndex").lean();
    
    const boardProblemIds = new Set(
      existingBoardCards.map((card: any) => `${card.contestId}-${card.problemIndex}`)
    );

    // Fetch problemset to get all problems
    const problemsetRes = await fetch(`${CF_API_BASE}/problemset.problems`);
    const problemsetData = await problemsetRes.json();

    if (problemsetData.status !== "OK") {
      return NextResponse.json(
        { error: true, message: "Failed to fetch problems", code: "CF_API_UNAVAILABLE" },
        { status: 503 },
      );
    }

    // Filter: ONLY problems from contests user participated in, within rating range, unsolved, not on board
    const unsolvedContestProblems = problemsetData.result.problems.filter((p: any) => {
      const problemId = `${p.contestId}-${p.index}`;
      return (
        participatedContestIds.has(p.contestId) && // From a contest user participated in
        p.rating && // Has a rating
        p.rating >= minRating && // Within user's skill range
        p.rating <= maxRating && // Within target goal range
        !solvedIds.has(problemId) && // Not solved
        !boardProblemIds.has(problemId) // Not already on board
      );
    });

    if (unsolvedContestProblems.length === 0) {
      return NextResponse.json({
        message: `No unsolved problems from your contests in the rating range ${minRating}-${maxRating}!`,
        addedCards: 0,
        ratingRange: { min: minRating, max: maxRating },
      });
    }

    // Sort by rating (ascending)
    unsolvedContestProblems.sort((a: any, b: any) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingA - ratingB;
    });

    let addedCount = 0;

    for (const problem of unsolvedContestProblems) {
      // Get contest name from user's contest history
      const contest = contestHistory.find((c: any) => c.contestId === problem.contestId);
      const contestName = contest?.contestName || `Contest ${problem.contestId}`;

      // Add to board
      const maxPos = await KanbanCardModel.findOne({
        userId: session.user.id,
        column: "to_upsolve",
      })
        .sort({ position: -1 })
        .select("position")
        .lean();

      await KanbanCardModel.create({
        userId: session.user.id,
        contestId: problem.contestId,
        problemIndex: problem.index,
        problemName: problem.name,
        problemUrl: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
        rating: problem.rating,
        tags: problem.tags || [],
        column: "to_upsolve",
        position: (maxPos?.position || 0) + addedCount + 1,
        source: "contest_sync",
        contestName,
      });

      addedCount++;
    }

    return NextResponse.json({
      message: `Added ${addedCount} unsolved problem${addedCount > 1 ? 's' : ''} from your contests (rating ${minRating}-${maxRating})`,
      addedCards: addedCount,
      contestsChecked: participatedContestIds.size,
      ratingRange: { min: minRating, max: maxRating },
    });
  } catch (error) {
    console.error("Contest sync error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to sync problems", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
