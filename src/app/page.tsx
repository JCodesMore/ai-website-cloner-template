import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import FeaturedInSection from "@/components/FeaturedInSection";
import LiabilityCheckupSection from "@/components/LiabilityCheckupSection";
import PerksSection from "@/components/PerksSection";
import PricingSection from "@/components/PricingSection";
import SolutionsSection from "@/components/SolutionsSection";
import BillingSection from "@/components/BillingSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <LiabilityCheckupSection />
        <TestimonialsSection />
        <FeaturedInSection />
        <PerksSection />
        <PricingSection />
        <SolutionsSection />
        <BillingSection />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
