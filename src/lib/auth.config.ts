import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Edge-safe config — no DB imports, no adapter.
// Used by middleware.ts to run auth checks on the Edge runtime.
export const authConfig: NextAuthConfig = {
  providers: [Google],
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const protectedPaths = [
        "/dashboard",
        "/board",
        "/topics",
        "/badges",
        "/settings",
        "/leaderboard",
        "/compare",
      ];
      const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
      if (isProtected) return !!auth?.user;
      return true;
    },
  },
};