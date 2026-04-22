// GET /api/board - Fetch all kanban cards for user
// POST /api/board/add - Add a problem manually

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import KanbanCardModel from "@/lib/models/KanbanCard";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  await connectMongoose();
  const cards = await KanbanCardModel.find({ userId: session.user.id })
    .sort({ position: 1 })
    .lean();

  // Group by column
  const columns = {
    to_upsolve: cards.filter((c) => c.column === "to_upsolve"),
    trying: cards.filter((c) => c.column === "trying"),
    solved: cards.filter((c) => c.column === "solved"),
  };

  return NextResponse.json({ columns });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { problemUrl, source = "manual" } = body;

  if (!problemUrl) {
    return NextResponse.json(
      { error: true, message: "problemUrl is required", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  // Parse CF problem URL
  // Format: https://codeforces.com/contest/1234/problem/A or /problemset/problem/1234/A
  const match = problemUrl.match(/\/(?:contest|problemset\/problem)\/(\d+)\/([A-Z]\d?)/i);
  if (!match) {
    return NextResponse.json(
      { error: true, message: "Invalid CF problem URL format", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const contestId = parseInt(match[1]);
  const problemIndex = match[2].toUpperCase();

  await connectMongoose();

  // Check if already exists
  const existing = await KanbanCardModel.findOne({
    userId: session.user.id,
    contestId,
    problemIndex,
  });

  if (existing) {
    return NextResponse.json(
      { error: true, message: "Problem already exists on your board", code: "DUPLICATE_ENTRY" },
      { status: 409 },
    );
  }

  // Fetch problem details from CF API
  try {
    const problemsetRes = await fetch("https://codeforces.com/api/problemset.problems");
    const problemsetData = await problemsetRes.json();

    if (problemsetData.status !== "OK") {
      return NextResponse.json(
        { error: true, message: "Failed to fetch problem details", code: "CF_API_UNAVAILABLE" },
        { status: 503 },
      );
    }

    const problem = problemsetData.result.problems.find(
      (p: any) => p.contestId === contestId && p.index === problemIndex
    );

    if (!problem) {
      return NextResponse.json(
        { error: true, message: "Problem not found on Codeforces", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    // Get max position in to_upsolve column
    const maxPos = await KanbanCardModel.findOne({
      userId: session.user.id,
      column: "to_upsolve",
    })
      .sort({ position: -1 })
      .select("position")
      .lean();

    const card = await KanbanCardModel.create({
      userId: session.user.id,
      contestId,
      problemIndex,
      problemName: problem.name,
      problemUrl,
      rating: problem.rating,
      tags: problem.tags || [],
      column: "to_upsolve",
      position: (maxPos?.position || 0) + 1,
      source,
    });

    return NextResponse.json({
      message: "Card added to board",
      card: {
        id: card._id.toString(),
        problemName: card.problemName,
        rating: card.rating,
        column: card.column,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Add card error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to add card", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
