"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

/**
 * ResetPasswordPage — Set a new password
 *
 * Shows success message after "resetting" the password.
 */
export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (!form.confirm) errs.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.08 },
    }),
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle className="h-8 w-8 text-gold" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-navy">
          Password updated
        </h1>
        <p className="mt-3 text-sm text-muted">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium text-navy transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
        >
          Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-display text-3xl font-semibold text-navy">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-muted">
          Choose a strong password for your account.
        </p>
      </motion.div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reset-password" className="block text-sm font-medium text-navy">
            New password
          </label>
          <div className="relative mt-1.5">
            <input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
                errors.password
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-200 focus:border-gold focus:ring-gold/20"
              }`}
              placeholder="Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reset-confirm" className="block text-sm font-medium text-navy">
            Confirm password
          </label>
          <input
            id="reset-confirm"
            type={showPassword ? "text" : "password"}
            value={form.confirm}
            onChange={handleChange("confirm")}
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
              errors.confirm
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-gold focus:ring-gold/20"
            }`}
            placeholder="Re-enter your password"
          />
          {errors.confirm && (
            <p className="mt-1.5 text-xs text-red-500">{errors.confirm}</p>
          )}
        </motion.div>

        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <button
            type="submit"
            disabled={loading}
            className="relative w-full rounded-full bg-gold py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating…
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </motion.div>
      </form>
    </>
  );
}
