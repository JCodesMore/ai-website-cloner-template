import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bajablue Tours collects, uses, and protects your personal information.",
  alternates: { canonical: "https://bajablue.mx/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
