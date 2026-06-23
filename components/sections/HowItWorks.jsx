"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { HOW_IT_WORKS } from "@/lib/constants";

/**
 * HowItWorks — Animated steps with connection line
 *
 * Features:
 * - Staggered word-by-word heading reveal
 * - GSAP-drawn SVG connection line between steps
 * - Large gold step numbers with glassmorphism cards
 * - Each card reveals on scroll with stagger
 */
export default function HowItWorks() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    // Animate step cards in with stagger
    gsap.fromTo(
      el.querySelectorAll(".step-card"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Animate connection line drawing
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-navy py-28 lg:py-36 overflow-hidden">
      {/* Subtle pattern */}
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
            Simple Process
          </motion.p>
          <AnimatedHeading
            tag="h2"
            className="mt-5 text-white"
          >
            Begin in Three Simple Steps
          </AnimatedHeading>
        </div>

        {/* Steps grid */}
        <div className="relative mt-20 grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connection line — drawn on scroll (desktop only) */}
          <div
            ref={lineRef}
            className="absolute left-[16%] right-[16%] top-16 hidden h-[1px] origin-left md:block"
            style={{
              background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)",
            }}
          />

          {HOW_IT_WORKS.map((item, i) => (
            <div key={item.step} className="step-card relative text-center">
              {/* Step number — large, gold, translucent */}
              <motion.span
                className="font-display text-8xl font-bold text-gold/10 leading-none select-none"
                whileInView={{ opacity: [0, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.2 }}
              >
                {item.step}
              </motion.span>

              {/* Step dot indicator */}
              <div className="mx-auto mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 bg-navy-light">
                <div className="h-2.5 w-2.5 rounded-full bg-gold" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40 max-w-xs mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
