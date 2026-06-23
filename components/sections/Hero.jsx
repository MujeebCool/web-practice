"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

/**
 * ── HERO SECTION ──
 *
 * Cinematic full-screen hero with:
 * 1. Animated SVG Islamic geometric pattern (stroke drawing + slow rotation)
 * 2. Parallax layers — pattern and content move at different scroll speeds
 * 3. Staggered word-by-word heading reveal with gold shimmer
 * 4. Decorative Arabic bismillah calligraphy element
 * 5. Integrated stats bar at bottom with animated counters
 * 6. Gradient overlays for depth
 */

/* ── SVG Geometric Pattern Component ── */
function IslamicPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large rotating octagonal star pattern — pure SVG */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow opacity-[0.06]"
        width="1200"
        height="1200"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Octagonal star tessellation */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4].map((col) => (
            <g key={`${row}-${col}`} transform={`translate(${col * 120}, ${row * 120})`}>
              {/* Eight-pointed star */}
              <motion.polygon
                points="60,12 72,36 96,24 84,48 108,56 84,64 96,88 72,76 60,100 48,76 24,88 36,64 12,56 36,48 24,24 48,36"
                stroke="#C9A84C"
                strokeWidth="0.8"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, delay: (row + col) * 0.15, ease: "easeOut" }}
              />
              {/* Inner circle */}
              <motion.circle
                cx="60"
                cy="56"
                r="16"
                stroke="#C9A84C"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: (row + col) * 0.15 + 0.5, ease: "easeOut" }}
              />
            </g>
          ))
        )}
      </svg>

      {/* Secondary pattern layer — smaller, opposite rotation */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]"
        style={{ animation: "rotate-slow 180s linear infinite reverse" }}
        width="800"
        height="800"
        viewBox="0 0 400 400"
        fill="none"
      >
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3].map((col) => (
            <g key={`s-${row}-${col}`} transform={`translate(${col * 100}, ${row * 100})`}>
              <polygon
                points="50,10 60,30 80,20 70,40 90,50 70,60 80,80 60,70 50,90 40,70 20,80 30,60 10,50 30,40 20,20 40,30"
                stroke="#C9A84C"
                strokeWidth="0.4"
                fill="none"
              />
            </g>
          ))
        )}
      </svg>
    </div>
  );
}

/* ── Main Hero Component ── */
export default function Hero() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);

  // Parallax: content scrolls faster than background
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const patternY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Heading text for word-by-word staggered reveal
  const headingWords = "The Clearest Path to Islamic Knowledge".split(" ");

  // Subheading + CTA fade-up variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.1 + 1.2, // After heading animation
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-navy"
    >
      {/* ── Background Layers ── */}

      {/* Radial gradient overlay — creates depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(26,35,64,0.4)_0%,_rgba(10,15,28,1)_70%)]" />

      {/* Animated geometric pattern with parallax */}
      <motion.div style={{ y: patternY }} className="absolute inset-0">
        <IslamicPattern />
      </motion.div>

      {/* Subtle top-down gradient for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy via-navy/50 to-transparent" />

      {/* ── Main Content ── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center lg:px-8"
      >
        {/* Decorative Arabic text */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-arabic text-6xl text-gold md:text-8xl mb-8 leading-none select-none"
          aria-hidden="true"
        >
          بِسْمِ ٱللَّٰهِ
        </motion.p>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs font-medium uppercase tracking-[0.3em] text-gold/70"
        >
          Structured Islamic Learning for the Modern World
        </motion.p>

        {/* ── Staggered Heading ── */}
        <h1
          ref={headingRef}
          className="mt-8 font-display text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-6xl lg:text-7xl"
          style={{ perspective: "600px" }}
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 60, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.7 + i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Highlight "Islamic" in gold */}
              <span className={word === "Islamic" ? "text-gold-gradient" : ""}>
                {word}
              </span>
              {i < headingWords.length - 1 && "\u00A0"}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-8 max-w-2xl text-lg text-white/50 leading-relaxed md:text-xl"
        >
          Structured programmes in Islamic sciences, Arabic, and personal
          growth — for serious students worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/pricing" variant="primary" size="lg">
            Begin Your Journey
          </Button>
          <Button href="/programmes" variant="ghost" size="lg">
            Explore Programmes
          </Button>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-gold/50"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory to-transparent z-10" />
    </section>
  );
}

/**
 * ── STATS BAR ──
 *
 * Social proof numbers with animated counters.
 * Separated from hero for layout flexibility.
 */
export function SocialProofBar() {
  const stats = [
    { value: 190, suffix: "+", label: "Countries" },
    { value: 1000, suffix: "+", label: "Lessons" },
    { value: 4.9, suffix: "★", label: "Student Rating", isDecimal: true },
  ];

  return (
    <section className="relative bg-ivory py-16">
      <div className="islamic-pattern-light absolute inset-0" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 px-6 sm:flex-row sm:gap-20">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              duration={stat.isDecimal ? 1.5 : 2}
              className="font-display text-4xl font-bold text-navy md:text-5xl"
            />
            <p className="mt-2 text-sm text-muted tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
