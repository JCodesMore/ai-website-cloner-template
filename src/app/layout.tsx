import type { Metadata } from "next";
import { Lato, Radley, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { DataStoreProvider } from "@/lib/data-store";

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
});

const radley = Radley({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARS Intelligence — La forma simple de hacer que todo funcione",
  description:
    "Plataforma de monitoreo inteligente con IA: video analítica, reconocimiento facial, LPR, detección de personas y EPP, y alertas en tiempo real.",
  metadataBase: new URL("https://arsintelligence.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${lato.variable} ${radley.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-background text-foreground overflow-x-hidden"
        suppressHydrationWarning
      >
        <I18nProvider>
          <DataStoreProvider>{children}</DataStoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
