"use client";

import { motion } from "framer-motion";

/**
 * PageHero — Reusable page hero for inner pages
 * Updated to navy/gold palette with animations
 */
export default function PageHero({ eyebrow, title, description, dark = true }) {
  return (
    <section
      className={`relative overflow-hidden pt-32 pb-20 ${
        dark ? "bg-navy text-white" : "bg-ivory"
      }`}
    >
      {/* Subtle pattern overlay */}
      <div
        className={`absolute inset-0 ${
          dark ? "islamic-pattern opacity-[0.03]" : "islamic-pattern-light"
        }`}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium uppercase tracking-[0.3em] text-gold/70"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`mt-5 font-display font-semibold ${
            dark ? "text-white" : "text-navy"
          }`}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`mx-auto mt-5 max-w-2xl text-lg leading-relaxed ${
              dark ? "text-white/50" : "text-muted"
            }`}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
