"use client";

import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout } from "lucide-react";

const ICON_MAP = { BookOpen, Languages, Sprout };

/**
 * CircularProgress — CSS-only circular ring indicator
 */
function CircularProgress({ percent, colour = "#C9A84C", size = 120 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${colour} ${percent * 3.6}deg, #f3f4f6 ${percent * 3.6}deg)`,
      }}
    >
      <div
        className="flex items-center justify-center rounded-full bg-white"
        style={{ width: size - 16, height: size - 16 }}
      >
        <span className="font-display text-2xl font-bold text-navy">
          {percent}%
        </span>
      </div>
    </div>
  );
}

/**
 * ProgrammeBreakdownGrid — Client Component
 *
 * Renders animated circular-progress cards per programme.
 * Receives plain serializable data from the parent Server Component.
 *
 * @param {{ programmes: Array<{id,title,icon,colour,total_lessons,completedLessons,lastActivity}> }} props
 */
export function ProgrammeBreakdownGrid({ programmes }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {programmes.map((p, i) => {
        const percent =
          p.total_lessons > 0
            ? Math.round((p.completedLessons / p.total_lessons) * 100)
            : 0;
        const Icon = ICON_MAP[p.icon] || BookOpen;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <Icon size={18} className="text-gold" strokeWidth={1.5} />
              <span className="text-sm font-medium text-navy">
                {p.title.replace(" with Ilm Academy", "")}
              </span>
            </div>

            <CircularProgress percent={percent} colour={p.colour || "#C9A84C"} />

            <p className="mt-5 text-sm text-muted">
              {p.completedLessons} / {p.total_lessons} lessons
            </p>
            <p className="mt-1 text-xs text-muted/60">
              Last activity: {p.lastActivity}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * ActivityTable — Client Component
 *
 * Animated table of recently-watched lessons.
 *
 * @param {{ lessons: Array<{id,title,programme,watchedAt,duration}> }} props
 */
export function ActivityTable({ lessons }) {
  if (lessons.length === 0) {
    return (
      <p className="px-6 py-8 text-sm text-muted">
        No activity yet. Complete a lesson to see it here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="px-6 py-3.5 font-medium text-muted">Lesson</th>
            <th className="px-6 py-3.5 font-medium text-muted hidden sm:table-cell">Programme</th>
            <th className="px-6 py-3.5 font-medium text-muted hidden md:table-cell">Date Watched</th>
            <th className="px-6 py-3.5 font-medium text-muted text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson, i) => (
            <motion.tr
              key={lesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border-b border-gray-50 last:border-0 hover:bg-gold/[0.02] transition-colors"
            >
              <td className="px-6 py-4 font-medium text-navy">{lesson.title}</td>
              <td className="px-6 py-4 text-muted hidden sm:table-cell">
                {lesson.programme.replace(" with Ilm Academy", "")}
              </td>
              <td className="px-6 py-4 text-muted hidden md:table-cell">{lesson.watchedAt}</td>
              <td className="px-6 py-4 text-muted text-right">{lesson.duration}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
