import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DODOMIO Robotics",
  description: "DODOMIO website giới thiệu robot AI, giải pháp AI và đăng ký demo.",
  icons: {
    icon: "/images/dodo/dodomio.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
