"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import ProgressCard from "@/components/dashboard/ProgressCard";
import { MOCK_PROGRESS } from "@/lib/mock-data";

/**
 * My Programmes Page — Full-width progress cards
 *
 * Shows all active programmes with % complete and "Continue Learning"
 * plus a muted card for the 4th programme (Hifdh) not yet started.
 */
export default function ProgrammesPage() {
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
        {MOCK_PROGRESS.map((p, i) => (
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

      {/* Not Started — Hifdh */}
      <div>
        <h3 className="font-display text-lg font-semibold text-navy mb-4">
          Not Started Yet
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-muted">
              <Star size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-navy/50">
                Hifdh with Ilm Academy
              </h3>
              <p className="mt-1 text-sm text-muted">
                A guided path to memorising the Quran — 210 lessons
              </p>
              <Link
                href="/programmes/hifdh"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors"
              >
                Start Programme →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
