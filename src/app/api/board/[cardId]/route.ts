// DELETE /api/board/:cardId - Delete a card

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import KanbanCardModel from "@/lib/models/KanbanCard";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ cardId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { cardId } = await context.params;

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

  await card.deleteOne();

  return NextResponse.json({ message: "Card deleted successfully" });
}
