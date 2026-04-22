import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use the edge-safe config (no DB imports) so this runs on the Edge runtime.
// Next.js 16 renamed "middleware" to "proxy" — export as `proxy` or default.
const { auth } = NextAuth(authConfig);

// Wrap auth with custom logic
export default auth(async function middleware(req: NextRequest) {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  // Public routes that don't require auth
  const isPublicRoute = pathname === "/" || pathname.startsWith("/api/auth");

  // If not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated, check onboarding status
  if (session?.user?.id && !isPublicRoute && pathname !== "/onboarding") {
    // Fetch user to check onboarding status
    const baseUrl = req.nextUrl.origin;
    try {
      const userRes = await fetch(`${baseUrl}/api/user`, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (userRes.ok) {
        const user = await userRes.json();

        // If onboarding not complete and not on onboarding page
        if (!user.onboardingComplete && pathname !== "/onboarding") {
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }
      }
    } catch (error) {
      console.error("Proxy error:", error);
    }
  }

  // If onboarding complete but on onboarding page, redirect to dashboard
  if (session?.user?.id && pathname === "/onboarding") {
    const baseUrl = req.nextUrl.origin;
    try {
      const userRes = await fetch(`${baseUrl}/api/user`, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      if (userRes.ok) {
        const user = await userRes.json();
        if (user.onboardingComplete) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }
    } catch (error) {
      console.error("Proxy error:", error);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
