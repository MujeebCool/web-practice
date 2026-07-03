import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client
 *
 * Used in Server Components, Server Actions, and Route Handlers.
 * Reads/writes auth cookies via Next.js cookies() API.
 *
 * Returns a no-op stub during build when env vars are not configured.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-project-url-here") {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        exchangeCodeForSession: async () => ({ error: { message: "Supabase not configured" } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      }),
    };
  }

  const cookieStore = cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll is called from a Server Component where cookies
          // cannot be set — this is expected and can be ignored.
        }
      },
    },
  });
}
