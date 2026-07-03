"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

/**
 * RegisterForm — Account creation with Supabase Auth
 *
 * Collects name, email, password, date of birth, and gender.
 * Supports email/password sign-up and Google OAuth.
 * On success, redirects to /pricing.
 */
export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    if (!form.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!form.gender) errs.gender = "Please select a gender";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          date_of_birth: form.dateOfBirth,
          gender: form.gender,
        },
      },
    });

    if (error) {
      setLoading(false);
      setGeneralError(error.message);
    } else {
      router.push("/pricing");
      router.refresh();
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setGeneralError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/pricing`,
      },
    });

    if (error) {
      setGoogleLoading(false);
      setGeneralError(error.message);
    }
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

  const inputClass = (error) =>
    `mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
      error
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-200 focus:border-gold focus:ring-gold/20"
    }`;

  return (
    <>
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
        <h1 className="font-display text-3xl font-semibold text-navy">
          Begin your journey
        </h1>
        <p className="mt-2 text-sm text-muted">
          Create an account to access structured Islamic learning.
        </p>
      </motion.div>

      {generalError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {generalError}
        </motion.div>
      )}

      {/* ── Google Sign-Up ── */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="mt-8">
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gray-50 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
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
        <span className="text-xs font-medium text-muted">or register with email</span>
        <div className="h-px flex-1 bg-gray-200" />
      </motion.div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reg-name" className="block text-sm font-medium text-navy">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className={inputClass(errors.name)}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reg-email" className="block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className={inputClass(errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </motion.div>

        {/* Date of Birth & Gender — side by side */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show">
          <div className="grid grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label htmlFor="reg-dob" className="block text-sm font-medium text-navy">
                Date of birth
              </label>
              <input
                id="reg-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
                max={new Date().toISOString().split("T")[0]}
                className={inputClass(errors.dateOfBirth)}
              />
              {errors.dateOfBirth && (
                <p className="mt-1.5 text-xs text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="reg-gender" className="block text-sm font-medium text-navy">
                Gender
              </label>
              <div className="relative">
                <select
                  id="reg-gender"
                  value={form.gender}
                  onChange={handleChange("gender")}
                  className={`${inputClass(errors.gender)} appearance-none pr-10`}
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 mt-[3px] -translate-y-1/2 text-muted"
                />
              </div>
              {errors.gender && (
                <p className="mt-1.5 text-xs text-red-500">{errors.gender}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reg-password" className="block text-sm font-medium text-navy">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="reg-password"
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
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show">
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="relative w-full rounded-full bg-gold py-3.5 text-sm font-medium text-navy transition-all duration-300 hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Creating account…
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </motion.div>
      </form>

      <motion.p
        custom={8}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-8 text-center text-sm text-muted"
      >
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gold hover:text-gold-light transition-colors">
          Sign in
        </Link>
      </motion.p>
    </>
  );
}
