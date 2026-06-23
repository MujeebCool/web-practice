"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Award, TrendingUp, Languages, Sprout } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { MOCK_PROGRESS, MOCK_RECENT_LESSONS } from "@/lib/mock-data";

const iconMap = { BookOpen, Languages, Sprout };

/**
 * My Progress Page
 *
 * Sections:
 * 1. Summary stats row (same 4 as dashboard)
 * 2. Circular progress indicators per programme
 * 3. Recent activity log (table/list)
 */

const totalCompleted = MOCK_PROGRESS.reduce((sum, p) => sum + p.completedLessons, 0);
const totalHours = Math.round(totalCompleted * 0.35);

const stats = [
  { label: "Lessons Completed", value: totalCompleted, icon: BookOpen },
  { label: "Hours Learned", value: `${totalHours}h`, icon: Clock },
  { label: "Day Streak", value: 14, icon: TrendingUp },
  { label: "Active Programmes", value: MOCK_PROGRESS.length, icon: Award },
];

/**
 * CircularProgress — CSS-only circular progress indicator
 *
 * Uses conic-gradient for the progress ring.
 * Displays percentage in the centre.
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
      {/* Inner white circle creates the ring effect */}
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

export default function ProgressPage() {
  return (
    <div className="space-y-10">
      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Progress Breakdown Per Programme */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Progress Breakdown
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROGRESS.map((p, i) => {
            const percent = Math.round(
              (p.completedLessons / p.totalLessons) * 100
            );
            const Icon = iconMap[p.icon] || BookOpen;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center transition-all duration-300 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5"
              >
                {/* Programme icon + name */}
                <div className="flex items-center gap-2 mb-6">
                  <Icon size={18} className="text-gold" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-navy">
                    {p.programme.replace(" with Ilm Academy", "")}
                  </span>
                </div>

                {/* Circular progress */}
                <CircularProgress percent={percent} colour={p.colour} />

                {/* Stats below */}
                <p className="mt-5 text-sm text-muted">
                  {p.completedLessons} / {p.totalLessons} lessons
                </p>
                <p className="mt-1 text-xs text-muted/60">
                  Last activity: {p.lastActivity}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Recent Activity
        </h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
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
                {MOCK_RECENT_LESSONS.map((lesson, i) => (
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
        </div>
      </div>
    </div>
  );
}
