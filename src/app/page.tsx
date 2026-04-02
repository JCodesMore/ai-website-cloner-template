import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CapabilitiesSection } from "@/components/CapabilitiesSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { LenisProvider } from "@/components/LenisProvider";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";

export default function Home() {
  return (
    <LenisProvider>
      <Preloader />
      <CustomCursor />
      <div className="page-wrapper relative overflow-clip">
        <Navbar />
        <NoiseOverlay />
        <main>
          <HeroSection />
          <CapabilitiesSection />
          <PortfolioSection />
          <BenefitsSection />
          <ReviewsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}
