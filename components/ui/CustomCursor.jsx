"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor — Subtle gold dot follower cursor
 *
 * A small gold dot that smoothly follows the mouse via spring physics.
 * Scales up when hovering interactive elements (links, buttons).
 * Automatically hidden on touch devices via CSS (see globals.css).
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const visibleRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Motion values for smooth cursor position (spring-based)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 350, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 350, mass: 0.5 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || coarsePointer) return undefined;

    const onMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const interactiveSelector = "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";
    const onPointerOver = (e) => {
      if (e.target.closest(interactiveSelector)) setIsHovering(true);
    };
    const onPointerOut = (e) => {
      if (e.target.closest(interactiveSelector)) setIsHovering(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, [cursorX, cursorY]);

  // Don't render on server or if not yet visible
  if (!isVisible) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          width: isHovering ? 50 : 20,
          height: isHovering ? 50 : 20,
          opacity: isHovering ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-full border border-gold/60"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }}
      />
    </motion.div>
  );
}
