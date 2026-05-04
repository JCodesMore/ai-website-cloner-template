import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Book Your Marine Expedition",
  description: "Ready to swim Baja's wild side? Message us on WhatsApp or fill out our contact form. La Ventana, Baja California Sur, Mexico.",
  alternates: { canonical: "https://bajablue.mx/contact" },
  openGraph: {
    title: "Contact | Bajablue Tours",
    description: "Book your marine expedition. WhatsApp or contact form.",
    url: "https://bajablue.mx/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
