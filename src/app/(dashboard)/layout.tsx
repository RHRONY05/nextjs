import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />

      {/* Main content — styling comes from .main-content in CSS */}
      <main className="main-content">{children}</main>
    </div>
  );
}
