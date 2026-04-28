import BattleList from "@/components/dashboard/BattleList";
import ConnectCfPrompt from "@/components/dashboard/ConnectCfPrompt";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Code Battle - AlgoBoard",
  description: "1v1 Problem Solving Battles",
};

export default async function BattlesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  await connectMongoose();
  const user = await UserModel.findById(session.user.id).lean();

  if (!user?.cfHandleVerified) {
    return <ConnectCfPrompt featureName="Code Battles" />;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "var(--color-on-surface)",
          marginBottom: "0.5rem"
        }}>
          Code Battle ⚔️
        </h1>
        <p style={{
          color: "var(--color-on-surface-variant)",
          fontSize: "1rem"
        }}>
          Challenge your friends to 1v1 problem solving duels
        </p>
      </div>

      <BattleList />
    </div>
  );
}
