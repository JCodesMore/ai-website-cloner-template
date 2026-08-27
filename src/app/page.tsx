import { TopChrome } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/TopChrome";
import { Hero } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/Hero";
import { StatsQuote } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/StatsQuote";
import { AIDemoSection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/AIDemoSection";
import { UseCasesSection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/UseCasesSection";
import { GetStartedSection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/GetStartedSection";
import { CTASection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/CTASection";
import { TestimonialsSection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/TestimonialsSection";
import { FAQSection } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/FAQSection";
import { Footer } from "@/components/sites/handhold-io-1ee60dfc/root-8a5edab2/Footer";

function Divider() {
  return <div className="mx-auto w-full max-w-378 border-t border-black/10 px-4 lg:px-8" />;
}

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <TopChrome />
      <Hero />
      <Divider />
      <div className="py-12">
        <StatsQuote />
      </div>
      <div className="mx-auto w-full max-w-378 px-4 lg:px-8">
        <AIDemoSection />
      </div>
      <div className="mx-auto w-full max-w-378 px-4 py-16 lg:px-8">
        <UseCasesSection />
      </div>
      <Divider />
      <div className="mx-auto w-full max-w-378 px-4 py-16 lg:px-8">
        <GetStartedSection />
      </div>
      <Divider />
      <div className="mx-auto w-full max-w-378 px-4 py-16 lg:px-8">
        <CTASection />
      </div>
      <div className="py-12">
        <TestimonialsSection />
      </div>
      <Divider />
      <FAQSection />
      <Divider />
      <Footer />
    </main>
  );
}
