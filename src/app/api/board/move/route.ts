// PATCH /api/board/move - Move a card to different column

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import KanbanCardModel from "@/lib/models/KanbanCard";
import UserModel from "@/lib/models/User";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { cardId, newColumn, newPosition = 0 } = body;

  if (!cardId || !newColumn) {
    return NextResponse.json(
      { error: true, message: "cardId and newColumn are required", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  const validColumns = ["to_upsolve", "trying", "solved"];
  if (!validColumns.includes(newColumn)) {
    return NextResponse.json(
      { error: true, message: "Invalid column value", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  await connectMongoose();

  const card = await KanbanCardModel.findById(cardId);
  if (!card) {
    return NextResponse.json(
      { error: true, message: "Card not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  if (card.userId.toString() !== session.user.id) {
    return NextResponse.json(
      { error: true, message: "Card does not belong to this user", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const oldColumn = card.column;
  card.column = newColumn;
  card.position = newPosition;

  // If moved to solved, record timestamp and award XP
  let xpAwarded = 0;
  let newTotalXp = 0;
  let newLevel = "";

  if (newColumn === "solved" && oldColumn !== "solved") {
    card.solvedAt = new Date();

    // Award XP based on problem rating
    xpAwarded = card.rating || 800;

    const user = await UserModel.findById(session.user.id);
    if (user) {
      user.gamification.xp += xpAwarded;
      newTotalXp = user.gamification.xp;

      // Simple level calculation
      if (newTotalXp < 5000) newLevel = "Newcomer";
      else if (newTotalXp < 35000) newLevel = "Problem Solver";
      else if (newTotalXp < 80000) newLevel = "Algorithm Adept";
      else if (newTotalXp < 150000) newLevel = "Code Warrior";
      else if (newTotalXp < 250000) newLevel = "Grandmaster";
      else newLevel = "CF Warrior";

      user.gamification.level = newLevel;
      await user.save();
    }
  }

  await card.save();

  const response: any = {
    message: newColumn === "solved" ? "Card moved to Solved" : "Card moved successfully",
    card: {
      id: card._id.toString(),
      column: card.column,
      position: card.position,
      solvedAt: card.solvedAt,
    },
  };

  if (newColumn === "solved" && oldColumn !== "solved") {
    response.xpAwarded = xpAwarded;
    response.newTotalXp = newTotalXp;
    response.newLevel = newLevel;
    response.badgesEarned = []; // TODO: Implement badge system
  }

  return NextResponse.json(response);
}
