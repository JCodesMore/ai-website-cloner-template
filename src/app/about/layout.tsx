import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Small-Group Marine Expeditions",
  description: "Founded in La Ventana, Mexico. Bajablue Tours connects small groups with the Sea of Cortez's most memorable marine wildlife encounters.",
  alternates: { canonical: "https://bajablue.mx/about" },
  openGraph: {
    title: "About Us | Bajablue Tours",
    description: "Small-group marine expeditions run by Bajablue's founders and local team members.",
    url: "https://bajablue.mx/about",
    type: "article",
    publishedTime: "2026-04-13T00:00:00.000Z",
    modifiedTime: "2026-04-13T00:00:00.000Z",
    authors: ["Bajablue Tours"],
  },
  other: {
    "article:published_time": "2026-04-13T00:00:00.000Z",
    "article:modified_time": "2026-04-13T00:00:00.000Z",
    "article:author": "Bajablue Tours",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
