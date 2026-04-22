import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();
  const user = await UserModel.findOne({ email: session.user.email }).lean();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { targetRank, emailPreferences } = body;

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);
  if (!user) {
    return NextResponse.json(
      { error: true, message: "User not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const updated: Record<string, any> = {};

  if (targetRank) {
    const validRanks = ["specialist", "expert", "candidate_master", "master"];
    if (!validRanks.includes(targetRank)) {
      return NextResponse.json(
        { error: true, message: "Invalid targetRank value", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const rankToRating: Record<string, number> = {
      specialist: 1400,
      expert: 1600,
      candidate_master: 1900,
      master: 2100,
    };
    user.targetRank = targetRank;
    user.targetRating = rankToRating[targetRank];
    updated.targetRank = targetRank;
  }

  if (emailPreferences) {
    if (
      emailPreferences.preferredHour !== undefined &&
      (emailPreferences.preferredHour < 0 || emailPreferences.preferredHour > 23)
    ) {
      return NextResponse.json(
        { error: true, message: "preferredHour out of range (must be 0-23)", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    user.emailPreferences = {
      enabled: emailPreferences.enabled ?? user.emailPreferences.enabled,
      frequency: emailPreferences.frequency ?? user.emailPreferences.frequency,
      preferredHour: emailPreferences.preferredHour ?? user.emailPreferences.preferredHour,
      timezone: emailPreferences.timezone ?? user.emailPreferences.timezone,
    };
    updated.emailPreferences = user.emailPreferences;
  }

  await user.save();

  return NextResponse.json({ message: "Profile updated successfully", updated });
}
