import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { InteractiveSelector } from "@/components/InteractiveSelector";
import { SeasonSection } from "@/components/SeasonSection";
import { ToursSection } from "@/components/ToursSection";
import { QuoteSection } from "@/components/QuoteSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { HeroMobile } from "@/components/mobile/HeroMobile";
import { InteractiveSelectorMobile } from "@/components/mobile/InteractiveSelectorMobile";
import { IntroSectionMobile } from "@/components/mobile/IntroSectionMobile";
import { SeasonSectionMobile } from "@/components/mobile/SeasonSectionMobile";
import { QuoteSectionMobile } from "@/components/mobile/QuoteSectionMobile";
import { FAQSectionMobile } from "@/components/mobile/FAQSectionMobile";

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        {/* Mobile-only */}
        <div className="md:hidden">
          <HeroMobile />
        </div>

        {/* Desktop-only (untouched) */}
        <div className="hidden md:block">
          <HeroSection />
        </div>

        <IntroSectionMobile />
        <div className="hidden md:block">
          <IntroSection />
        </div>

        <div className="md:hidden">
          <InteractiveSelectorMobile />
        </div>
        <div className="hidden md:block">
          <InteractiveSelector />
        </div>

        <SeasonSectionMobile />
        <div className="hidden md:block">
          <SeasonSection />
        </div>

        <ToursSection />

        <QuoteSectionMobile />
        <div className="hidden md:block">
          <QuoteSection />
        </div>

        <FAQSectionMobile limit={4} showSeeAllLink heading="Common questions before you book" />
        <div className="hidden md:block">
          <FAQSection limit={3} showSeeAllLink heading="Common Questions Before You Book" />
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
