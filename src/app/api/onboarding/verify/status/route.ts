// GET /api/onboarding/verify/status
// Polls Codeforces submissions to check if the user submitted to the verification problem
// PRD: GET /api/onboarding/verify/status

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
  const user = await UserModel.findById(session.user.id);
  if (!user) {
    return NextResponse.json(
      { error: true, message: "User not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  // Already verified
  if (user.cfHandleVerified) {
    return NextResponse.json({
      status: "verified",
      cfHandle: user.cfHandle,
      message: "Handle verified successfully!",
    });
  }

  if (!user.cfVerification || !user.cfHandle) {
    return NextResponse.json(
      { error: true, message: "No verification in progress", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const now = new Date();

  // Check expiry
  if (user.cfVerification.expiresAt <= now) {
    return NextResponse.json({
      status: "expired",
      message: "Verification window expired. Please try again.",
    });
  }

  const timeRemainingSeconds = Math.floor(
    (user.cfVerification.expiresAt.getTime() - now.getTime()) / 1000,
  );

  // Parse stored problem string e.g. "4A" → contestId=4, index="A"
  const problemStr = user.cfVerification.problem; // e.g. "4A"
  const match = problemStr.match(/^(\d+)([A-Z]\d*)$/i);
  if (!match) {
    return NextResponse.json({ status: "pending", message: "Waiting for your submission...", timeRemainingSeconds });
  }
  const contestId = match[1];
  const problemIndex = match[2].toUpperCase();

  // Poll CF API — fetch last 10 submissions for this handle
  try {
    const res = await fetch(
      `${CF_API_BASE}/user.status?handle=${encodeURIComponent(user.cfHandle)}&from=1&count=10`,
    );
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json({ status: "pending", message: "Waiting for your submission...", timeRemainingSeconds });
    }

    // Look for a submission to the verification problem made AFTER verification was initiated
    const initiatedTs = Math.floor(user.cfVerification.initiatedAt.getTime() / 1000);
    const found = (data.result as Array<{
      contestId?: number;
      problem: { contestId?: number; index: string };
      creationTimeSeconds: number;
    }>).some((sub) => {
      const subContestId = String(sub.contestId ?? sub.problem.contestId ?? "");
      const subIndex = sub.problem.index.toUpperCase();
      return (
        subContestId === contestId &&
        subIndex === problemIndex &&
        sub.creationTimeSeconds >= initiatedTs
      );
    });

    if (found) {
      // Mark as verified
      user.cfHandleVerified = true;
      user.cfVerification = undefined;
      await user.save();

      return NextResponse.json({
        status: "verified",
        cfHandle: user.cfHandle,
        message: "Handle verified successfully!",
      });
    }
  } catch {
    // CF API down — just return pending
  }

  return NextResponse.json({
    status: "pending",
    message: "Waiting for your submission...",
    timeRemainingSeconds,
  });
}
