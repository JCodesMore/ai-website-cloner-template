import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-primary",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Leading Cards | Secure Virtual Cards for Media Buyers & Advertisers",
  description:
    "LeadingCards offers secure, flexible virtual cards for media buyers and advertisers. Instantly issue cards, manage ad spend, and scale campaigns with ease.",
  openGraph: {
    title: "Leading Cards | Secure Virtual Cards for Media Buyers & Advertisers",
    description:
      "LeadingCards offers secure, flexible virtual cards for media buyers and advertisers. Instantly issue cards, manage ad spend, and scale campaigns with ease.",
    images: ["/seo/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leading Cards | Secure Virtual Cards for Media Buyers & Advertisers",
    description:
      "LeadingCards offers secure, flexible virtual cards for media buyers and advertisers. Instantly issue cards, manage ad spend, and scale campaigns with ease.",
    images: ["/seo/og-image.png"],
  },
  icons: {
    icon: "/seo/favicon.svg",
    apple: "/seo/webclip.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
