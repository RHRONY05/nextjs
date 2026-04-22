// GET /api/daily-problem
// Returns a recommended problem based on user's rating and target rank

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";

const CF_API_BASE = "https://codeforces.com/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id).lean();

  if (!user || !user.cfHandle || !user.cfHandleVerified) {
    return NextResponse.json(
      { error: true, message: "CF handle not found or not verified", code: "HANDLE_NOT_VERIFIED" },
      { status: 404 },
    );
  }

  try {
    // Determine target rating range based on user's current rating and goal
    const currentRating = user.cfProfile?.rating || 1200;
    const targetRating = user.targetRating || 1600;
    
    // Recommend problems slightly above current rating (for growth)
    // But not exceeding target rating by too much
    const minRating = Math.max(800, currentRating - 200);
    const maxRating = Math.min(targetRating + 200, currentRating + 400);
    
    // Fetch problemset
    const problemsetRes = await fetch(`${CF_API_BASE}/problemset.problems`);
    const problemsetData = await problemsetRes.json();

    if (problemsetData.status !== "OK") {
      return NextResponse.json(
        { error: true, message: "Failed to fetch problems", code: "CF_API_UNAVAILABLE" },
        { status: 503 },
      );
    }

    // Get solved problem IDs
    const solvedIds = new Set(
      user.solvedProblems?.map((p: any) => `${p.contestId}-${p.problemIndex}`) || []
    );

    // Filter problems
    const candidates = problemsetData.result.problems.filter((p: any) => {
      const problemId = `${p.contestId}-${p.index}`;
      return (
        p.rating &&
        p.rating >= minRating &&
        p.rating <= maxRating &&
        !solvedIds.has(problemId) &&
        p.tags && p.tags.length > 0 // Has tags
      );
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: true, message: "No suitable problems found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Use date-based seed for consistent daily problem
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = today.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const index = seed % candidates.length;
    
    const problem = candidates[index];

    return NextResponse.json({
      problem: {
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags,
        url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
      },
      recommendation: {
        currentRating,
        targetRating,
        difficulty: problem.rating > currentRating + 100 ? "challenging" : 
                   problem.rating > currentRating ? "moderate" : "practice",
      },
    });
  } catch (error) {
    console.error("Daily problem error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to generate recommendation", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
