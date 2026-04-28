import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "copier — website clones",
  description: "A hub of pixel-perfect Next.js clones produced by /clone-website.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
