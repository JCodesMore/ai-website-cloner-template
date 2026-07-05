import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const halTimezone = localFont({
  variable: "--font-hal-timezone",
  src: [
    {
      path: "../../public/fonts/HALTimezone-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HALTimezone-Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Onday : le nouveau standard du bien-être",
  description:
    "Complément alimentaire tout-en-un à base de vitamines, minéraux, plantes et probiotiques : votre nouvelle routine bien-être complète, simple et efficace.",
  icons: {
    icon: "/seo/favicon.png",
    apple: "/seo/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${poppins.variable} ${halTimezone.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
