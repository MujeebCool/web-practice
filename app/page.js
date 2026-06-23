import Hero, { SocialProofBar } from "@/components/sections/Hero";
import ProgrammesStrip from "@/components/sections/ProgrammesStrip";
import HowItWorks from "@/components/sections/HowItWorks";
import InstructorSpotlight from "@/components/sections/InstructorSpotlight";
import Testimonials from "@/components/sections/Testimonials";
import PricingPreview from "@/components/sections/PricingPreview";
import CtaBanner from "@/components/sections/CtaBanner";
import SectionDivider from "@/components/ui/SectionDivider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofBar />

      <ProgrammesStrip />
      <SectionDivider variant="dark" />

      <HowItWorks />
      <SectionDivider variant="light" />

      <InstructorSpotlight />
      <SectionDivider variant="dark" />

      <Testimonials />
      <SectionDivider variant="light" />

      <PricingPreview />
      <SectionDivider variant="dark" />

      <CtaBanner />
    </>
  );
}
