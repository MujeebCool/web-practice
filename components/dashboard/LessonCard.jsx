"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

/**
 * LessonCard — Recently watched lesson card
 *
 * Horizontal layout with thumbnail placeholder (navy box),
 * lesson title, programme name, and duration.
 */
export default function LessonCard({ lesson, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-gold/20 hover:shadow-md hover:shadow-gold/5"
    >
      {/* Thumbnail placeholder */}
      <div className="relative flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-navy overflow-hidden">
        <Play
          size={18}
          className="text-gold/60 transition-transform duration-300 group-hover:scale-110"
          fill="currentColor"
        />
        {/* Duration badge */}
        <span className="absolute bottom-1 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {lesson.duration}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-navy truncate group-hover:text-gold transition-colors">
          {lesson.title}
        </h4>
        <p className="mt-1 text-xs text-muted truncate">{lesson.programme}</p>
      </div>
    </motion.div>
  );
}
