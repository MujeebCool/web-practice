"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import LessonCard from "@/components/dashboard/LessonCard";
import { MOCK_PROGRESS, MOCK_RECENT_LESSONS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

/**
 * Dashboard Overview — Main dashboard page
 *
 * Sections:
 * 1. Welcome greeting
 * 2. 4 StatCards (lessons, hours, streak, programmes)
 * 3. Active Programmes (ProgressCards)
 * 4. Recently Watched (LessonCards)
 */

// Compute dashboard stats from mock data
const totalCompleted = MOCK_PROGRESS.reduce((sum, p) => sum + p.completedLessons, 0);
const totalHours = Math.round(totalCompleted * 0.35); // ~21 min avg per lesson

const stats = [
  { label: "Lessons Completed", value: totalCompleted, icon: BookOpen },
  { label: "Hours Learned", value: `${totalHours}h`, icon: Clock },
  { label: "Day Streak", value: 14, icon: TrendingUp },
  { label: "Active Programmes", value: MOCK_PROGRESS.length, icon: Award },
];

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [firstName, setFirstName] = useState("Student");

  useEffect(() => {
    let mounted = true;

    const loadUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted || !user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      const fullName =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Student";

      if (mounted) {
        setFirstName(fullName.split(" ").filter(Boolean)[0] || "Student");
      }
    };

    loadUserName();

    return () => {
      mounted = false;
    };
  }, [supabase]);

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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROGRESS.map((p, i) => (
            <ProgressCard key={p.id} progress={p} index={i} />
          ))}
        </div>
      </div>

      {/* Recently Watched */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy">
          Recently Watched
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RECENT_LESSONS.slice(0, 3).map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
