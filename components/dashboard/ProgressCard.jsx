"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout, Star } from "lucide-react";

const ICON_MAP = { BookOpen, Languages, Sprout, Star };

/**
 * ProgressCard — Programme progress card
 *
 * Shows programme name, progress bar, lessons completed/total,
 * and optional % display + continue button.
 *
 * Props:
 *   progress — Object from MOCK_PROGRESS
 *   showPercent — Show "X% complete" text
 *   showContinue — Show "Continue Learning →" button
 *   large — Larger variant for programmes page
 *   index — For staggered animation
 */
export default function ProgressCard({
  progress,
  showPercent = false,
  showContinue = false,
  large = false,
  index = 0,
}) {
  const percent = Math.round(
    (progress.completedLessons / progress.totalLessons) * 100
  );
  const Icon = typeof progress.icon === "string"
    ? (ICON_MAP[progress.icon] || BookOpen)
    : (progress.icon || BookOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5 ${
        large ? "p-8" : "p-6"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/8 text-gold">
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-display font-semibold text-navy ${large ? "text-lg" : "text-base"}`}>
            {progress.programme}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {progress.completedLessons} of {progress.totalLessons} lessons completed
          </p>
        </div>
        {showPercent && (
          <span className="shrink-0 text-sm font-medium text-gold">
            {percent}% complete
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
        />
      </div>

      {showContinue && (
        <Link
          href={`/programmes/${progress.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy/60 transition-colors hover:text-gold"
        >
          Continue Learning →
        </Link>
      )}
    </motion.div>
  );
}
