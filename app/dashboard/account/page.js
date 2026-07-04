"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updatePasswordAction, updateProfileAction } from "@/app/actions/account";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const PLAN_PRICE = { monthly: 15, annual: 12, "Annual Plan": 12 };

// ─── Toast ────────────────────────────────────────────────────────────────────

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

// ─── Cancel Modal ─────────────────────────────────────────────────────────────

function CancelModal({ onClose, onConfirm, renewalDate }) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    await onConfirm();
    setConfirming(false);
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

// ─── Field component ──────────────────────────────────────────────────────────

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (error) =>
  `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
    error
      ? "border-red-300 focus:ring-red-200"
      : "border-gray-200 focus:border-gold focus:ring-gold/20"
  }`;

// ─── Account Page ─────────────────────────────────────────────────────────────

/**
 * Account Settings Page
 *
 * Reads from and writes to the `profiles` table in Supabase.
 * "Cancel Subscription" sets profiles.cancel_at_period_end = true.
 */
export default function AccountPage() {
  const supabase = createClient();

  // ── State ──────────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [pageLoading, setPageLoading] = useState(true);

  const [subscription, setSubscription] = useState({
    plan: "Annual Plan",
    memberSince: "—",
    renewalDate: "—",
    pricePerMonth: 12,
    cancelAtPeriodEnd: false,
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [toast, setToast] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();

  // ── Load profile ───────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted || !user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!mounted) return;

      if (profileData) {
        setProfile({
          name: profileData.full_name || "",
          email: profileData.email || user.email || "",
        });
        setSubscription({
          plan: profileData.plan || "Annual Plan",
          memberSince: formatDate(profileData.member_since || profileData.created_at),
          renewalDate: formatDate(profileData.renews_at),
          pricePerMonth: PLAN_PRICE[profileData.plan] ?? 12,
          cancelAtPeriodEnd: !!profileData.cancel_at_period_end,
        });
      } else {
        setProfile({
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
      }

      setPageLoading(false);
    })();

    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Profile save ───────────────────────────────────────────────────────────
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileErrors({});

    const errs = {};
    if (!profile.name.trim()) errs.name = "Name is required";
    if (!profile.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(profile.email)) errs.email = "Enter a valid email";
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    const fd = new FormData();
    fd.set("name", profile.name);
    fd.set("email", profile.email);

    startProfileTransition(async () => {
      const result = await updateProfileAction(fd);
      if (result?.error) {
        setProfileErrors({ name: result.error });
      } else {
        setToast(result?.success || "Changes saved");
      }
    });
  };

  // ── Password update ────────────────────────────────────────────────────────
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordErrors({});

    const errs = {};
    if (!password.currentPassword) errs.currentPassword = "Current password is required";
    if (!password.newPassword) errs.newPassword = "New password is required";
    else if (password.newPassword.length < 8) errs.newPassword = "Minimum 8 characters";
    if (password.newPassword !== password.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    const fd = new FormData();
    fd.set("currentPassword", password.currentPassword);
    fd.set("newPassword", password.newPassword);
    fd.set("confirmPassword", password.confirmPassword);

    startPasswordTransition(async () => {
      const result = await updatePasswordAction(fd);
      if (result?.error) {
        setPasswordErrors({ currentPassword: result.error });
      } else {
        setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setToast("Password updated");
      }
    });
  };

  // ── Cancel subscription ────────────────────────────────────────────────────
  const handleCancelConfirm = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ cancel_at_period_end: true })
      .eq("id", user.id);

    if (!error) {
      setSubscription((prev) => ({ ...prev, cancelAtPeriodEnd: true }));
      setToast("Cancellation requested. You will retain access until your renewal date.");
    }
    setShowCancel(false);
  }, [supabase]);

  // ── Features list ──────────────────────────────────────────────────────────
  const features = [
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
        {/* ── Left column ── */}
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
              <Field id="acc-name" label="Full Name" error={profileErrors.name}>
                <input
                  id="acc-name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value });
                    if (profileErrors.name) setProfileErrors({ ...profileErrors, name: "" });
                  }}
                  className={inputCls(profileErrors.name)}
                />
              </Field>

              <Field id="acc-email" label="Email" error={profileErrors.email}>
                <input
                  id="acc-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => {
                    setProfile({ ...profile, email: e.target.value });
                    if (profileErrors.email) setProfileErrors({ ...profileErrors, email: "" });
                  }}
                  className={inputCls(profileErrors.email)}
                />
              </Field>

              <button
                type="submit"
                disabled={profilePending}
                className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {profilePending ? (
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

          {/* Change Password */}
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
              <Field id="acc-current-pw" label="Current Password" error={passwordErrors.currentPassword}>
                <input
                  id="acc-current-pw"
                  type="password"
                  value={password.currentPassword}
                  onChange={(e) => {
                    setPassword({ ...password, currentPassword: e.target.value });
                    if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: "" });
                  }}
                  className={inputCls(passwordErrors.currentPassword)}
                />
              </Field>

              <Field id="acc-new-pw" label="New Password" error={passwordErrors.newPassword}>
                <input
                  id="acc-new-pw"
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => {
                    setPassword({ ...password, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: "" });
                  }}
                  className={inputCls(passwordErrors.newPassword)}
                  placeholder="Minimum 8 characters"
                />
              </Field>

              <Field id="acc-confirm-pw" label="Confirm New Password" error={passwordErrors.confirmPassword}>
                <input
                  id="acc-confirm-pw"
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) => {
                    setPassword({ ...password, confirmPassword: e.target.value });
                    if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                  }}
                  className={inputCls(passwordErrors.confirmPassword)}
                />
              </Field>

              <button
                type="submit"
                disabled={passwordPending}
                className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {passwordPending ? (
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

        {/* ── Right column: Subscription ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-fit rounded-2xl border border-gray-100 bg-white p-8"
        >
          <h3 className="font-display text-lg font-semibold text-navy">
            Your Subscription
          </h3>

          <div className="mt-5 inline-flex items-center rounded-full bg-navy px-4 py-1.5 text-xs font-medium text-gold">
            {subscription.plan}
          </div>

          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-navy">
              £{subscription.pricePerMonth}
            </span>
            <span className="text-sm text-muted">/month</span>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <p className="text-muted">
              <span className="font-medium text-navy">Renewal:</span>{" "}
              {subscription.renewalDate}
            </p>
            <p className="text-muted">
              <span className="font-medium text-navy">Member since:</span>{" "}
              {subscription.memberSince}
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-ink/70">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Check size={12} className="text-gold" strokeWidth={2.5} />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {subscription.cancelAtPeriodEnd ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Cancellation requested. Access continues until {subscription.renewalDate}.
            </div>
          ) : (
            <button
              onClick={() => setShowCancel(true)}
              className="mt-8 w-full rounded-full border border-red-200 px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50"
            >
              Cancel Subscription
            </button>
          )}
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onDismiss={() => setToast("")} />}
      </AnimatePresence>

      {/* Cancel modal */}
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
