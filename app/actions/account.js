"use server";

import { createClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").trim();
}

async function requireUser(supabase) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "You must be signed in to update your account." };
  }

  return { user };
}

export async function updateProfileAction(formData) {
  const supabase = createClient();
  const { user, error: userError } = await requireUser(supabase);

  if (userError) {
    return { error: userError };
  }

  const fullName = normalizeText(formData.get("name"));
  const email = normalizeEmail(formData.get("email"));

  if (!fullName) {
    return { error: "Name is required" };
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address" };
  }

  if (email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      return { error: error.message };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email,
        full_name: fullName,
      },
      { onConflict: "id" }
    );

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      email !== user.email
        ? "Profile saved. Please confirm the new email address from your inbox."
        : "Changes saved",
  };
}

export async function updatePasswordAction(formData) {
  const supabase = createClient();
  const { user, error: userError } = await requireUser(supabase);

  if (userError) {
    return { error: userError };
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirm = String(formData.get("confirmPassword") || "");

  if (!currentPassword) {
    return { error: "Current password is required" };
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return { error: `New password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }
  if (newPassword !== confirm) {
    return { error: "Passwords do not match" };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect" };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated" };
}
