import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { createClient } from "@/lib/supabase/server";

const iconMap = { BookOpen, Languages, Sprout };

/**
 * CircularProgress — CSS-only circular progress indicator (unchanged UI)
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
 * My Progress Page — Server Component
 *
 * Fetches real data from Supabase:
 * - Per-programme completion % via user_progress
 * - Recent activity log (lessons watched)
 * - Aggregate stats for StatCards
 */
export default async function ProgressPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Programmes catalogue ─────────────────────────────────────────────────
  const { data: programmes = [] } = await supabase
    .from("programmes")
    .select("id, slug, title, icon, colour, total_lessons")
    .in("slug", ["ilm", "arabic", "grow"])
    .order("created_at", { ascending: true });

  // ── User progress ────────────────────────────────────────────────────────
  const { data: userProgress = [] } = user
    ? await supabase
        .from("user_progress")
        .select(
          "lesson_id, completed, last_watched_at, lessons(programme_id, duration_seconds)"
        )
        .eq("user_id", user.id)
    : { data: [] };

  // Aggregate completions & last activity per programme
  const completionsByProgramme = {};
  const lastActivityByProgramme = {};

  for (const row of userProgress) {
    const pid = row.lessons?.programme_id;
    if (!pid) continue;

    if (!completionsByProgramme[pid]) completionsByProgramme[pid] = 0;
    if (row.completed) completionsByProgramme[pid]++;

    if (!lastActivityByProgramme[pid] || row.last_watched_at > lastActivityByProgramme[pid]) {
      lastActivityByProgramme[pid] = row.last_watched_at;
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCompleted = userProgress.filter((r) => r.completed).length;
  const totalSeconds = userProgress.reduce(
    (sum, r) => sum + (r.completed ? (r.lessons?.duration_seconds || 0) : 0),
    0
  );
  const totalHours = Math.round(totalSeconds / 3600) || 0;

  const stats = [
    { label: "Lessons Completed", value: totalCompleted, icon: "BookOpen" },
    { label: "Hours Learned", value: `${totalHours}h`, icon: "Clock" },
    { label: "Day Streak", value: 0, icon: "TrendingUp" },
    { label: "Active Programmes", value: programmes.length, icon: "Award" },
  ];

  // ── Recent Activity ───────────────────────────────────────────────────────
  const { data: recentRaw = [] } = user
    ? await supabase
        .from("user_progress")
        .select(
          "last_watched_at, lessons(title, duration_seconds, programme_id, programmes(title, slug))"
        )
        .eq("user_id", user.id)
        .order("last_watched_at", { ascending: false })
        .limit(10)
    : { data: [] };

  const recentLessons = recentRaw
    .filter((r) => r.lessons)
    .map((r, i) => ({
      id: i,
      title: r.lessons.title,
      programme: r.lessons.programmes?.title || "—",
      watchedAt: new Date(r.last_watched_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      duration: r.lessons.duration_seconds
        ? `${Math.round(r.lessons.duration_seconds / 60)} min`
        : "—",
    }));

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
          {programmes.map((p, i) => {
            const completed = completionsByProgramme[p.id] || 0;
            const percent = p.total_lessons > 0
              ? Math.round((completed / p.total_lessons) * 100)
              : 0;
            const Icon = iconMap[p.icon] || BookOpen;
            const lastActivity = lastActivityByProgramme[p.id]
              ? new Date(lastActivityByProgramme[p.id]).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Not started";

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
                    {p.title.replace(" with Ilm Academy", "")}
                  </span>
                </div>

                <CircularProgress percent={percent} colour={p.colour || "#C9A84C"} />

                <p className="mt-5 text-sm text-muted">
                  {completed} / {p.total_lessons} lessons
                </p>
                <p className="mt-1 text-xs text-muted/60">
                  Last activity: {lastActivity}
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
          {recentLessons.length > 0 ? (
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
                  {recentLessons.map((lesson, i) => (
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
          ) : (
            <p className="px-6 py-8 text-sm text-muted">
              No activity yet. Complete a lesson to see it here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
