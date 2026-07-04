"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, Sparkles, Mail } from "lucide-react";
import { signInAction, signInWithMagicLinkAction, signInWithGoogleAction } from "@/app/actions/auth";

export default function LoginForm({
  nextPath = "/dashboard",
  authError = false,
  registered = false,
  confirmed = false,
}) {
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    authError ? "We could not complete that sign-in. Please try again." : ""
  );
  const [success, setSuccess] = useState(() => {
    if (registered) return "Account created. Please sign in with your email and password.";
    if (confirmed) return "Email confirmed. Please sign in to continue.";
    return "";
  });
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const formData = new FormData(e.currentTarget);
    formData.set("next", nextPath);
    
    startTransition(async () => {
      if (isMagicLink) {
        const result = await signInWithMagicLinkAction(formData);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess("Magic link sent! Check your email to securely sign in.");
          e.target.reset(); // clear the email input
        }
      } else {
        const result = await signInAction(formData);
        if (result?.error) {
          setError(result.error);
        }
      }
    });
  };

  const handleGoogleSignIn = () => {
    setError("");
    startTransition(async () => {
      const result = await signInWithGoogleAction();
      if (result?.error) {
        setError(result.error);
      }
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

  return (
    <>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-display text-3xl font-semibold text-navy">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to continue your learning journey.
        </p>
      </motion.div>

      {/* ── Status Messages ── */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Google Sign-In ── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="mt-8">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gray-50 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77.01-.54z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>
      </motion.div>

      {/* ── Divider ── */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-6 flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-muted">or continue with email</span>
        <div className="h-px flex-1 bg-gray-200" />
      </motion.div>

      {/* ── Toggle Auth Method ── */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-6 flex gap-2 rounded-full border border-gray-200 p-1"
      >
        <button
          type="button"
          onClick={() => setIsMagicLink(false)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all ${
            !isMagicLink ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setIsMagicLink(true)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all ${
            isMagicLink ? "bg-navy text-white shadow-sm" : "text-muted hover:text-navy"
          }`}
        >
          <Sparkles size={14} />
          Magic Link
        </button>
      </motion.div>

      {/* ── Form ── */}
      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="next" value={nextPath} />
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="email" className="block text-sm font-medium text-navy">
            Email address
          </label>
          <div className="relative mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-sm text-navy outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/20"
              placeholder="you@example.com"
            />
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </motion.div>

        <AnimatePresence>
          {!isMagicLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-navy">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-gold hover:text-gold-light transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required={!isMagicLink}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm text-navy outline-none transition-all duration-200 focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
          <button
            type="submit"
            disabled={isPending}
            className="relative mt-2 w-full rounded-full bg-gold py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {isMagicLink ? "Sending…" : "Signing in…"}
              </span>
            ) : isMagicLink ? (
              "Send Magic Link"
            ) : (
              "Sign In"
            )}
          </button>
        </motion.div>
      </form>

      <motion.p
        custom={7}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-8 text-center text-sm text-muted"
      >
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-gold hover:text-gold-light transition-colors">
          Create one now
        </Link>
      </motion.p>
    </>
  );
}
