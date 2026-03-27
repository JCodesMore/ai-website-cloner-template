import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimplyBook.me — Free Appointment Booking System",
  description:
    "Online Booking System for all service businesses. Get your own booking website with advanced features. Start free — no credit card required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
