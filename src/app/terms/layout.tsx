import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Booking terms, cancellation policy, and conditions for Bajablue Tours marine expeditions.",
  alternates: { canonical: "https://bajablue.mx/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
