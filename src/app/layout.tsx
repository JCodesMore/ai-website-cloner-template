import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FloatingQR from "@/components/FloatingQR";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "银脉圈-贷款随心选-yinmaiquan.com",
  description: `找贷款，查询"银脉圈-贷款随心选-yinmaiquan.com"，找贷款先查贷款产品口碑，贷款产品好坏一查便知。收录全网贷款产品，聚合贷款人口碑反馈，提供贷款产品查询、比对，贷款路上规避风险，"银脉圈-贷款随心选"致力于为个人和企业提供全面详实的信贷产品口碑信息！`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}>
        <Nav />
        <main className="min-h-[calc(100vh-64px-300px)] pt-16">{children}</main>
        <Footer />
        <FloatingQR />
      </body>
    </html>
  );
}
