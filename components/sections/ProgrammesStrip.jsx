"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Languages, Sprout, Star, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { PROGRAMMES } from "@/lib/constants";

const iconMap = { BookOpen, Languages, Sprout, Star };

/**
 * ProgrammesStrip — Editorial programme cards grid
 *
 * Features:
 * - Staggered word-by-word heading reveal (AnimatedHeading)
 * - 3D tilt cards (Card component) with staggered entrance
 * - Smooth hover zoom on card icon area
 * - Gold accent color strip at top of each card
 */
export default function ProgrammesStrip() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    // Staggered card entrance from bottom
    gsap.fromTo(
      el.querySelectorAll(".programme-card"),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ivory py-28 lg:py-36">
      <div className="islamic-pattern-light absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.3em] text-gold"
          >
            Our Programmes
          </motion.p>
          <AnimatedHeading
            tag="h2"
            className="mt-5 text-navy"
          >
            Choose Your Path to Knowledge
          </AnimatedHeading>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-muted leading-relaxed"
          >
            Four structured programmes. One subscription. A lifetime of growth.
          </motion.p>
        </div>

        {/* Programme cards grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMMES.map((programme) => {
            const Icon = iconMap[programme.icon];
            return (
              <div key={programme.id} className="programme-card">
                <Card className="group h-full p-0 overflow-hidden">
                  {/* Gold accent strip */}
                  <div className="h-1 bg-gradient-to-r from-gold to-gold-light" />

                  <div className="p-7">
                    {/* Icon with hover zoom */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/8 transition-all duration-400 group-hover:bg-gold/15 group-hover:scale-110">
                      <Icon
                        className="h-7 w-7 text-gold"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h3 className="mt-5 font-display text-xl font-semibold text-navy">
                      {programme.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {programme.tagline}
                    </p>

                    <Badge className="mt-5">
                      {programme.lessonCount} lessons
                    </Badge>

                    <Link
                      href="/programmes"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-navy/60 transition-all duration-300 group-hover:text-gold group-hover:gap-3"
                    >
                      Explore
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
