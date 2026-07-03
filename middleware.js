import { createClient } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware — Protects /dashboard/* routes with Supabase Auth
 *
 * On every request:
 * 1. Refreshes auth tokens (via Supabase middleware client)
 * 2. If accessing /dashboard/* without a valid session → redirect to /login
 * 3. All other routes pass through
 */
export async function middleware(request) {
  const { supabase, supabaseResponse } = createClient(request);

  // Refresh session — IMPORTANT: do not remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
