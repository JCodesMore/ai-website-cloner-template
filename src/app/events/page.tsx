import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventsPageClient } from "@/components/events/EventsPageClient";

export const metadata: Metadata = {
  title: "Events — CSULBreach",
  description: "Upcoming CSULBreach CyberSecurity Club events",
};

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <EventsPageClient />
      </main>
      <Footer />
    </>
  );
}
