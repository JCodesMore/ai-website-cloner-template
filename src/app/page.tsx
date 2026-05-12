import { AboutUs } from "@/components/AboutUs";
import { BlogSection } from "@/components/BlogSection";
import { CounterStats } from "@/components/CounterStats";
import { HeroBanner } from "@/components/HeroBanner";
import { OfferCallout } from "@/components/OfferCallout";
import { PricingPlans } from "@/components/PricingPlans";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Streaming } from "@/components/Streaming";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ServicesGrid />
      <AboutUs />
      <CounterStats />
      <WhyChooseUs />
      <OfferCallout />
      <PricingPlans />
      <Streaming />
      <BlogSection />
    </>
  );
}
