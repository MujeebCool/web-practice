import StatCard from "@/components/dashboard/StatCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import LessonCard from "@/components/dashboard/LessonCard";
import { createClient } from "@/lib/supabase/server";

/**
 * Dashboard Overview — Server Component
 *
 * Fetches real data from Supabase:
 * 1. User's first name from profiles table
 * 2. Per-programme completion counts from user_progress
 * 3. Recently watched lessons from user_progress joined with lessons
 */
export default async function DashboardPage() {
  const supabase = createClient();

  // ── 1. Current user ────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 2. Profile (full name) ─────────────────────────────────────────────────
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student";
  const firstName = fullName.split(" ").filter(Boolean)[0] || "Student";

  // ── 3. Programmes catalogue ─────────────────────────────────────────────────
  const { data: programmes = [] } = await supabase
    .from("programmes")
    .select("id, slug, title, icon, colour, total_lessons")
    .in("slug", ["ilm", "arabic", "grow"]) // active programmes shown on dashboard
    .order("created_at", { ascending: true });

  // ── 4. User progress per lesson ─────────────────────────────────────────────
  const { data: userProgress = [] } = user
    ? await supabase
        .from("user_progress")
        .select("lesson_id, completed, last_watched_at, lessons(programme_id, duration_seconds)")
        .eq("user_id", user.id)
    : { data: [] };

  // ── 5. Aggregate completions per programme ──────────────────────────────────
  const completionsByProgramme = {};
  for (const row of userProgress) {
    const pid = row.lessons?.programme_id;
    if (!pid) continue;
    if (!completionsByProgramme[pid]) completionsByProgramme[pid] = 0;
    if (row.completed) completionsByProgramme[pid]++;
  }

  // ── 6. Build ProgressCard data ──────────────────────────────────────────────
  const progressRows = programmes.map((p) => ({
    id: p.id,
    programme: p.title,
    slug: p.slug,
    icon: p.icon || "BookOpen",
    totalLessons: p.total_lessons,
    completedLessons: completionsByProgramme[p.id] || 0,
    lastActivity: "—",
    colour: p.colour || "#C9A84C",
  }));

  // ── 7. Total stats ──────────────────────────────────────────────────────────
  const totalCompleted = userProgress.filter((r) => r.completed).length;
  const totalWatchedSeconds = userProgress.reduce(
    (sum, r) => sum + (r.completed ? (r.lessons?.duration_seconds || 0) : 0),
    0
  );
  const totalHours = Math.round(totalWatchedSeconds / 3600) || 0;

  const stats = [
    { label: "Lessons Completed", value: totalCompleted, icon: "BookOpen" },
    { label: "Hours Learned", value: `${totalHours}h`, icon: "Clock" },
    { label: "Day Streak", value: 0, icon: "TrendingUp" },
    { label: "Active Programmes", value: progressRows.length, icon: "Award" },
  ];

  // ── 8. Recently watched lessons ─────────────────────────────────────────────
  const { data: recentRaw = [] } = user
    ? await supabase
        .from("user_progress")
        .select(
          "last_watched_at, lessons(id, title, duration_seconds, programme_id, programmes(title, slug))"
        )
        .eq("user_id", user.id)
        .order("last_watched_at", { ascending: false })
        .limit(3)
    : { data: [] };

  const recentLessons = recentRaw
    .filter((r) => r.lessons)
    .map((r, i) => ({
      id: r.lessons.id || i,
      title: r.lessons.title,
      programme: r.lessons.programmes?.title || "—",
      slug: r.lessons.programmes?.slug || "",
      duration: r.lessons.duration_seconds
        ? `${Math.round(r.lessons.duration_seconds / 60)} min`
        : "—",
      watchedAt: new Date(r.last_watched_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy">
          Assalamu Alaikum, {firstName}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Continue where you left off.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* Active Programmes */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Active Programmes
        </h3>
        <div className="mt-4 flex flex-col gap-3">
          {progressRows.length > 0 ? (
            progressRows.map((p, i) => (
              <ProgressCard key={p.id} progress={p} index={i} />
            ))
          ) : (
            <p className="text-sm text-muted">
              No programmes found. Ask your administrator to seed the programmes table.
            </p>
          )}
        </div>
      </div>

      {/* Recently Watched */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Recently Watched
        </h3>
        {recentLessons.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentLessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No lessons watched yet. Start a programme to track your progress.
          </p>
        )}
      </div>
    </div>
  );
}
