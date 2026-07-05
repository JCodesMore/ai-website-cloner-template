import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { BenefitsList } from "@/components/sections/BenefitsList";
import { WhyOnday } from "@/components/sections/WhyOnday";
import { Routine } from "@/components/sections/Routine";
import { IngredientsCarousel } from "@/components/sections/IngredientsCarousel";
import { ExpertsTestimonials } from "@/components/sections/ExpertsTestimonials";
import { FeaturedSubscription } from "@/components/sections/FeaturedSubscription";
import { ReviewsMasonry } from "@/components/sections/ReviewsMasonry";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { MissionBanner } from "@/components/sections/MissionBanner";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { BenefitSwitch } from "@/components/sections/BenefitSwitch";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <HeroSlider />
        <BenefitsList />
        <WhyOnday />
        <Routine />
        <IngredientsCarousel />
        <ExpertsTestimonials />
        <FeaturedSubscription />
        <ReviewsMasonry />
        <FAQAccordion />
        <MissionBanner />
        <NewsletterSection />
        <BenefitSwitch />
      </main>
      <Footer />
      <NewsletterPopup />
    </>
  );
}
