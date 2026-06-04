import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Dr. Kegel: for Men's Health",
  description: "Adquira Seu Plano De Bem-Estar Sexual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
