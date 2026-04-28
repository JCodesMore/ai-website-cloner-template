import { SiteHeader } from "./components/SiteHeader";
import { HeroSection } from "./components/HeroSection";
import { ProductsSection } from "./components/ProductsSection";
import { SmartEnergySection } from "./components/SmartEnergySection";
import { JournalSection } from "./components/JournalSection";
import { CasesSection } from "./components/CasesSection";
import { TourSection } from "./components/TourSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { ContactSection } from "./components/ContactSection";
import { SiteFooter } from "./components/SiteFooter";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProductsSection />
        <SmartEnergySection />
        <JournalSection />
        <CasesSection />
        <TourSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
