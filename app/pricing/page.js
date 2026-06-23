"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PRICING, FAQ_ITEMS, SPONSORSHIP_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-teal-dark">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-muted">{answer}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const plan = annual ? PRICING.annual : PRICING.monthly;

  return (
    <>
      <PageHero
        title="Pricing"
        description="Simple. Transparent. Worth it."
        dark={false}
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-200 bg-cream p-1">
              <button
                type="button"
                onClick={() => setAnnual(false)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                  !annual ? "bg-teal-dark text-white" : "text-muted"
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                  annual ? "bg-teal-dark text-white" : "text-muted"
                )}
              >
                Annual
              </button>
            </div>
          </div>

          <Card className="mx-auto mt-10 max-w-lg p-10">
            <p className="text-sm font-medium uppercase tracking-wide text-teal-mid">
              Ilm Academy Subscription
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-6xl font-bold text-teal-dark">
                £{plan.price}
              </span>
              <span className="text-muted">/month</span>
            </div>
            <p className="mt-2 text-muted">{plan.label}</p>
            {annual && plan.saving && (
              <p className="mt-2 font-medium text-teal-bright">{plan.saving}</p>
            )}
            <Button href="/register" variant="primary" size="lg" className="mt-8 w-full">
              Get Started
            </Button>
          </Card>

          <div className="mx-auto mt-16 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-teal-dark">
              What&apos;s included
            </h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-cream">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-teal-dark">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-teal-dark">
                      Included
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING.features.map((feature) => (
                    <tr key={feature} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-muted">{feature}</td>
                      <td className="px-4 py-3 text-right text-teal-bright">✓</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-teal-dark">
            Sponsorship Programmes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
            Seeking knowledge should never be limited by circumstance.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SPONSORSHIP_OPTIONS.filter((s) => s.available).slice(0, 3).map((option) => (
              <Card key={option.title} className="p-6">
                <h3 className="font-display text-lg font-semibold text-teal-dark">
                  {option.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {option.description}
                </p>
                <Button href={option.href} variant="outline" size="sm" className="mt-6">
                  {option.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-teal-dark">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
