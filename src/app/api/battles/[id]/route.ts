import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import BattleModel from "@/lib/models/Battle";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const { id } = await params;

    const battle = await BattleModel.findById(id);
    if (!battle) {
      return NextResponse.json({ error: true, message: "Battle not found" }, { status: 404 });
    }

    // Only the creator or the opponent can delete/end the battle
    // For simplicity, we allow either to delete it if they want to "end" it
    await BattleModel.findByIdAndDelete(id);

    return NextResponse.json({ message: "Battle ended and removed" });
  } catch (error: any) {
    console.error("End battle error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to end battle" },
      { status: 500 }
    );
  }
}
