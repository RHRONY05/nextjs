import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-safe config (no DB imports) so this runs on the Edge runtime.
// Next.js 16 renamed "middleware" to "proxy" — export as `proxy` or default.
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/board/:path*",
    "/topics/:path*",
    "/badges/:path*",
    "/settings/:path*",
    "/leaderboard/:path*",
    "/compare/:path*",
  ],
};
