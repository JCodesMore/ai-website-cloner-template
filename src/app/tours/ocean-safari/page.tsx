import type { Metadata } from "next";
import { tours } from "@/data/site";
import { TourDetailPage } from "@/components/TourDetailPage";

export const metadata: Metadata = {
  title: "Ocean Safari — 6-Hour Day Trip in the Sea of Cortez",
  description: "Join our signature 6-hour ocean safari to Cerralvo Island. Snorkel with mobula rays, dolphins, and marine wildlife. From $3,000 Mexican Pesos per person. La Ventana, Mexico.",
  alternates: { canonical: "https://bajablue.mx/tours/ocean-safari" },
  openGraph: {
    title: "Ocean Safari — Day Trip | Bajablue Tours",
    description: "6-hour ocean safari to Cerralvo Island. Orcas, whales, dolphins, mobula rays. From $3,000 Mexican Pesos.",
    url: "https://bajablue.mx/tours/ocean-safari",
    images: [{ url: "/images/tours/ocean-safari.jpg", width: 1200, height: 630 }],
  },
};

export default function OceanSafariPage() {
  const tour = tours.find((t) => t.slug === "ocean-safari")!;
  return <TourDetailPage tour={tour} />;
}
