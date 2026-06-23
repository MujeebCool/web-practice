import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { UPCOMING_EVENTS } from "@/lib/constants";

export const metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return (
    <>
      <PageHero
        title="Live Sessions & Events"
        description="Monthly Q&A sessions, workshops, and lectures with our scholars and instructors."
      />

      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
          {UPCOMING_EVENTS.map((event) => (
            <Card key={event.title} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-teal-dark text-white">
                <span className="font-display text-2xl font-bold">{event.day}</span>
                <span className="text-xs uppercase">{event.month}</span>
              </div>
              <div className="flex-1">
                <Badge className="mb-2">{event.type}</Badge>
                <h2 className="font-display text-lg font-semibold text-teal-dark">
                  {event.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {event.date} · {event.time}
                </p>
              </div>
              <Button href="#" variant="outline" size="sm" className="shrink-0">
                Add to Calendar
              </Button>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-muted">
          Live sessions are exclusive to subscribers.
        </p>
      </section>
    </>
  );
}
