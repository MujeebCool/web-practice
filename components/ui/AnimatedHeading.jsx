"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * AnimatedHeading — Staggered word-by-word text reveal
 *
 * Splits the heading text into individual words, then animates each word
 * upward with a stagger using GSAP ScrollTrigger. Creates the signature
 * editorial text reveal effect seen on Awwwards sites.
 *
 * Props:
 *   children — The heading text string
 *   tag — HTML tag to use (default: "h2")
 *   className — Additional CSS classes
 *   delay — Additional delay before animation starts (seconds)
 *   staggerAmount — Time between each word's animation (default: 0.08)
 *   triggerStart — ScrollTrigger start position (default: "top 85%")
 */
export default function AnimatedHeading({
  children,
  tag: Tag = "h2",
  className = "",
  delay = 0,
  staggerAmount = 0.08,
  triggerStart = "top 85%",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    // Select all word spans inside the container
    const words = el.querySelectorAll(".word");

    gsap.fromTo(
      words,
      {
        y: 60,
        opacity: 0,
        rotateX: -15,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: staggerAmount,
        delay,
        scrollTrigger: {
          trigger: el,
          start: triggerStart,
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, staggerAmount, triggerStart]);

  // Split text into words, preserving spaces
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <Tag ref={containerRef} className={`overflow-hidden ${className}`} style={{ perspective: "600px" }}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word inline-block"
          style={{ willChange: "transform, opacity" }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
