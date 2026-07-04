"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Topbar — Dashboard header bar
 *
 * Shows page title (derived from pathname), notification icon,
 * user avatar, and hamburger menu for mobile sidebar toggle.
 */

const pageTitles = {
  "/dashboard": "Dashboard",
  "/dashboard/programmes": "My Programmes",
  "/dashboard/progress": "My Progress",
  "/dashboard/account": "Account Settings",
};

export default function Topbar({ onMenuToggle }) {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const title = pageTitles[pathname] || "Dashboard";
  const [userName, setUserName] = useState("Student");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

      const name =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Student";

      if (mounted) setUserName(name);
    };

    loadUserName();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-100 bg-ivory/80 backdrop-blur-xl px-6 lg:px-10">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-navy hover:bg-navy/5 transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display text-xl font-semibold text-navy lg:text-2xl">
          {title}
        </h1>
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-navy/5 transition-colors"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-gold" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <CheckCircle2 size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">You are signed in</p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    We will show programme updates and account notices here.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <Link
          href="/dashboard/account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-medium text-gold transition-transform hover:scale-105"
          aria-label={`Open account settings for ${userName}`}
          title={userName}
        >
          {initials}
        </Link>
      </div>
    </header>
  );
}
