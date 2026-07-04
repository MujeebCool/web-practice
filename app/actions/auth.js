"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const GENDERS = new Set(["male", "female", "other", "prefer_not_to_say"]);

const getSiteUrl = () => {
  const headersList = headers();
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").trim();
}

function isValidNextPath(next) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//");
}

async function ensureProfile(supabase, user, profile = {}) {
  if (!user?.id) return;

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: profile.fullName ?? user.user_metadata?.full_name ?? "",
      date_of_birth: profile.dateOfBirth ?? user.user_metadata?.date_of_birth ?? null,
      gender: profile.gender ?? user.user_metadata?.gender ?? null,
    },
    { onConflict: "id" }
  );
}

/**
 * Email/Password Sign Up
 *
 * @returns {Promise<{ error?: string, success?: string } | void>} Redirects when a session is created
 */
export async function signUpAction(formData) {
  const supabase = createClient();
  
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");
  const name = normalizeText(formData.get("name"));
  const dateOfBirth = normalizeText(formData.get("dateOfBirth"));
  const gender = normalizeText(formData.get("gender"));

  if (!email || !password || !name || !dateOfBirth || !gender) {
    return { error: "All fields are required" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address" };
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (!GENDERS.has(gender)) {
    return { error: "Select a valid gender option" };
  }

  const date = new Date(`${dateOfBirth}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date > new Date()) {
    return { error: "Enter a valid date of birth" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        date_of_birth: dateOfBirth,
        gender,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/login?confirmed=1`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user && data?.session) {
    await ensureProfile(supabase, data.user, {
      fullName: name,
      dateOfBirth,
      gender,
    });
  }

  if (!data?.session) {
    return { success: "Account created. Please check your email to confirm your account before signing in." };
  }

  await supabase.auth.signOut();
  redirect("/login?registered=1");
}

/**
 * Email/Password Sign In
 *
 * @param {FormData} formData
 * @returns {Promise<{ error: string } | void>} Redirects on success
 */
export async function signInAction(formData) {
  const supabase = createClient();
  
  const email = normalizeEmail(formData.get("email"));
  const password = String(formData.get("password") || "");
  const next = normalizeText(formData.get("next"));

  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  await ensureProfile(supabase, data?.user);

  redirect(isValidNextPath(next) ? next : "/dashboard");
}

/**
 * Magic Link Sign In (Passwordless)
 *
 * @param {FormData} formData
 * @returns {Promise<{ success?: boolean, error?: string }>}
 */
export async function signInWithMagicLinkAction(formData) {
  const supabase = createClient();
  const email = normalizeEmail(formData.get("email"));
  const next = normalizeText(formData.get("next"));

  if (!email) {
    return { error: "Email is required" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address" };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(
        isValidNextPath(next) ? next : "/dashboard"
      )}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Google OAuth Sign In
 *
 * @returns {Promise<{ error?: string } | void>} Redirects to OAuth URL
 */
export async function signInWithGoogleAction() {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }
  
  return { error: "Failed to initiate Google sign-in" };
}

/**
 * Password reset request
 */
export async function requestPasswordResetAction(formData) {
  const supabase = createClient();
  const email = normalizeEmail(formData.get("email"));

  if (!email) {
    return { error: "Email is required" };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Update password for a user with an active password recovery session.
 */
export async function resetPasswordAction(formData) {
  const supabase = createClient();
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (password !== confirm) {
    return { error: "Passwords do not match" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your reset link is invalid or expired. Please request a new password reset link." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Sign Out
 *
 * @returns {Promise<void>} Redirects to home page
 */
export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
