import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "比比信•贷款口碑-bbxin.com",
  description: `找贷款，查询“比比信•贷款口碑-bbxin.com”，找贷款先查贷款产品口碑，贷款产品好坏一查便知。收录全网贷款产品，聚合贷款人口碑反馈，提供贷款产品查询、比对，贷款路上规避风险，“比比信•贷款口碑”致力于为个人和企业提供全面详实的信贷产品口碑信息！`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main className="ley-page">{children}</main>
        <Footer />
        <div className="fixed-qr">
          <img src="/statics/images/qr_code.png" alt="扫码咨询" />
        </div>
      </body>
    </html>
  );
}
