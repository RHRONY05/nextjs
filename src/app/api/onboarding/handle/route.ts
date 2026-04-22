// POST /api/onboarding/handle
// Looks up a CF handle via the Codeforces API and checks for conflicts
// PRD: POST /api/onboarding/handle

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";

const CF_API_BASE = "https://codeforces.com/api";

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
      { error: true, message: "cfHandle field missing", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  // Fetch from Codeforces API
  let cfProfile;
  try {
    const res = await fetch(`${CF_API_BASE}/user.info?handles=${encodeURIComponent(cfHandle)}`);
    const data = await res.json();

    if (data.status !== "OK" || !data.result?.[0]) {
      return NextResponse.json(
        { error: true, message: "Handle does not exist on Codeforces", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const u = data.result[0];
    cfProfile = {
      handle: u.handle,
      rating: u.rating ?? 0,
      rank: u.rank ?? "unrated",
      avatar: u.titlePhoto ?? u.avatar ?? "",
    };
  } catch {
    return NextResponse.json(
      { error: true, message: "Codeforces API is currently unavailable", code: "CF_API_UNAVAILABLE" },
      { status: 503 },
    );
  }

  // Check if handle is already claimed by another user
  await connectMongoose();
  const existing = await UserModel.findOne({
    cfHandle: cfProfile.handle,
    cfHandleVerified: true,
    _id: { $ne: session.user.id },
  }).lean();

  if (existing) {
    return NextResponse.json(
      { error: true, message: "Handle already claimed by another AlgoBoard user", code: "DUPLICATE_ENTRY" },
      { status: 409 },
    );
  }

  return NextResponse.json({ exists: true, cfProfile });
}
