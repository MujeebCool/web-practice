"use client";

import { motion } from "framer-motion";

/**
 * PageTransition — Enhanced route transition wrapper
 *
 * Fade + subtle upward slide when navigating between pages.
 * Stagger children for a more polished page entrance.
 */
export default function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="min-h-screen"
    >
      {children}
    </motion.main>
  );
}
