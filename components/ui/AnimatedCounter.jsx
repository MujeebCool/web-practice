"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useMotionValue, animate } from "framer-motion";

/**
 * AnimatedCounter — Smooth number counter animation
 *
 * Counts up from 0 to the target value when scrolled into view.
 * Uses Framer Motion's animate() for buttery-smooth number transitions.
 *
 * Props:
 *   value — Target number to count to
 *   suffix — Text after number (e.g., "+", "★")
 *   prefix — Text before number (e.g., "£")
 *   duration — Animation duration in seconds (default: 2)
 *   className — Additional CSS classes
 */
export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;

    // Animate from 0 to target value
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for natural feel
      onUpdate: (latest) => {
        // Use comma formatting for large numbers
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration, motionVal]);

  // Format number with commas
  const formatted = displayValue.toLocaleString();

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}
