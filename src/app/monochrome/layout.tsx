import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./monochrome.css";

// Inter is the closest free substitute for neue-haas-unica (a Helvetica grotesque)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Noto Sans JP stands in for YakuHanJP + Japanese fallback
const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Monochrome",
  description:
    "未来に残したい景色をつくる。建材一体型太陽光パネルで、エネルギーをつくり、かしこく使う。",
  metadataBase: new URL("https://www.monochrome.so"),
  icons: {
    icon: [
      { url: "/clones/monochrome/seo/favicon.ico" },
      { url: "/clones/monochrome/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/clones/monochrome/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/clones/monochrome/seo/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/clones/monochrome/seo/apple-touch-icon-57x57.png", sizes: "57x57" },
      { url: "/clones/monochrome/seo/apple-touch-icon-60x60.png", sizes: "60x60" },
      { url: "/clones/monochrome/seo/apple-touch-icon-72x72.png", sizes: "72x72" },
      { url: "/clones/monochrome/seo/apple-touch-icon-76x76.png", sizes: "76x76" },
      { url: "/clones/monochrome/seo/apple-touch-icon-114x114.png", sizes: "114x114" },
      { url: "/clones/monochrome/seo/apple-touch-icon-120x120.png", sizes: "120x120" },
      { url: "/clones/monochrome/seo/apple-touch-icon-144x144.png", sizes: "144x144" },
      { url: "/clones/monochrome/seo/apple-touch-icon-152x152.png", sizes: "152x152" },
    ],
  },
};

/**
 * Monochrome.so clone scope.
 *
 * Wraps the route subtree with the clone's font CSS variables and a
 * `data-clone` hook used by monochrome.css to scope its body styles.
 * This way the clone's tokens never leak into other routes.
 */
export default function MonochromeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-clone="monochrome"
      className={`${inter.variable} ${notoSansJp.variable} antialiased`}
    >
      {children}
    </div>
  );
}
