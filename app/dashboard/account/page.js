"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Toast — Simple auto-dismissing notification
 */
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3 shadow-lg"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
        <Check size={14} className="text-white" />
      </div>
      <p className="text-sm font-medium text-green-800">{message}</p>
    </motion.div>
  );
}

/**
 * CancelModal — Subscription cancellation confirmation
 */
function CancelModal({ onClose, onConfirm, renewalDate }) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1000));
    onConfirm();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-navy">
          Are you sure you want to cancel?
        </h3>
        <p className="mt-2 text-sm text-muted">
          Your access continues until {renewalDate}.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-navy transition-all hover:bg-gray-50"
          >
            Keep Subscription
          </button>
          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="flex-1 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-all hover:bg-red-100 disabled:opacity-70"
          >
            {confirming ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                Cancelling…
              </span>
            ) : (
              "Yes, Cancel"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Account Settings Page
 *
 * Two-column layout:
 * - Left: Profile settings (personal info + password)
 * - Right: Subscription card with cancel flow
 *
 * Loads user data from Supabase profiles table.
 */
export default function AccountPage() {
  const supabase = createClient();

  // Profile form state
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Subscription data
  const [subscription, setSubscription] = useState({
    plan: "free",
    memberSince: "",
    renewalDate: "",
    pricePerMonth: 0,
  });

  // Password form state
  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState("");

  // Cancel modal
  const [showCancel, setShowCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile({
            name: profileData.full_name || "",
            email: profileData.email || user.email || "",
          });
          setSubscription({
            plan: profileData.plan || "free",
            memberSince: new Date(profileData.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            renewalDate: profileData.plan !== "free"
              ? new Date(
                  new Date(profileData.created_at).setFullYear(
                    new Date(profileData.created_at).getFullYear() + 1
                  )
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—",
            pricePerMonth: profileData.plan === "annual" ? 12 : profileData.plan === "monthly" ? 15 : 0,
          });
        } else {
          // Fallback to auth metadata if profile doesn't exist yet
          setProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
            email: user.email || "",
          });
        }
      }
      setPageLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  // Profile validation
  const validateProfile = () => {
    const errs = {};
    if (!profile.name.trim()) errs.name = "Name is required";
    if (!profile.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errs.email = "Enter a valid email";
    return errs;
  };

  // Password validation
  const validatePassword = () => {
    const errs = {};
    if (!password.current) errs.current = "Current password is required";
    if (!password.newPassword) errs.newPassword = "New password is required";
    else if (password.newPassword.length < 8) errs.newPassword = "Minimum 8 characters";
    if (!password.confirm) errs.confirm = "Please confirm your password";
    else if (password.newPassword !== password.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setProfileLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.name,
          email: profile.email,
        })
        .eq("id", user.id);

      if (error) {
        setProfileErrors({ name: error.message });
      } else {
        setToast("Changes saved");
      }
    }

    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePassword();
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setPasswordLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password.newPassword,
    });

    if (error) {
      setPasswordErrors({ current: error.message });
    } else {
      setPassword({ current: "", newPassword: "", confirm: "" });
      setToast("Password updated");
    }

    setPasswordLoading(false);
  };

  const handleCancelConfirm = () => {
    setShowCancel(false);
    setCancelled(true);
    setToast("Cancellation requested. You will retain access until your renewal date.");
  };

  const inputClass = (error) =>
    `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
      error
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-200 focus:border-gold focus:ring-gold/20"
    }`;

  const subscriptionFeatures = [
    "Full access to all programmes",
    "1,000+ video lessons",
    "Monthly live Q&A sessions",
    "iOS and Android app access",
  ];

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        {/* ── Left Column: Profile Settings ── */}
        <div className="space-y-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-gray-100 bg-white p-8"
          >
            <h3 className="font-display text-lg font-semibold text-navy">
              Personal Information
            </h3>

            <form className="mt-6 space-y-5" onSubmit={handleProfileSubmit} noValidate>
              <div>
                <label htmlFor="acc-name" className="block text-sm font-medium text-navy">
                  Full Name
                </label>
                <input
                  id="acc-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value });
                    if (profileErrors.name) setProfileErrors({ ...profileErrors, name: "" });
                  }}
                  className={inputClass(profileErrors.name)}
                />
                {profileErrors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{profileErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="acc-email" className="block text-sm font-medium text-navy">
                  Email
                </label>
                <input
                  id="acc-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => {
                    setProfile({ ...profile, email: e.target.value });
                    if (profileErrors.email) setProfileErrors({ ...profileErrors, email: "" });
                  }}
                  className={inputClass(profileErrors.email)}
                />
                {profileErrors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{profileErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {profileLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </motion.div>

          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 bg-white p-8"
          >
            <h3 className="font-display text-lg font-semibold text-navy">
              Change Password
            </h3>

            <form className="mt-6 space-y-5" onSubmit={handlePasswordSubmit} noValidate>
              <div>
                <label htmlFor="acc-current-pw" className="block text-sm font-medium text-navy">
                  Current Password
                </label>
                <input
                  id="acc-current-pw"
                  type="password"
                  value={password.current}
                  onChange={(e) => {
                    setPassword({ ...password, current: e.target.value });
                    if (passwordErrors.current) setPasswordErrors({ ...passwordErrors, current: "" });
                  }}
                  className={inputClass(passwordErrors.current)}
                />
                {passwordErrors.current && (
                  <p className="mt-1.5 text-xs text-red-500">{passwordErrors.current}</p>
                )}
              </div>

              <div>
                <label htmlFor="acc-new-pw" className="block text-sm font-medium text-navy">
                  New Password
                </label>
                <input
                  id="acc-new-pw"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => {
                    setPassword({ ...password, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: "" });
                  }}
                  className={inputClass(passwordErrors.newPassword)}
                  placeholder="Minimum 8 characters"
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="acc-confirm-pw" className="block text-sm font-medium text-navy">
                  Confirm New Password
                </label>
                <input
                  id="acc-confirm-pw"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => {
                    setPassword({ ...password, confirm: e.target.value });
                    if (passwordErrors.confirm) setPasswordErrors({ ...passwordErrors, confirm: "" });
                  }}
                  className={inputClass(passwordErrors.confirm)}
                />
                {passwordErrors.confirm && (
                  <p className="mt-1.5 text-xs text-red-500">{passwordErrors.confirm}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Updating…
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── Right Column: Subscription ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-fit rounded-2xl border border-gray-100 bg-white p-8"
        >
          <h3 className="font-display text-lg font-semibold text-navy">
            Your Subscription
          </h3>

          {/* Plan badge */}
          <div className="mt-5 inline-flex items-center rounded-full bg-navy px-4 py-1.5 text-xs font-medium text-gold">
            {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
          </div>

          {/* Price */}
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-navy">
              £{subscription.pricePerMonth}
            </span>
            <span className="text-sm text-muted">/month</span>
          </div>

          {/* Dates */}
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-muted">
              <span className="text-navy font-medium">Renewal:</span>{" "}
              {subscription.renewalDate}
            </p>
            <p className="text-muted">
              <span className="text-navy font-medium">Member since:</span>{" "}
              {subscription.memberSince}
            </p>
          </div>

          {/* Features */}
          <ul className="mt-6 space-y-3">
            {subscriptionFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-ink/70">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Check size={12} className="text-gold" strokeWidth={2.5} />
                </div>
                {feature}
              </li>
            ))}
          </ul>

          {/* Cancel button */}
          {!cancelled ? (
            <button
              onClick={() => setShowCancel(true)}
              className="mt-8 w-full rounded-full border border-red-200 px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
            >
              Cancel Subscription
            </button>
          ) : (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Cancellation requested. Access continues until {subscription.renewalDate}.
            </div>
          )}
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
      </AnimatePresence>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancel && (
          <CancelModal
            onClose={() => setShowCancel(false)}
            onConfirm={handleCancelConfirm}
            renewalDate={subscription.renewalDate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
