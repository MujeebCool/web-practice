"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [10, 25, 50];

const uses = [
  "Supporting students who cannot afford a subscription through our sponsorship programme.",
  "Developing new courses and programmes to expand the academy's reach.",
  "Maintaining the platform, apps, and infrastructure that keep knowledge accessible worldwide.",
];

export default function DonatePage() {
  const [selected, setSelected] = useState(25);
  const [custom, setCustom] = useState("");

  const amount = custom ? parseFloat(custom) : selected;

  return (
    <>
      <PageHero title="Support the Mission" />

      <section className="py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg leading-relaxed text-muted">
            Your contribution helps us keep Islamic knowledge accessible to Muslims
            worldwide — especially those who cannot afford it. Every donation is a
            sadaqah jariyah that continues to benefit long after it is given.
          </p>

          <Card className="mt-10 p-8">
            <p className="text-sm font-medium text-teal-dark">Choose an amount</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelected(amt);
                    setCustom("");
                  }}
                  className={cn(
                    "rounded-lg border py-3 text-sm font-medium transition-colors",
                    selected === amt && !custom
                      ? "border-teal-dark bg-teal-dark text-white"
                      : "border-gray-200 text-teal-dark hover:border-teal-mid"
                  )}
                >
                  £{amt}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label htmlFor="custom" className="text-sm text-muted">
                Or enter a custom amount
              </label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                  £
                </span>
                <input
                  id="custom"
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-3 pl-8 pr-4 text-sm focus:border-teal-dark focus:outline-none focus:ring-1 focus:ring-teal-dark"
                />
              </div>
            </div>

            <Button href="#" variant="primary" className="mt-6 w-full">
              Donate {amount ? `£${amount}` : "Now"}
            </Button>
          </Card>

          <div className="mt-12">
            <h2 className="font-display text-xl font-semibold text-teal-dark">
              How your donation is used
            </h2>
            <ul className="mt-4 space-y-3">
              {uses.map((use) => (
                <li key={use} className="flex gap-3 text-sm text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-bright" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
