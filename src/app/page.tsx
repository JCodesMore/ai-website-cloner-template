import { AboutNed } from "@/components/AboutNed";
import { BorrowingPowerForm } from "@/components/BorrowingPowerForm";
import { CtaBand } from "@/components/CtaBand";
import { FaqAccordion, HOME_FAQ_ITEMS } from "@/components/FaqAccordion";
import { FundUpDifference } from "@/components/FundUpDifference";
import { GetInTouch } from "@/components/GetInTouch";
import { HeroSection } from "@/components/HeroSection";
import { IdealClient } from "@/components/IdealClient";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Testimonials } from "@/components/Testimonials";
import { TrustBar } from "@/components/TrustBar";

/**
 * Section order matches the live homepage exactly, top to bottom:
 *
 *   #home.fu-hero-embed → .trust-bar → #services.services-section →
 *   #about.about-section → .rs2-section/.fu-testi → .fd-diff-section →
 *   .oc-section → .journey-section → .ctab-section → #booking.bpa-section →
 *   main#contact-git.git-section → .faq-section/.fu-faq2
 *
 * Header and footer are mounted globally in `layout.tsx`.
 * Note `GetInTouch` renders the page's only <main>, matching the source.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ServicesGrid />
      <AboutNed />
      <Testimonials />
      <FundUpDifference />
      <IdealClient />
      <JourneyTimeline />
      <CtaBand />
      <BorrowingPowerForm />
      <GetInTouch />
      {/* Single-open with the first question expanded, matching every other FAQ on the
          site. A deliberate divergence: the homepage embed's "close others" loop is
          commented out in source, so live it opens any number and starts fully closed. */}
      <FaqAccordion items={HOME_FAQ_ITEMS} />
    </>
  );
}
