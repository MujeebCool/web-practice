"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Instagram, Youtube, MessageCircle, Send } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const footerLinks = {
  Platform: [
    { label: "Programmes", href: "/programmes" },
    { label: "Pricing", href: "/pricing" },
    { label: "Community", href: "/community" },
    { label: "Calendar", href: "/calendar" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Reviews", href: "/#testimonials" },
    { label: "Careers", href: "/about" },
    { label: "Contact", href: "/about" },
  ],
  Support: [
    { label: "Sponsorship", href: "/sponsorship" },
    { label: "Donate", href: "/donate" },
    { label: "Gift Cards", href: "/pricing" },
    { label: "FAQ", href: "/pricing#faq" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
  { icon: Send, href: "#", label: "Telegram" },
];

/**
 * Footer — Dark navy footer with geometric pattern + gold accents
 *
 * Features:
 * - Deep navy background with subtle Islamic pattern overlay
 * - Gold accent headings and hover states
 * - Scroll-triggered reveal animation via GSAP
 */
export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const el = footerRef.current;
    if (!el) return;

    // Animate footer content in on scroll
    gsap.fromTo(
      el.querySelectorAll(".footer-col"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
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
    <footer ref={footerRef} className="relative bg-navy text-white overflow-hidden">
      {/* Subtle Islamic pattern overlay */}
      <div className="islamic-pattern absolute inset-0 opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-10 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="footer-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-semibold text-white">
                Ilm
              </span>
              <span className="font-display text-2xl font-semibold text-gold">
                Academy
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/50 max-w-xs">
              Structured Islamic knowledge for serious students worldwide.
              One platform. One subscription. Lifelong growth.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 hover:border-gold/40 hover:text-gold hover:bg-gold/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-col">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">
                {title}
              </h3>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-white/30 sm:flex-row">
          <p>© 2026 Ilm Academy. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="transition-colors hover:text-white/60">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white/60">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
