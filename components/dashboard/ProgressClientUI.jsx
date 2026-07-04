"use client";

import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout } from "lucide-react";

const ICON_MAP = { BookOpen, Languages, Sprout };

/**
 * ProgrammeBreakdownGrid — Client Component
 *
 * Renders animated horizontal list rows for programme progress.
 *
 * @param {{ programmes: Array<{id,title,icon,colour,total_lessons,completedLessons,lastActivity}> }} props
 */
export function ProgrammeBreakdownGrid({ programmes }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {programmes.map((p, i) => {
        const percent =
          p.total_lessons > 0
            ? Math.round((p.completedLessons / p.total_lessons) * 100)
            : 0;
        const Icon = ICON_MAP[p.icon] || BookOpen;
        const isCompleted = percent === 100;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gold/30 hover:shadow-sm"
          >
            {/* Left side: Icon and Info */}
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gold">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-navy leading-tight">
                  {p.title.replace(" with Ilm Academy", "")}
                </h3>
                <p className="mt-1 text-xs font-medium text-muted/80">
                  Last activity: {p.lastActivity}
                </p>
              </div>
            </div>

            {/* Right side: Linear Progress Bar */}
            <div className="mt-4 sm:mt-0 flex-1 sm:ml-8 max-w-md w-full">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-muted/70">
                  {p.completedLessons} / {p.total_lessons} lessons completed
                </span>
                <span className={isCompleted ? "text-green-600" : "text-navy"}>{percent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gold'}`}
                />
              </div>
            </div>
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
