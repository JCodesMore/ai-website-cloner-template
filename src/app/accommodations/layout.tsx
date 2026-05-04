import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Ventana Hostel — Your Base for Ocean Adventures",
  description: "Stay at our boutique hostel in La Ventana. Private rooms, smoothie bar, panoramic terrace with Sea of Cortez views. Included with multi-day expeditions.",
  alternates: { canonical: "https://bajablue.mx/accommodations" },
  openGraph: {
    title: "Accommodations | Bajablue Tours",
    description: "Boutique hostel in La Ventana, BCS. Included with multi-day expeditions.",
    url: "https://bajablue.mx/accommodations",
  },
};

export default function AccommodationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
