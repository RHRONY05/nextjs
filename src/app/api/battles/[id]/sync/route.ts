import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import BattleModel from "@/lib/models/Battle";
import UserModel from "@/lib/models/User";

const CF_API_BASE = "https://codeforces.com/api";

async function fetchFirstSolveTime(handle: string, contestId: number, index: string, startTime: Date): Promise<Date | null> {
  // We fetch a small number of submissions since the battle started recently
  const res = await fetch(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=50`);
  const data = await res.json();
  
  if (data.status !== "OK") {
    console.error(`Failed to fetch submissions for ${handle}`);
    return null;
  }

  // Look for the first accepted submission for this problem after startTime
  // Submissions are ordered newest to oldest, so we iterate and find the oldest one that is after startTime
  let solveTime: Date | null = null;
  for (const sub of data.result) {
    const subTime = new Date(sub.creationTimeSeconds * 1000);
    // Ignore submissions before battle start
    if (subTime < startTime) continue;

    if (sub.verdict === "OK" && sub.problem.contestId === contestId && sub.problem.index === index) {
      if (!solveTime || subTime < solveTime) {
        solveTime = subTime;
      }
    }
  }
  return solveTime;
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: true, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectMongoose();
  const user = await UserModel.findById(session.user.id);
  if (!user || !user.cfHandle) {
    return NextResponse.json({ error: true, message: "Your CF handle is not connected" }, { status: 400 });
  }

  const battle = await BattleModel.findById(id);

  if (!battle) {
    return NextResponse.json({ error: true, message: "Battle not found" }, { status: 404 });
  }

  // Ensure it's the user's battle (either creator or opponent)
  if (battle.userId.toString() !== session.user.id && battle.opponentHandle.toLowerCase() !== user.cfHandle.toLowerCase()) {
    return NextResponse.json({ error: true, message: "Forbidden" }, { status: 403 });
  }

  // If already completed, just return it
  if (battle.status === "completed") {
    return NextResponse.json({ battle, message: "Battle is already completed" });
  }

  const now = new Date();
  
  try {
    const [userSolveTime, oppSolveTime] = await Promise.all([
      fetchFirstSolveTime(battle.userHandle, battle.problem.contestId, battle.problem.index, battle.startTime!),
      fetchFirstSolveTime(battle.opponentHandle, battle.problem.contestId, battle.problem.index, battle.startTime!),
    ]);

    let changed = false;

    if (userSolveTime) {
      battle.userSolveTime = userSolveTime;
      changed = true;
    }
    if (oppSolveTime) {
      battle.opponentSolveTime = oppSolveTime;
      changed = true;
    }

    // Determine winner if anyone solved
    if (battle.userSolveTime || battle.opponentSolveTime) {
      battle.status = "completed";
      changed = true;
      
      if (battle.userSolveTime && battle.opponentSolveTime) {
        if (battle.userSolveTime < battle.opponentSolveTime) {
          battle.winner = "user";
        } else if (battle.opponentSolveTime < battle.userSolveTime) {
          battle.winner = "opponent";
        } else {
          battle.winner = "draw"; // Exactly same second
        }
      } else if (battle.userSolveTime) {
        battle.winner = "user";
      } else {
        battle.winner = "opponent";
      }
      changed = true;
    }

    // Check if time expired
    if (battle.status === "active" && battle.endTime && now > battle.endTime) {
      battle.status = "completed";
      battle.winner = "draw";
      changed = true;
    }

    if (changed) {
      await battle.save();
    }

    return NextResponse.json({ battle, message: "Synced successfully" });
  } catch (error: any) {
    console.error("Battle sync error:", error);
    return NextResponse.json({ error: true, message: "Failed to sync battle status" }, { status: 500 });
  }
}
