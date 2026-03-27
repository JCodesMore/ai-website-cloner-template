import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { BookingChannels } from "@/components/BookingChannels";
import { IndustriesSection } from "@/components/IndustriesSection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { PricingSection } from "@/components/PricingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <BookingChannels />
        <IndustriesSection />
        <IntegrationsSection />
        <PricingSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
