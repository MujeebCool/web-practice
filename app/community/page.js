import PageHero from "@/components/ui/PageHero";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { MessageCircle, Send, Users } from "lucide-react";

export const metadata = {
  title: "Community",
};

const channels = [
  {
    icon: MessageCircle,
    title: "WhatsApp Channel",
    description:
      "Daily reminders, announcements, and beneficial knowledge delivered directly to your phone.",
  },
  {
    icon: Send,
    title: "Telegram Group",
    description:
      "Connect with fellow students, share reflections, and stay motivated on your learning journey.",
  },
  {
    icon: Users,
    title: "Student Forum",
    description:
      "Ask questions, discuss lessons, and engage with peers across all Ilm Academy programmes.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <PageHero title="The Ilm Academy Community" />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted">
            Learning Islam is not meant to be a solitary journey. The Ilm Academy
            community brings together serious students from over 190 countries — united
            by a shared commitment to seeking knowledge with clarity and purpose.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {channels.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <Icon className="h-8 w-8 text-teal-dark" strokeWidth={1.5} />
              <h2 className="mt-4 font-display text-lg font-semibold text-teal-dark">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              <Button href="#" variant="outline" size="sm" className="mt-6">
                Join →
              </Button>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-muted">
          Community access is exclusive to active subscribers.
        </p>
      </section>
    </>
  );
}
