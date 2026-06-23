"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/**
 * RegisterPage — Account creation form
 *
 * On submit: redirects to /pricing (as per spec).
 * Full inline validation for all fields.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/pricing");
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

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reg-name" className="block text-sm font-medium text-navy">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            value={form.name}
            onChange={handleChange("name")}
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
              errors.name
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-gold focus:ring-gold/20"
            }`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
          <label htmlFor="reg-email" className="block text-sm font-medium text-navy">
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy outline-none transition-all duration-200 focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-gray-200 focus:border-gold focus:ring-gold/20"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
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
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
          <button
            type="submit"
            disabled={loading}
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
        custom={5}
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
