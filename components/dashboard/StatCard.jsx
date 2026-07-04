"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp, Award } from "lucide-react";

/**
 * Icon name → component map.
 * Accepts a string (from server components) or a component directly.
 */
const ICON_MAP = { BookOpen, Clock, TrendingUp, Award };

/**
 * StatCard — Dashboard summary statistic card
 *
 * `icon` can be a string key (e.g. "BookOpen") or a Lucide component.
 * Accepting a string lets Server Components pass it without violating
 * the "no functions across server/client boundary" rule.
 */
export default function StatCard({ label, value, icon, index = 0 }) {
  const Icon = typeof icon === "string" ? ICON_MAP[icon] : icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-gold/20 hover:shadow-lg hover:shadow-gold/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy">
            {value}
          </p>
        </div>
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/8 text-gold transition-colors group-hover:bg-gold/15">
            <Icon size={20} strokeWidth={1.5} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
