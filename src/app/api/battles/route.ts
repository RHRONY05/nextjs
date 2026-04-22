import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import BattleModel from "@/lib/models/Battle";

const CF_API_BASE = "https://codeforces.com/api";

// Helper to fetch solved problems for a handle
async function fetchSolvedProblems(handle: string): Promise<Set<string>> {
  const res = await fetch(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=100000`);
  const data = await res.json();
  
  if (data.status !== "OK") {
    throw new Error(`Failed to fetch submissions for ${handle}`);
  }

  const solved = new Set<string>();
  for (const sub of data.result) {
    if (sub.verdict === "OK" && sub.problem) {
      solved.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  }
  return solved;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);
  if (!user || !user.cfHandle) {
    return NextResponse.json({ battles: [] });
  }

  const battles = await BattleModel.find({
    $or: [
      { userId: session.user.id },
      { opponentHandle: user.cfHandle }
    ]
  }).sort({ createdAt: -1 });

  return NextResponse.json({ battles, currentUserHandle: user.cfHandle });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { opponentHandle, rating } = body;

  if (!opponentHandle) {
    return NextResponse.json({ error: true, message: "Opponent handle is required" }, { status: 400 });
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);

  if (!user || !user.cfHandle) {
    return NextResponse.json({ error: true, message: "Your CF handle is not connected" }, { status: 400 });
  }

  if (opponentHandle.toLowerCase() === user.cfHandle.toLowerCase()) {
    return NextResponse.json({ error: true, message: "You cannot challenge yourself" }, { status: 400 });
  }

  try {
    // 1. Verify opponent exists
    const oppRes = await fetch(`${CF_API_BASE}/user.info?handles=${opponentHandle}`);
    const oppData = await oppRes.json();
    if (oppData.status !== "OK" || !oppData.result || oppData.result.length === 0) {
      return NextResponse.json({ error: true, message: "Opponent CF handle not found" }, { status: 404 });
    }

    // 2. Fetch solved problems for both
    const [userSolved, oppSolved] = await Promise.all([
      fetchSolvedProblems(user.cfHandle),
      fetchSolvedProblems(opponentHandle),
    ]);

    const combinedSolved = new Set([...userSolved, ...oppSolved]);

    // 3. Fetch problemset
    const problemsRes = await fetch(`${CF_API_BASE}/problemset.problems`);
    const problemsData = await problemsRes.json();

    if (problemsData.status !== "OK") {
      throw new Error("Failed to fetch problemset");
    }

    // 4. Filter problems
    let validProblems = problemsData.result.problems.filter((p: any) => {
      // Must not be solved by either
      if (combinedSolved.has(`${p.contestId}-${p.index}`)) return false;
      // Filter by rating if provided
      if (rating && p.rating !== rating) return false;
      // Exclude problems without rating if a specific rating was requested
      if (rating && !p.rating) return false;
      return true;
    });

    if (validProblems.length === 0) {
      // Fallback: If no problem with exact rating, try within a range (+/- 100)
      if (rating) {
        validProblems = problemsData.result.problems.filter((p: any) => {
          if (combinedSolved.has(`${p.contestId}-${p.index}`)) return false;
          if (p.rating && Math.abs(p.rating - rating) <= 100) return true;
          return false;
        });
      }
      
      if (validProblems.length === 0) {
        return NextResponse.json({ error: true, message: "Could not find a suitable unsolved problem for both players." }, { status: 404 });
      }
    }

    // 5. Pick random problem
    const selectedProblem = validProblems[Math.floor(Math.random() * validProblems.length)];

    // 6. Create Battle
    const battle = new BattleModel({
      userId: user._id,
      userHandle: user.cfHandle,
      opponentHandle: oppData.result[0].handle, // Use exact casing
      problem: {
        contestId: selectedProblem.contestId,
        index: selectedProblem.index,
        name: selectedProblem.name,
        rating: selectedProblem.rating,
        tags: selectedProblem.tags,
      },
    });

    await battle.save();

    return NextResponse.json({ message: "Battle invite sent!", battle });
  } catch (error: any) {
    console.error("Battle creation error:", error);
    return NextResponse.json({ error: true, message: error.message || "Failed to create battle" }, { status: 500 });
  }
}
