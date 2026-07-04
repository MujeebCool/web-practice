"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { requestPasswordResetAction } from "@/app/actions/auth";

/**
 * ForgotPasswordPage — Email-based password reset request
 *
 * Shows a success message after "sending" the reset email.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await requestPasswordResetAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setSent(true);
    });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: i * 0.08 },
    }),
  };

  if (sent) {
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
          Check your email
        </h1>
        <p className="mt-3 text-sm text-muted">
          We&apos;ve sent a password reset link to <strong className="text-navy">{email}</strong>.
          Check your inbox and follow the instructions.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-light transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>

        <h1 className="font-display text-3xl font-semibold text-navy">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </motion.div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="forgot-email" className="block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
              error
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-gold focus:ring-gold/20"
            }`}
            placeholder="you@example.com"
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </motion.div>

        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <button
            type="submit"
            disabled={isPending}
            className="relative w-full rounded-full bg-gold py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </motion.div>
      </form>
    </>
  );
}
