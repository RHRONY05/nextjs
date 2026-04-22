import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import BattleModel from "@/lib/models/Battle";
import UserModel from "@/lib/models/User";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();
  const user = await UserModel.findById(session.user.id);

  if (!user || !user.cfHandle) {
    return NextResponse.json({ error: true, message: "Your CF handle is not connected" }, { status: 400 });
  }

  const { id } = await params;
  const battle = await BattleModel.findById(id);
  if (!battle) {
    return NextResponse.json({ error: true, message: "Battle not found" }, { status: 404 });
  }

  if (battle.opponentHandle.toLowerCase() !== user.cfHandle.toLowerCase()) {
    return NextResponse.json({ error: true, message: "You are not the opponent of this battle" }, { status: 403 });
  }

  if (battle.status !== "pending") {
    return NextResponse.json({ error: true, message: "Battle is not in pending state" }, { status: 400 });
  }

  battle.status = "declined";
  await battle.save();

  return NextResponse.json({ message: "Battle declined", battle });
}
