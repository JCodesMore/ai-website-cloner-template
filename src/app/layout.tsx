import type { Metadata } from "next";
import { Instrument_Sans, Plus_Jakarta_Sans, Inter, Roboto_Serif } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

// The source loads all four via Google's WebFont Loader at weights 300–700.
// next/font self-hosts them instead, removing the render-blocking request.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fundup.au"),
  title: {
    default: "Self-Employed Mortgage Broker Australia | FundUp",
    template: "%s | FundUp",
  },
  description:
    "Australia's specialist self-employed mortgage broker. We compare 40+ lenders for home loans, investment loans, refinancing and asset finance.",
  icons: {
    icon: "/seo/favicon.png",
    apple: "/seo/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "FundUp",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
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
      className={`${instrumentSans.variable} ${plusJakarta.variable} ${inter.variable} ${robotoSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {/*
          No top padding here, deliberately. The nav is `position: fixed` and the
          source lets the first section sit underneath it — every hero carries its
          own `padding-top: 140px` to compensate. Padding the wrapper stacked on top
          of that and pushed every page 141px below the live site.

          The five routes that don't open with a hero add their own clearance; see
          docs/research/FIXES.md.
        */}
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
