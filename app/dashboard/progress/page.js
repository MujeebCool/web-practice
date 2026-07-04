import StatCard from "@/components/dashboard/StatCard";
import { ProgrammeBreakdownGrid, ActivityTable } from "@/components/dashboard/ProgressClientUI";
import { createClient } from "@/lib/supabase/server";

/**
 * My Progress Page — Server Component
 *
 * Fetches all data server-side, then passes plain serializable
 * objects to client components that handle animations.
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

    if (
      !lastActivityByProgramme[pid] ||
      row.last_watched_at > lastActivityByProgramme[pid]
    ) {
      lastActivityByProgramme[pid] = row.last_watched_at;
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCompleted = userProgress.filter((r) => r.completed).length;
  const totalSeconds = userProgress.reduce(
    (sum, r) => sum + (r.completed ? r.lessons?.duration_seconds || 0 : 0),
    0
  );
  const totalHours = Math.round(totalSeconds / 3600) || 0;

  const stats = [
    { label: "Lessons Completed", value: totalCompleted, icon: "BookOpen" },
    { label: "Hours Learned", value: `${totalHours}h`, icon: "Clock" },
    { label: "Day Streak", value: 0, icon: "TrendingUp" },
    { label: "Active Programmes", value: programmes.length, icon: "Award" },
  ];

  // ── Per-programme data for breakdown grid ──────────────────────────────────
  const programmeBreakdown = programmes.map((p) => ({
    id: p.id,
    title: p.title,
    icon: p.icon || "BookOpen",
    colour: p.colour || "#C9A84C",
    total_lessons: p.total_lessons,
    completedLessons: completionsByProgramme[p.id] || 0,
    lastActivity: lastActivityByProgramme[p.id]
      ? new Date(lastActivityByProgramme[p.id]).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not started",
  }));

  // ── Recent activity ────────────────────────────────────────────────────────
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
      {/* Summary Stats — StatCard is a Client Component, icon passed as string */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Progress Breakdown — animated cards in a Client Component */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Progress Breakdown
        </h3>
        <ProgrammeBreakdownGrid programmes={programmeBreakdown} />
      </div>

      {/* Recent Activity Table — animated rows in a Client Component */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Recent Activity
        </h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <ActivityTable lessons={recentLessons} />
        </div>
      </div>
    </div>
  );
}
