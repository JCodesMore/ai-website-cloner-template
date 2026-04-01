import type { Metadata } from "next";
import { Montserrat, Red_Hat_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const redHatDisplay = Red_Hat_Display({
  variable: "--font-red-hat-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Lion Global Sales Consulting — Real Estate & Investment Advisory",
  description: "Institutional-grade real estate consulting and investment advisory across 18 global markets.",
  icons: {
    icon: "/seo/favicon.ico",
    apple: "/seo/logo192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${redHatDisplay.variable} h-full antialiased`}>
      <head>
        {/* Adobe Fonts (Typekit) for gravesend-sans */}
        <link rel="stylesheet" href="https://use.typekit.net/llc7hpe.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
