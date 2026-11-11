import { HeroSection } from "./hero-section";
import { HomeIntro, PackagesSection, WhySection } from "./home-sections";
import { ReviewSection } from "./review-section";
import { TourOfTheMonth } from "./tour-of-the-month";

export function ShowlankaHome() {
  return (
    <>
      <HeroSection />
      <HomeIntro />
      <PackagesSection />
      <WhySection />
      <TourOfTheMonth />
      <ReviewSection />
    </>
  );
}
