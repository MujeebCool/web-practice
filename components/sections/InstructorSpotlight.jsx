"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "@/components/ui/AnimatedHeading";

/**
 * InstructorSpotlight — Instructor showcase section
 *
 * Features:
 * - Editorial layout with large placeholder avatar circles
 * - Staggered text reveal on names and bios
 * - GSAP scroll-triggered card entrance
 * - Gold accent decorative elements
 */

const INSTRUCTORS = [
  {
    name: "Sheikh Ahmad Al-Rashid",
    role: "Islamic Sciences Lead",
    bio: "A graduate of Al-Azhar University with over 15 years of teaching experience in Aqeedah, Fiqh, and Hadith sciences.",
    initials: "AR",
  },
  {
    name: "Ustadha Maryam Khalil",
    role: "Arabic Language Director",
    bio: "Specialist in classical Arabic grammar and Quranic linguistics, with a passion for making the language accessible to all.",
    initials: "MK",
  },
  {
    name: "Sheikh Bilal Mahmoud",
    role: "Quran & Hifdh Instructor",
    bio: "Hafidh with ijazah in the ten qira'at, dedicated to nurturing a new generation of Quran memorisers worldwide.",
    initials: "BM",
  },
];

export default function InstructorSpotlight() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = sectionRef.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll(".instructor-card"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
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
            Our Scholars
          </motion.p>
          <AnimatedHeading tag="h2" className="mt-5 text-navy">
            Learn From Those Who Devoted Their Lives to Knowledge
          </AnimatedHeading>
        </div>

        {/* Instructor cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {INSTRUCTORS.map((instructor, i) => (
            <div
              key={instructor.name}
              className="instructor-card group text-center"
            >
              {/* Avatar circle with initials */}
              <div className="relative mx-auto">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-navy transition-all duration-500 group-hover:bg-navy-light">
                  <span className="font-display text-2xl font-semibold text-gold">
                    {instructor.initials}
                  </span>
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 mx-auto h-28 w-28 rounded-full border border-gold/20 scale-[1.15] transition-transform duration-500 group-hover:scale-[1.25]" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-navy">
                {instructor.name}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-gold">
                {instructor.role}
              </p>
              <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs mx-auto">
                {instructor.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
