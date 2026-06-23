"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Auth Layout — Minimal split-screen layout
 *
 * Left side: Brand visual with Islamic pattern + brand messaging
 * Right side: Clean form area
 * Hides navbar and footer for distraction-free auth experience.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel: Brand Visual ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-navy lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Islamic geometric pattern */}
        <div className="islamic-pattern absolute inset-0 opacity-[0.04]" />

        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(26,35,64,0.3)_0%,_rgba(10,15,28,0.95)_70%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-md px-12 text-center">
          {/* Decorative Arabic */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="font-arabic text-6xl text-gold leading-none select-none mb-10"
            aria-hidden="true"
          >
            بِسْمِ ٱللَّٰهِ
          </motion.p>

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-3xl font-semibold text-white">
              Ilm
            </span>
            <span className="font-display text-3xl font-semibold text-gold">
              Academy
            </span>
          </Link>

          <p className="mt-6 text-sm leading-relaxed text-white/40">
            Structured programmes in Islamic sciences, Arabic, and personal
            growth — for serious students worldwide.
          </p>

          {/* Decorative divider */}
          <div className="mx-auto mt-8 h-px w-16 bg-gold/20" />

          <p className="mt-8 font-display text-lg text-white/60 italic">
            &ldquo;Seek knowledge from the cradle to the grave.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Right Panel: Form Area ── */}
      <div className="flex w-full flex-col justify-center bg-ivory px-6 py-12 lg:w-1/2 lg:px-16">
        {/* Mobile logo (hidden on desktop since left panel shows it) */}
        <div className="mb-10 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-navy">
              Ilm
            </span>
            <span className="font-display text-2xl font-semibold text-gold">
              Academy
            </span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
