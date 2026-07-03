import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Middleware Supabase client
 *
 * Creates a Supabase client that can refresh auth tokens on every request.
 * Returns both the client and a modified response with updated cookies.
 *
 * If env vars are not configured, falls back to pass-through mode.
 */
export function createClient(request) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-project-url-here") {
    return {
      supabase: {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
        },
      },
      supabaseResponse,
    };
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  return { supabase, supabaseResponse };
}
