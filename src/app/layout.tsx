import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "Home - Aurora",
  description:
    "Welcome to Aurora, your partner in innovative digital marketing solutions.",
  icons: {
    icon: [
      { url: "/seo/favicon.ico" },
      { url: "/seo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/seo/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/seo/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/seo/site.webmanifest",
  openGraph: {
    title: "Aurora Agency",
    description:
      "Where luxury outdoor meets glamping excellence, integrated marketing and communication, across the world.",
    images: ["/seo/og.jpg"],
  },
  appleWebApp: { title: "Aurora" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
