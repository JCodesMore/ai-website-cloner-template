import { AboutUs } from "@/components/AboutUs";
import { CounterStats } from "@/components/CounterStats";
import { PageHero } from "@/components/PageHero";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const metadata = {
  title: "About Us — VertexLink",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Us" />
      <AboutUs />
      <CounterStats />
      <WhyChooseUs />
    </>
  );
}
