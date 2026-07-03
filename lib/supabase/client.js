import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client
 *
 * Used in Client Components ("use client") for auth operations,
 * real-time subscriptions, and data fetching from the browser.
 *
 * Returns null during build when env vars are not configured.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === "your-project-url-here") {
    // Return a no-op stub so pages can prerender without crashing.
    // Real auth won't work until valid credentials are provided.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ error: { message: "Supabase not configured. Add credentials to .env.local" } }),
        signInWithOAuth: async () => ({ error: { message: "Supabase not configured. Add credentials to .env.local" } }),
        signUp: async () => ({ error: { message: "Supabase not configured. Add credentials to .env.local" } }),
        signOut: async () => ({ error: null }),
        updateUser: async () => ({ error: { message: "Supabase not configured. Add credentials to .env.local" } }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: { message: "Supabase not configured" } }) }),
      }),
    };
  }

  return createBrowserClient(url, key);
}
