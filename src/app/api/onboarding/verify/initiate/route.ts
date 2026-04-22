// POST /api/onboarding/verify/initiate
// Assigns a random verification problem and stores it on the user document
// PRD: POST /api/onboarding/verify/initiate

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";

// A small pool of easy problems — any verdict counts for verification
const VERIFICATION_PROBLEMS = [
  { contestId: 4,   problemIndex: "A", problemName: "Watermelon",          url: "https://codeforces.com/problemset/problem/4/A"   },
  { contestId: 71,  problemIndex: "A", problemName: "Way Too Long Words",  url: "https://codeforces.com/problemset/problem/71/A"  },
  { contestId: 158, problemIndex: "A", problemName: "Next Round",          url: "https://codeforces.com/problemset/problem/158/A" },
  { contestId: 231, problemIndex: "A", problemName: "Team",                url: "https://codeforces.com/problemset/problem/231/A" },
  { contestId: 263, problemIndex: "A", problemName: "Beautiful Matrix",    url: "https://codeforces.com/problemset/problem/263/A" },
];

const WINDOW_MINUTES = 10;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const cfHandle = (body.cfHandle ?? "").trim();

  if (!cfHandle) {
    return NextResponse.json(
      { error: true, message: "Handle not provided", code: "VALIDATION_ERROR" },
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

  // Block if a non-expired verification is already in progress
  if (user.cfVerification && user.cfVerification.expiresAt > new Date()) {
    return NextResponse.json(
      { error: true, message: "Verification already in progress for this user", code: "RATE_LIMITED" },
      { status: 429 },
    );
  }

  // Pick a random problem
  const problem = VERIFICATION_PROBLEMS[Math.floor(Math.random() * VERIFICATION_PROBLEMS.length)];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + WINDOW_MINUTES * 60 * 1000);

  // Persist handle + verification record (unverified until poll confirms)
  user.cfHandle = cfHandle;
  user.cfHandleVerified = false;
  user.cfVerification = {
    initiatedAt: now,
    problem: `${problem.contestId}${problem.problemIndex}`,
    expiresAt,
  };
  await user.save();

  return NextResponse.json({
    verificationProblem: {
      contestId: problem.contestId,
      problemIndex: problem.problemIndex,
      problemName: problem.problemName,
      url: problem.url,
    },
    expiresAt: expiresAt.toISOString(),
    instructions: `Submit any solution to problem ${problem.contestId}${problem.problemIndex} on Codeforces within ${WINDOW_MINUTES} minutes`,
  });
}
