import Link from "next/link";
import { BookOpen, Languages, Sprout, Star } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PROGRAMMES } from "@/lib/constants";

const iconMap = { BookOpen, Languages, Sprout, Star };

export const metadata = {
  title: "Programmes",
};

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        title="Our Programmes"
        description="Four structured paths to knowledge — Islamic sciences, Arabic, personal growth, and Quran memorisation. All included in one subscription."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {PROGRAMMES.map((programme) => {
              const Icon = iconMap[programme.icon];
              return (
                <Card key={programme.id} className="overflow-hidden p-0">
                  <div
                    className="relative flex h-48 items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${programme.colour}, ${programme.colour}99)`,
                    }}
                  >
                    <Icon className="h-16 w-16 text-white/90" strokeWidth={1.2} />
                  </div>
                  <div className="p-6">
                    <Badge>{programme.lessonCount} lessons</Badge>
                    <h2 className="mt-4 font-display text-2xl font-semibold text-teal-dark">
                      {programme.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-teal-mid">
                      {programme.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {programme.description}
                    </p>
                    <Link
                      href="/pricing"
                      className="mt-6 inline-block text-sm font-medium text-teal-mid hover:text-teal-dark"
                    >
                      Explore Programme →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-cream py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-teal-dark">
            Ready to begin?
          </h2>
          <p className="mt-3 text-muted">
            Subscribe today and gain instant access to all programmes.
          </p>
          <Button href="/pricing" variant="primary" className="mt-6">
            View Pricing
          </Button>
        </div>
      </section>
    </>
  );
}
