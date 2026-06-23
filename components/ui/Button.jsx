"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * MagneticButton — Premium button with magnetic hover + fill animation
 *
 * Two key effects:
 * 1. MAGNETIC: Button subtly follows the cursor when hovered (spring physics)
 * 2. FILL: Background color sweeps in from left on hover
 *
 * Variants:
 *   primary — Gold background, navy text
 *   ghost — Transparent with gold border
 *   outline — Navy border on light bg
 *   white — White bg, navy text
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  type = "button",
  onClick,
  disabled,
}) {
  const ref = useRef(null);

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150 });
  const springY = useSpring(y, { damping: 15, stiffness: 150 });

  // Handle magnetic mouse tracking
  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Move button 20% toward cursor position
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "relative inline-flex items-center justify-center font-body font-medium rounded-full transition-all duration-400 ease-out overflow-hidden group";

  const variants = {
    primary:
      "bg-gold text-navy hover:shadow-lg hover:shadow-gold/20",
    ghost:
      "border border-gold/40 text-gold hover:border-gold hover:bg-gold/10",
    outline:
      "border border-navy/20 text-navy hover:border-navy hover:bg-navy hover:text-ivory",
    white:
      "bg-white text-navy hover:bg-ivory hover:shadow-lg",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-sm tracking-wide",
    lg: "px-9 py-4.5 text-base tracking-wide",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  // Inner content with fill sweep effect
  const inner = (
    <>
      {/* Fill sweep overlay — slides in from left on hover */}
      <span
        className={cn(
          "absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
          variant === "primary" ? "bg-navy" : "",
          variant === "ghost" ? "bg-gold/15" : "",
          variant === "outline" ? "bg-navy" : "",
          variant === "white" ? "bg-gold" : ""
        )}
      />
      {/* Text layer — always above the fill */}
      <span
        className={cn(
          "relative z-10 transition-colors duration-500",
          variant === "primary" ? "group-hover:text-gold" : "",
          variant === "white" ? "group-hover:text-navy" : ""
        )}
      >
        {children}
      </span>
    </>
  );

  const motionProps = {
    ref,
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileTap: { scale: 0.97 },
  };

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link href={href} className={classes}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {inner}
    </motion.button>
  );
}
