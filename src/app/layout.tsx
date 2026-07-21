import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import "./zynema-overlay.css";
import { OverlayProvider } from "@/components/overlay/OverlayProvider";

// Display / headings — animesaga uses Outfit (800wt, tight tracking)
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Body — Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AnimeSaga - Watch Anime Online Free",
  description:
    "Stream your favorite anime series and movies in HD. Watch subbed and dubbed anime online free on AnimeSaga.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <OverlayProvider>{children}</OverlayProvider>
      </body>
    </html>
  );
}
