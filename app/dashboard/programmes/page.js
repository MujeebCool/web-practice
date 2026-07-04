import Link from "next/link";
import { Star } from "lucide-react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { createClient } from "@/lib/supabase/server";


/**
 * My Programmes Page — Server Component
 *
 * Fetches all programmes from the catalogue and per-programme
 * completion % from user_progress.
 */
export default async function ProgrammesPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Catalogue ──────────────────────────────────────────────────────────────
  const { data: programmes = [] } = await supabase
    .from("programmes")
    .select("id, slug, title, icon, colour, total_lessons")
    .order("created_at", { ascending: true });

  // ── User progress ──────────────────────────────────────────────────────────
  const { data: userProgress = [] } = user
    ? await supabase
        .from("user_progress")
        .select("lesson_id, completed, last_watched_at, lessons(programme_id)")
        .eq("user_id", user.id)
    : { data: [] };

  // Aggregate completions per programme
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

  // Split into active (has lessons) vs not-started (0 progress)
  const activeProgrammes = programmes.filter((p) => p.slug !== "hifdh");
  const notStarted = programmes.filter((p) => p.slug === "hifdh");

  const progressRows = activeProgrammes.map((p) => ({
    id: p.id,
    programme: p.title,
    slug: p.slug,
    icon: p.icon || "BookOpen",
    totalLessons: p.total_lessons,
    completedLessons: completionsByProgramme[p.id] || 0,
    lastActivity: lastActivityByProgramme[p.id]
      ? new Date(lastActivityByProgramme[p.id]).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not started",
    colour: p.colour || "#C9A84C",
  }));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy">
          Your Learning Paths
        </h2>
        <p className="mt-1 text-sm text-muted">
          Track your progress across all programmes.
        </p>
      </div>

      {/* Active Programmes */}
      <div className="space-y-4">
        {progressRows.map((p, i) => (
          <ProgressCard
            key={p.id}
            progress={p}
            showPercent
            showContinue
            large
            index={i}
          />
        ))}
      </div>

      {/* Not Started */}
      {notStarted.map((p, i) => (
        <div key={p.id}>
          <h3 className="font-display text-lg font-semibold text-navy mb-4">
            Not Started Yet
          </h3>
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-muted">
                <Star size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-navy/50">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {p.description || `A guided path — ${p.total_lessons} lessons`}
                </p>
                <Link
                  href={`/programmes/${p.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors"
                >
                  Start Programme →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
