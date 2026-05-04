import type { Metadata } from "next";
import { tours } from "@/data/site";
import { TourDetailPage } from "@/components/TourDetailPage";

export const metadata: Metadata = {
  title: "Blue Expedition — 3-Day Marine Safari",
  description: "3-day all-inclusive marine expedition in the Sea of Cortez. Accommodation, meals, and daily ocean safaris included. La Ventana, Baja California Sur.",
  alternates: { canonical: "https://bajablue.mx/tours/blue-expedition" },
  openGraph: {
    title: "Blue Expedition — 3-Day Safari | Bajablue Tours",
    description: "3-day all-inclusive marine expedition. Accommodation, meals, daily ocean safaris.",
    url: "https://bajablue.mx/tours/blue-expedition",
    images: [{ url: "/images/tours/blue-expedition.jpg", width: 1200, height: 630 }],
  },
};

export default function BlueExpeditionPage() {
  const tour = tours.find((t) => t.slug === "blue-expedition")!;
  return <TourDetailPage tour={tour} />;
}
