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
    .select("id, slug, title, icon, colour, total_lessons, description")
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

      {/* Active Programmes (HackerRank horizontal style) */}
      <div className="space-y-4">
        {progressRows.map((p, i) => (
          <ProgressCard
            key={p.id}
            progress={p}
            showPercent
            showContinue
            index={i}
          />
        ))}
      </div>

      {/* Not Started / Skills Catalogue Grid (HackerRank grid style) */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy mb-4">
          Skills Available for Practice
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notStarted.map((p, i) => (
            <div 
              key={p.id} 
              className="group flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:border-gold/50 hover:shadow-md cursor-pointer relative overflow-hidden"
            >
              {/* Subtle hover background effect */}
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star size={28} strokeWidth={1.5} />
              </div>
              
              <h4 className="font-display text-lg font-semibold text-navy mb-2">
                {p.title}
              </h4>
              <p className="text-sm text-muted mb-6">
                {p.description || `A guided path — ${p.total_lessons} lessons`}
              </p>
              
              <Link
                href={`/programmes/${p.slug}`}
                className="mt-auto w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-navy transition-all hover:bg-gold hover:text-white hover:border-gold"
              >
                Start Practice
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
