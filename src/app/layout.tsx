import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Héloïse Thibodeau Architecte",
  description:
    "Héloïse Thibodeau Architecte — Firme d'architecture basée à Montréal, spécialisée en enseignement, sport et loisirs, et bâtiments institutionnels.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full overflow-hidden bg-[#F7F8F9]">{children}</body>
    </html>
  );
}
