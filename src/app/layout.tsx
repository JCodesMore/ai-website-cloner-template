import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/sites/showlanka/inline-script";
import { preloaderScript } from "@/components/sites/showlanka/preloader-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Clone",
  description: "Pixel-perfect website clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Page scripts may tag <html> before hydration (e.g. the showlanka preloader).
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Browser extensions (Grammarly, ColorZilla, …) add attributes to <body> before hydration. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <InlineScript id="sl-preloader" code={preloaderScript} />
        {children}
      </body>
    </html>
  );
}
