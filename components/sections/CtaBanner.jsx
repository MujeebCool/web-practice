"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import AnimatedHeading from "@/components/ui/AnimatedHeading";

/**
 * CtaBanner — Cinematic full-width CTA section
 *
 * Features:
 * - Navy gradient background with geometric pattern overlay
 * - Parallax pattern movement
 * - Large editorial typography with word-by-word reveal
 * - Magnetic gold CTA button
 * - Arabic decorative text element
 */
export default function CtaBanner() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const patternY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 lg:py-44 overflow-hidden bg-navy"
    >
      {/* Parallax geometric pattern */}
      <motion.div style={{ y: patternY }} className="absolute inset-0">
        <div className="islamic-pattern absolute inset-0 opacity-[0.04]" />
      </motion.div>

      {/* Radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(26,35,64,0.3)_0%,_rgba(10,15,28,0.9)_70%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* Decorative Arabic text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.06 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="font-arabic text-5xl text-gold leading-none select-none mb-8"
          aria-hidden="true"
        >
          اطلبوا العلم
        </motion.p>

        <AnimatedHeading
          tag="h2"
          className="text-white !text-4xl md:!text-5xl lg:!text-6xl"
        >
          Knowledge Is Your Greatest Strength
        </AnimatedHeading>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-lg text-white/40 leading-relaxed"
        >
          It&apos;s time to pursue it with clarity and purpose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10"
        >
          <Button href="/pricing" variant="primary" size="lg">
            Join Ilm Academy Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
