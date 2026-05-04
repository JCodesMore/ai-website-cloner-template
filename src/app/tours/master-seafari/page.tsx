import type { Metadata } from "next";
import { tours } from "@/data/site";
import { TourDetailPage } from "@/components/TourDetailPage";
import { SeasonalEventSchema } from "@/components/SchemaMarkup";

export const metadata: Metadata = {
  title: "Master Seafari — 7-Day Immersive Marine Expedition",
  description: "The ultimate Sea of Cortez experience. 5 days on the water, 7 days total. All-inclusive: private room, meals, transfers, and trip media when conditions allow. $54,000 Mexican Pesos.",
  alternates: { canonical: "https://bajablue.mx/tours/master-seafari" },
  openGraph: {
    title: "Master Seafari — 7-Day Expedition | Bajablue Tours",
    description: "Ultimate 7-day immersive marine expedition. $54,000 Mexican Pesos all-inclusive.",
    url: "https://bajablue.mx/tours/master-seafari",
    images: [{ url: "/images/tours/master-seafari.jpg", width: 1200, height: 630 }],
  },
};

export default function MasterSeafariPage() {
  const tour = tours.find((t) => t.slug === "master-seafari")!;
  return (
    <>
      <SeasonalEventSchema
        name="Master Seafari — Orca & Mobula Ray Season 2026"
        startDate="2026-04-01"
        endDate="2026-06-30"
        description="The peak season for observing orcas, watching humpback whales, and witnessing massive mobula ray aggregations in the Sea of Cortez. 7-day all-inclusive immersive expedition from La Ventana, Baja California Sur."
        url="https://bajablue.mx/tours/master-seafari"
      />
      <TourDetailPage tour={tour} />
    </>
  );
}
