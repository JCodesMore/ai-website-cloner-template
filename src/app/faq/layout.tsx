import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Marine Tour Questions Answered",
  description: "Everything you need to know before your Sea of Cortez expedition. Safety, what to bring, fitness level, booking, cancellation policy, and getting to La Ventana.",
  alternates: { canonical: "https://bajablue.mx/faq" },
  openGraph: {
    title: "FAQ | Bajablue Tours",
    description: "Everything you need to know before your Sea of Cortez expedition.",
    url: "https://bajablue.mx/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
