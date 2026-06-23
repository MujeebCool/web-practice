"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import { PRICING } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * PricingPreview — Floating pricing card with toggle animation
 *
 * Features:
 * - Glassmorphism card with gold border glow
 * - Toggle switch with smooth transition + animated price change
 * - Staggered feature list reveal on scroll
 * - Gold check icons
 * - Glow pulse animation on the card
 */
export default function PricingPreview() {
  const [annual, setAnnual] = useState(true);
  const plan = annual ? PRICING.annual : PRICING.monthly;

  return (
    <section className="relative bg-ivory py-28 lg:py-36 overflow-hidden">
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
            Pricing
          </motion.p>
          <AnimatedHeading tag="h2" className="mt-5 text-navy">
            One Membership. Everything Included.
          </AnimatedHeading>
        </div>

        {/* Toggle switch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <div className="inline-flex items-center rounded-full border border-navy/10 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                !annual
                  ? "bg-navy text-white shadow-md"
                  : "text-muted hover:text-navy"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                annual
                  ? "bg-navy text-white shadow-md"
                  : "text-muted hover:text-navy"
              )}
            >
              Annual
            </button>
          </div>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-10 max-w-md"
        >
          <div className="relative rounded-3xl border border-gold/15 bg-white p-10 shadow-2xl shadow-gold/5 animate-glow-pulse">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-3xl rounded-tr-3xl bg-gradient-to-bl from-gold/10 to-transparent" />

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Ilm Academy Subscription
            </p>

            {/* Animated price */}
            <div className="mt-5 flex items-baseline gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={plan.price}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-6xl font-bold text-navy"
                >
                  £{plan.price}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted">/month</span>
            </div>

            <p className="mt-1 text-sm text-muted">{plan.label}</p>

            {annual && plan.saving && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold"
              >
                {plan.saving}
              </motion.p>
            )}

            {/* Features list */}
            <ul className="mt-8 space-y-4">
              {PRICING.features.slice(0, 6).map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                  className="flex items-start gap-3 text-sm text-ink/80"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <Check className="h-3 w-3 text-gold" strokeWidth={2.5} />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <Button href="/pricing" variant="primary" className="mt-10 w-full">
              Get Started
            </Button>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-sm text-muted/60">
          Cancel anytime · No hidden fees · Instant access
        </p>
      </div>
    </section>
  );
}
