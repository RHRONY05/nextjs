// DELETE /api/board/clear-synced
// Clears all contest-synced problems from the board

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import KanbanCardModel from "@/lib/models/KanbanCard";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  await connectMongoose();

  try {
    // Delete all cards with source "contest_sync"
    const result = await KanbanCardModel.deleteMany({
      userId: session.user.id,
      source: "contest_sync",
    });

    return NextResponse.json({
      message: `Cleared ${result.deletedCount} contest-synced problems from your board`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear synced problems error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to clear problems", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
