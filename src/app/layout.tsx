import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VertexLink Inc — Broadband, TV & Mobile Services in Sacramento, CA",
  description:
    "VertexLink Inc provides fast, secure, and reliable broadband, streaming TV, mobile, and home-security services to Sacramento and Northern California.",
  keywords: [
    "VertexLink",
    "Sacramento broadband",
    "California ISP",
    "Internet Services",
    "Streaming TV",
    "Home Security",
  ],
  icons: {
    icon: "/seo/favicon.png",
    apple: [
      { url: "/seo/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/seo/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/seo/apple-touch-icon-114x114.png", sizes: "114x114" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-body font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
