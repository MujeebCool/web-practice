import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeNextPath(next) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

async function ensureProfile(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || "",
      date_of_birth: user.user_metadata?.date_of_birth || null,
      gender: user.user_metadata?.gender || null,
    },
    { onConflict: "id" }
  );
}

/**
 * Auth Callback — Handles OAuth redirects (e.g. Google sign-in)
 *
 * Supabase redirects here after successful OAuth authentication.
 * Exchanges the auth code for a session, then redirects to /dashboard.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await ensureProfile(supabase);
      if (next.startsWith("/login")) {
        await supabase.auth.signOut();
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with an error indicator
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
