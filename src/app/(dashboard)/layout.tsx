import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/lib/auth";
import { connectMongoose } from "@/lib/db";
import UserModel from "@/lib/models/User";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  await connectMongoose();
  const userDoc = await UserModel.findById(session.user.id).lean();
  if (!userDoc) {
    redirect("/api/auth/signin");
  }

  // Serialize user for client component
  const user = JSON.parse(JSON.stringify(userDoc));

  return (
    <div className="app-shell">
      <Sidebar user={user} />

      {/* Main content — styling comes from .main-content in CSS */}
      <main className="main-content">{children}</main>
    </div>
  );
}
