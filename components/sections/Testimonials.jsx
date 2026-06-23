"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * Testimonials — Drag-enabled auto-scroll carousel
 *
 * Features:
 * - Smooth auto-scroll that pauses on hover or drag
 * - Drag interaction via Framer Motion
 * - Glassmorphism cards with gold accent borders
 * - Large decorative gold quote marks
 * - Navy background with geometric pattern overlay
 */

function Stars({ count }) {
  return (
    <span className="text-gold text-sm" aria-label={`${count} stars`}>
      {"★".repeat(count)}
    </span>
  );
}

export default function Testimonials() {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const x = useMotionValue(0);

  const cardWidth = 340;
  const gap = 24;
  const totalCards = TESTIMONIALS.length;
  const setWidth = (cardWidth + gap) * totalCards;

  // Auto-scroll animation — moves the carousel continuously
  useAnimationFrame((_, delta) => {
    if (isPaused) return;
    const current = x.get();
    const newX = current - delta * 0.03; // Speed: 0.03px per ms
    // Reset when first set scrolls out
    if (newX <= -setWidth) {
      x.set(0);
    } else {
      x.set(newX);
    }
  });

  // Double the testimonials for seamless loop
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      id="testimonials"
      className="relative bg-navy py-28 lg:py-36 overflow-hidden"
    >
      <div className="islamic-pattern absolute inset-0 opacity-[0.02]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.3em] text-gold/70"
          >
            Testimonials
          </motion.p>
          <AnimatedHeading tag="h2" className="mt-5 text-white">
            Trusted by Students Worldwide
          </AnimatedHeading>
        </div>

        {/* Draggable carousel */}
        <div
          ref={containerRef}
          className="mt-16 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <motion.div
            className="flex"
            style={{ x, gap }}
            drag="x"
            dragConstraints={{ left: -setWidth, right: 0 }}
            dragElastic={0.1}
          >
            {items.map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                className="shrink-0 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-7 transition-colors duration-300 hover:border-gold/15 hover:bg-white/[0.06]"
                style={{ width: cardWidth }}
              >
                {/* Large decorative quote mark */}
                <span className="font-display text-5xl leading-none text-gold/15 select-none">
                  &ldquo;
                </span>

                <p className="mt-2 text-sm italic leading-relaxed text-white/60">
                  {t.quote}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-sm font-medium text-gold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      {t.flag} {t.name}
                    </p>
                    <p className="text-xs text-white/30">{t.country}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars count={t.stars} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Gradient fades at edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-navy to-transparent z-20" />
      </div>
    </section>
  );
}
