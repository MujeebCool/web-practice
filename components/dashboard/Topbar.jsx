"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-data";

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
  const title = pageTitles[pathname] || "Dashboard";

  // User initials for avatar
  const initials = MOCK_USER.name
    .split(" ")
    .map((w) => w[0])
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
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-navy/5 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Notification dot */}
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-gold" />
        </button>

        {/* User avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-xs font-medium text-gold">
          {initials}
        </div>
      </div>
    </header>
  );
}
