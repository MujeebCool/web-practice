"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Navbar — Premium transparent-to-solid navbar
 *
 * Features:
 * - Transparent with blur on hero, solid navy on scroll
 * - Active link with animated gold underline
 * - Animated hamburger → X morphing for mobile
 * - Full-screen mobile overlay with staggered link reveals
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          transparent
            ? "bg-transparent"
            : "bg-navy/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10"
        )}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* ── Logo ── */}
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <span className="font-display text-2xl font-semibold text-white">
              Ilm
            </span>
            <span className="font-display text-2xl font-semibold text-gold">
              Academy
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-2 text-sm font-medium tracking-wide text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                  {/* Animated gold underline */}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-[2px] bg-gold transition-all duration-300",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Auth ── */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Sign In
            </Link>
            <Button href="/register" variant="primary" size="sm">
              Start Learning
            </Button>
          </div>

          {/* ── Mobile Hamburger (animated morph) ── */}
          <button
            type="button"
            className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {/* Top bar → rotates to form X */}
            <motion.span
              animate={{
                rotate: mobileOpen ? 45 : 0,
                y: mobileOpen ? 6 : 0,
                width: mobileOpen ? 24 : 20,
              }}
              transition={{ duration: 0.3 }}
              className="block h-[2px] bg-white rounded-full origin-center"
              style={{ width: 20 }}
            />
            {/* Middle bar → fades out */}
            <motion.span
              animate={{
                opacity: mobileOpen ? 0 : 1,
                scaleX: mobileOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="block h-[2px] w-5 bg-white rounded-full"
            />
            {/* Bottom bar → rotates to form X */}
            <motion.span
              animate={{
                rotate: mobileOpen ? -45 : 0,
                y: mobileOpen ? -6 : 0,
                width: mobileOpen ? 24 : 16,
              }}
              transition={{ duration: 0.3 }}
              className="block h-[2px] bg-white rounded-full origin-center"
              style={{ width: 16 }}
            />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-navy md:hidden"
          >
            {/* Subtle Islamic pattern overlay */}
            <div className="islamic-pattern absolute inset-0 opacity-[0.03]" />

            <nav className="relative z-10 flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-display text-3xl font-semibold transition-colors",
                      pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href))
                        ? "text-gold"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth links */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: NAV_LINKS.length * 0.08 }}
                className="mt-4 flex flex-col items-center gap-4"
              >
                <Link
                  href="/login"
                  className="text-lg text-white/60 transition-colors hover:text-white"
                >
                  Sign In
                </Link>
                <Button href="/register" variant="primary" size="lg">
                  Start Learning
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
