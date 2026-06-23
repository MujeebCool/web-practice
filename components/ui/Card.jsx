"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Card — Premium 3D tilt card with glassmorphism
 *
 * On hover, the card tilts to follow the cursor using perspective
 * transforms, creating a realistic 3D effect. Also features:
 * - Glassmorphism backdrop-blur (dark variant)
 * - Subtle gold border glow on hover
 * - Smooth spring-based physics
 *
 * Props:
 *   variant — "light" (default, ivory bg) or "dark" (glass on navy)
 *   tilt — Enable/disable 3D tilt (default: true)
 */
export default function Card({
  children,
  className,
  variant = "light",
  tilt = true,
  ...props
}) {
  const ref = useRef(null);

  // Rotation values for 3D tilt
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { damping: 20, stiffness: 200 });
  const springRotateY = useSpring(rotateY, { damping: 20, stiffness: 200 });

  // Glare position for lighting effect
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const handleMouseMove = (e) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    // Tilt: max ±8 degrees
    rotateX.set(-percentY * 8);
    rotateY.set(percentX * 8);

    // Glare follows cursor
    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const baseClasses = cn(
    "relative rounded-2xl overflow-hidden transition-shadow duration-400",
    variant === "light"
      ? "bg-white border border-gray-100 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5"
      : "glass hover:border-gold/20 hover:shadow-xl hover:shadow-gold/10",
    className
  );

  return (
    <motion.div
      ref={ref}
      className={baseClasses}
      style={{
        perspective: "1000px",
        rotateX: tilt ? springRotateX : 0,
        rotateY: tilt ? springRotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
