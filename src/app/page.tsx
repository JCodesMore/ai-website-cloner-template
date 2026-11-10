import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Sections } from "@/components/Sections";
import { BottomCta } from "@/components/BottomCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Sections />
        <BottomCta />
      </main>
      <Footer />
    </>
  );
}
