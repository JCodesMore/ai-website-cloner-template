import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ジャーナル | Monochrome",
};

export default function JournalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
