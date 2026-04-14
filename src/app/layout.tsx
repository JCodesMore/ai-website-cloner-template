import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HBO Max | Help Center",
  description: "HBO Max Help Center — find answers to common questions.",
  icons: {
    icon: "/seo/favicon.ico",
    shortcut: "/seo/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
