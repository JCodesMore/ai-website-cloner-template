import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Oswald, Inter_Tight } from "next/font/google";
import { LocalBusinessSchema, WebSiteSchema, OrganizationSchema } from "@/components/SchemaMarkup";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileChrome } from "@/components/mobile/MobileChrome";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const cleanEnv = (value?: string) => value?.replace(/\\n/g, "").trim();

const GA_ID = cleanEnv(process.env.NEXT_PUBLIC_GA_ID);
const UMAMI_WEBSITE_ID = cleanEnv(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
const UMAMI_SCRIPT_URL =
  cleanEnv(process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL) || "https://cloud.umami.is/script.js";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const interTight = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bajablue.mx"),
  title: {
    default: "Bajablue Tours | Marine Expeditions in the Sea of Cortez — La Ventana, Mexico",
    template: "%s | Bajablue Tours",
  },
  description:
    "Small-group marine expeditions from La Ventana, BCS. Swim with mobula rays and dolphins, and observe orcas and whales in the Sea of Cortez.",
  keywords: [
    "whale watching La Ventana",
    "orca diving Baja",
    "Sea of Cortez marine tours",
    "snorkeling La Ventana BCS",
    "swim with mobula rays",
    "marine expeditions Mexico",
    "Baja California Sur tours",
    "ocean safari La Ventana",
    "whale watching Baja",
    "La Ventana diving tours",
    "eco tourism Mexico",
    "marine wildlife tours",
    "Bajablue Tours",
  ],
  authors: [{ name: "Bajablue Tours" }],
  creator: "Bajablue Tours",
  publisher: "Bajablue Tours",
  openGraph: {
    title: "Bajablue Tours | Marine Expeditions in the Sea of Cortez",
    description:
      "Small-group marine expeditions from La Ventana, Mexico. Swim with mobula rays and dolphins, and observe orcas and whales in the Sea of Cortez.",
    url: "https://bajablue.mx",
    siteName: "Bajablue Tours",
    locale: "en_US",
    // alternateLocale removed — no Spanish version exists
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bajablue Tours — Marine Expeditions in the Sea of Cortez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bajablue Tours | Marine Expeditions in the Sea of Cortez",
    description:
      "Small-group marine expeditions from La Ventana, Mexico. Swim with mobula rays and dolphins, and observe orcas and whales in the Sea of Cortez.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bajablue.mx",
  },
  verification: {
    google: "hafvtYo-9sJ6nPzShON8O4wYnzLhb0LIu0dlh1Ge3Ns",
  },
  category: "travel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A1C24",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${interTight.variable} h-full antialiased`}
    >
      <head>
        {/* Domain verification */}
        <meta name="p:domain_verify" content="60cc1ec4d2849f2475c9d36163f07ded" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://wa.me" />

        {/* DNS prefetch for non-critical origins */}
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0A1C24" />

        {/* Schema markup — global */}
        <LocalBusinessSchema />
        <WebSiteSchema />
        <OrganizationSchema />
        {UMAMI_WEBSITE_ID && (
          <script
            defer
            src={UMAMI_SCRIPT_URL}
            data-website-id={UMAMI_WEBSITE_ID}
            data-host-url="https://api-gateway.umami.dev"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col font-body text-warm-white bg-deep pb-[68px] md:pb-0">
        {children}
        <MobileChrome />
        <WhatsAppButton />
        {/* Baja Swarm embeddable Bubbles concierge — bottom-left.
            The widget hardcodes its own bot API endpoint (Tailscale Funnel
            on ai-studio.tail50dc5a.ts.net) and rejects data-api overrides
            via an internal allowlist. CORS for bajablue.mx is whitelisted
            on the bot server itself. */}
        <Script
          src="https://bajaswarm.com/widgets/concierge.js"
          data-bot-id="bajablue"
          data-position="bottom-left"
          strategy="afterInteractive"
        />
        {/* Rebrand the chat header to "Bajablue" — the widget hardcodes
            "Baja Swarm" in the header markup instead of using the
            business_name returned from /web/start. The footer stays as
            "Powered by Baja Swarm" (already correct in the widget). */}
        <Script id="bs-rebrand-header" strategy="afterInteractive">
          {`(function(){
            var BRAND = "Bajablue";
            var LOGO = "/images/logos/bajablue-mark.svg?v=2";
            function rebrand(panel){
              var titleEl = panel.querySelector(".bs-header strong");
              if (titleEl && titleEl.textContent !== BRAND) {
                titleEl.textContent = BRAND;
              }
              var logoEl = panel.querySelector(".bs-header img");
              if (logoEl) {
                if (logoEl.getAttribute("src") !== LOGO) logoEl.setAttribute("src", LOGO);
                logoEl.setAttribute("alt", BRAND);
              }
              panel.setAttribute("aria-label", BRAND + " concierge chat");
              var mascot = document.getElementById("bs-concierge-mascot");
              if (mascot) mascot.setAttribute("aria-label", "Chat with " + BRAND);
            }
            function tryRebrand(){
              var p = document.getElementById("bs-concierge-panel");
              if (p) { rebrand(p); return true; }
              return false;
            }
            if (!tryRebrand()){
              var obs = new MutationObserver(function(){
                if (tryRebrand()) obs.disconnect();
              });
              obs.observe(document.body, { childList: true, subtree: true });
              setTimeout(function(){ obs.disconnect(); }, 30000);
            }
          })();`}
        </Script>
        {/* Vercel-native analytics — page views + Core Web Vitals */}
        <Analytics />
        <SpeedInsights />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
