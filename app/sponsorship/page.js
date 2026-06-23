"use client";

import { useState } from "react";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SPONSORSHIP_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function SponsorshipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <PageHero title="Seeking Knowledge Should Never Be Limited" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted">
            We believe no Muslim should be denied access to beneficial knowledge due
            to financial hardship. Our sponsorship programmes connect generous donors
            with students in need — and provide pathways for those seeking support.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
          {SPONSORSHIP_OPTIONS.map((option) => (
            <Card
              key={option.title}
              className={cn("p-6", !option.available && "opacity-60")}
            >
              <h2 className="font-display text-lg font-semibold text-teal-dark">
                {option.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {option.description}
              </p>
              <Button
                href={option.available ? option.href : "#"}
                variant="outline"
                size="sm"
                className="mt-6"
                disabled={!option.available}
              >
                {option.cta}
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-cream py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-teal-dark">
            Apply for sponsorship
          </h2>
          <p className="mt-2 text-sm text-muted">
            Complete the form below and our team will review your application.
          </p>

          {submitted ? (
            <Card className="mt-8 p-8 text-center">
              <p className="font-display text-xl font-semibold text-teal-dark">
                Application received
              </p>
              <p className="mt-3 text-sm text-muted">
                JazakAllahu khairan. We will be in touch within 5–7 working days,
                in sha Allah.
              </p>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-teal-dark">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-teal-dark focus:outline-none focus:ring-1 focus:ring-teal-dark"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-teal-dark">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-teal-dark focus:outline-none focus:ring-1 focus:ring-teal-dark"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-teal-dark">
                  Application type
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-teal-dark focus:outline-none focus:ring-1 focus:ring-teal-dark"
                >
                  <option value="">Select…</option>
                  <option value="hardship">Request Sponsorship (Hardship)</option>
                  <option value="huffadh">Request Sponsorship (Huffadh)</option>
                  <option value="sponsor">Sponsor a Student</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-teal-dark">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-teal-dark focus:outline-none focus:ring-1 focus:ring-teal-dark"
                  placeholder="Tell us a little about your situation or how you'd like to help…"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? "Submitting…" : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
