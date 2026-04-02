import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TeamSection } from "@/components/TeamSection";
import { PartnersSection } from "@/components/PartnersSection";
import { VideoCTASection } from "@/components/VideoCTASection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative" style={{ paddingTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <Navbar />
      <main>
        <HeroSection />
        <IntegrationsSection />
        <FeaturesSection />
        <TeamSection />
        <PartnersSection />
        <VideoCTASection />
        <ReviewsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
