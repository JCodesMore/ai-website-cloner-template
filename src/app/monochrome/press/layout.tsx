import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ニュース | Monochrome",
};

export default function PressLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
