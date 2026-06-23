"use client";

import { motion } from "framer-motion";

/**
 * StatCard — Dashboard summary statistic card
 *
 * Displays a label, value, and icon in a clean card layout.
 * Subtle gold accent on hover.
 */
export default function StatCard({ label, value, icon: Icon, index = 0 }) {
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
