import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marine Wildlife Gallery — Orcas, Whales, Mobula Rays",
  description: "Marine wildlife photography from our Sea of Cortez expeditions. Orcas, humpback whales, mobula rays, dolphins, and sea lions captured in their natural habitat.",
  alternates: { canonical: "https://bajablue.mx/gallery" },
  openGraph: {
    title: "Gallery | Bajablue Tours",
    description: "Marine wildlife photography from Sea of Cortez expeditions.",
    url: "https://bajablue.mx/gallery",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
