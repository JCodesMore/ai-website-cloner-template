import { HomeNav } from "@/components/HomeNav";
import { HeroSection } from "@/components/HeroSection";
import { OffersSection } from "@/components/OffersSection";
import { LogosSection } from "@/components/LogosSection";
import { MapSection } from "@/components/MapSection";
import { GallerySection } from "@/components/GallerySection";
import { ValuesSection } from "@/components/ValuesSection";
import { MarqueeSection } from "@/components/MarqueeSection";
import { FooterSection } from "@/components/FooterSection";

export default function HomePage() {
  return (
    <main className="relative">
      <HomeNav />
      <HeroSection />
      <OffersSection />
      <LogosSection />
      <MapSection />
      <GallerySection />
      <ValuesSection />
      <MarqueeSection />
      <FooterSection />
    </main>
  );
}
