import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Handhold",
  description:
    "Capture quality leads 24/7 and free up sales team's time with personalised, multilingual AI demos and 1-to-1 onboarding",
  icons: {
    icon: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/favicon.svg",
    shortcut: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/favicon.ico",
    apple: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
