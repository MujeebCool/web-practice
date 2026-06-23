import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";

export const metadata = {
  title: "About",
};

const values = [
  {
    title: "Knowledge",
    description:
      "We believe seeking knowledge is an obligation upon every Muslim. Our programmes are built to honour that sacred duty with depth and rigour.",
  },
  {
    title: "Clarity",
    description:
      "Islamic learning should not feel overwhelming. We structure every programme like a curriculum — clear paths, manageable lessons, steady progress.",
  },
  {
    title: "Consistency",
    description:
      "Real growth comes from showing up regularly. We design for the busy Muslim balancing Deen and Dunya, making consistent study achievable.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="Our Why" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted">
            Ilm Academy was born from a simple conviction: Muslims worldwide deserve
            access to structured, scholarly Islamic education — without compromise
            on quality or methodology.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            We are not another library of random lectures. We are a curated academy
            — programmes designed with intention, taught with clarity, and delivered
            with the dignity this knowledge deserves.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Based in the United Kingdom and serving students across the globe, we
            exist to make the path of seeking knowledge feel enlightening, accessible,
            and deeply personal.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-teal-dark">
            What We Believe
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="p-6">
                <h3 className="font-display text-xl font-semibold text-teal-dark">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-teal-dark">
            Learn anywhere
          </h2>
          <p className="mt-3 text-muted">
            Take your studies with you — on commute, between appointments, or at home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#" className="block">
              <Image
                src="/images/app-store-badge.svg"
                alt="Download on the App Store"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </a>
            <a href="#" className="block">
              <Image
                src="/images/google-play-badge.svg"
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-teal-dark">
            Our Team
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Scholars, educators, and dedicated Muslims working to serve this ummah.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {["Leadership", "Advisory Board", "Educators"].map((role) => (
              <Card key={role} className="flex flex-col items-center p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-teal-dark/10">
                  <span className="font-display text-2xl text-teal-dark">?</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-teal-dark">
                  {role}
                </h3>
                <p className="mt-2 text-sm text-muted">Coming soon</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
