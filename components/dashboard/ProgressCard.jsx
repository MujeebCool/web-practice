"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout, Star } from "lucide-react";

const ICON_MAP = { BookOpen, Languages, Sprout, Star };

/**
 * ProgressCard — Programme progress card (HackerRank-style horizontal layout)
 *
 * Shows programme name, progress bar, lessons completed/total,
 * and a clear CTA button on the right.
 *
 * Props:
 *   progress — Object with {id, programme, slug, icon, totalLessons, completedLessons}
 *   showPercent — (Unused in this layout, kept for compatibility)
 *   showContinue — Show CTA button (default true)
 *   large — Large variant (adds padding, mostly unused now as all are rows)
 *   index — For staggered animation
 */
export default function ProgressCard({
  progress,
  showPercent = false,
  showContinue = true,
  large = false,
  index = 0,
}) {
  const percent = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;
    
  const Icon = typeof progress.icon === "string"
    ? (ICON_MAP[progress.icon] || BookOpen)
    : (progress.icon || BookOpen);

  const isCompleted = percent === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gold/30 hover:shadow-sm"
    >
      {/* Left side: Icon and Info */}
      <div className="flex items-center gap-4 min-w-[240px]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-navy leading-tight group-hover:text-gold transition-colors">
            {progress.programme}
          </h3>
          <p className="mt-1 text-xs font-medium text-muted/80">
            {progress.completedLessons} of {progress.totalLessons} lessons completed
          </p>
        </div>
      </div>

      {/* Middle: Progress Bar */}
      <div className="mt-4 sm:mt-0 flex-1 sm:px-8 max-w-md w-full">
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          <span className="text-muted/70">Progress</span>
          <span className={isCompleted ? "text-green-600" : "text-navy"}>{percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gold'}`}
          />
        </div>
      </div>

      {/* Right side: Button CTA */}
      {showContinue && (
        <div className="mt-5 sm:mt-0 shrink-0">
          <Link
            href={`/programmes/${progress.slug}`}
            className={`inline-flex items-center justify-center rounded px-5 py-2 text-sm font-semibold transition-colors ${
              isCompleted 
                ? "bg-gray-100 text-navy hover:bg-gray-200" 
                : "bg-gold text-white hover:bg-gold-light"
            }`}
          >
            {isCompleted ? "Review Programme" : "Continue Preparation"}
          </Link>
        </div>
      )}
    </motion.div>
  );
}
