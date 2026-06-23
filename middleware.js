import { NextResponse } from "next/server";

/**
 * Middleware — Protects /dashboard/* routes
 *
 * If no "ilm_token" cookie exists, redirects to /login.
 * All other routes pass through unmodified.
 */
export function middleware(request) {
  const token = request.cookies.get("ilm_token");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
