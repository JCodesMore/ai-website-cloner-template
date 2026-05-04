import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine Expeditions — Ocean Safari, Blue Expedition & Master Seafari",
  description:
    "Choose your Sea of Cortez adventure. Day trips from $3,000 Mexican Pesos or multi-day safaris swimming with orcas, whale sharks, and mobula rays from La Ventana, Mexico.",
  alternates: { canonical: "https://bajablue.mx/tours" },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
