"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Programmes", href: "/dashboard/programmes", icon: BookOpen },
  { label: "My Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Account", href: "/dashboard/account", icon: Settings },
];

/**
 * Sidebar — Dashboard navigation
 *
 * Fixed on desktop (w-64), slide-in drawer on mobile.
 * Active link highlighting via usePathname().
 * Sign Out uses Supabase auth.signOut() and redirects to homepage.
 * User name is fetched from Supabase profile.
 */
export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Try profile table first, fall back to auth metadata
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        setUserName(
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Student"
        );
      }
    };

    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-white">
            Ilm
          </span>
          <span className="font-display text-xl font-semibold text-gold">
            Academy
          </span>
        </Link>
      </div>

      {/* User greeting */}
      <div className="mx-4 rounded-xl bg-white/5 px-4 py-3">
        <p className="text-xs text-white/40">Welcome back,</p>
        <p className="mt-0.5 text-sm font-medium text-white">
          {userName || "Loading…"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-gold/10 text-gold"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2 : 1.5} />
                  {item.label}
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="border-t border-white/5 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/40 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-navy lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — drawer overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-navy lg:hidden"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-4 text-white/40 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
