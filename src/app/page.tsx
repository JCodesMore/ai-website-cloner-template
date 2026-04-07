import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BelowFoldSection } from "@/components/BelowFoldSection";
import { ProductsSection } from "@/components/ProductsSection";
import { TrustedSection } from "@/components/TrustedSection";
import { TrustBarSection } from "@/components/TrustBarSection";
import { PersonalAgentSection } from "@/components/PersonalAgentSection";
import { AgenticEngineeringSection } from "@/components/AgenticEngineeringSection";
import { PlatformsSection } from "@/components/PlatformsSection";
import { BlogSection } from "@/components/BlogSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main id="main" className="flex grow flex-col">
        <HeroSection />
        <BelowFoldSection />
        <ProductsSection />
        <TrustedSection />
        <TrustBarSection />
        <PersonalAgentSection />
        <AgenticEngineeringSection />
        <PlatformsSection />
        <BlogSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
