import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-deep pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-4">TERMS OF SERVICE</h1>
          <p className="text-warm-white/30 text-sm font-body mb-12">Last updated: April 13, 2026</p>

          <div className="space-y-8 text-warm-white/60 text-sm font-body leading-relaxed">
            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Booking and Reservations</h2>
              <p>All tour bookings are made through WhatsApp (+52 612 348 3865) or our contact form. A booking is confirmed only after you receive written confirmation from Bajablue Tours and any required deposit has been received. Availability is limited and subject to weather, sea conditions, and group size.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Pricing and Payment</h2>
              <p>All prices are listed in Mexican Pesos (MXN) unless otherwise stated. Prices are per person for shared boat tours or per group for private charters. Payment methods and deposit requirements are communicated at the time of booking confirmation. Prices are subject to change without notice for future bookings.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Cancellation Policy</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Guest cancellation (7+ days before):</strong> Full refund minus processing fees</li>
                <li><strong>Guest cancellation (3-6 days before):</strong> 50% refund</li>
                <li><strong>Guest cancellation (less than 72 hours):</strong> No refund</li>
                <li><strong>Weather cancellation by Bajablue:</strong> Full refund or reschedule at no cost</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>
              <p className="mt-3">Weather-related cancellations are at the sole discretion of the Bajablue team based on sea conditions and passenger safety.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Safety and Liability</h2>
              <p>Open-ocean marine expeditions involve inherent risks including but not limited to: rough sea conditions, wildlife encounters, sun exposure, and physical exertion. Participants must be able to swim and be in reasonable physical condition. Children under 12 must be accompanied by a parent or guardian. Bajablue Tours carries liability insurance for all tours. By booking, you acknowledge the inherent risks of ocean-based activities.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Health Requirements</h2>
              <p>No prior diving or snorkeling experience is required for our tours. Basic swimming ability is necessary. If you have heart conditions, respiratory issues, or are pregnant, please consult your doctor before booking and inform us at the time of reservation. Participants under the influence of alcohol or drugs will not be permitted to join tours. No refund will be issued in this case.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Wildlife Interaction</h2>
              <p>Bajablue Tours follows responsible wildlife interaction guidelines. We do not chase, touch, feed, or harass marine animals. Wildlife sightings are natural and cannot be guaranteed, though our local crew knows these waters and seasonal patterns well.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Photography and Media</h2>
              <p>Bajablue Tours may take photos and videos during expeditions for promotional use. By participating, you consent to the use of your likeness in our marketing materials. If you prefer not to be photographed, please inform your guide before departure.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Contact</h2>
              <p>For questions about these terms:<br />
                Bajablue Tours<br />
                Calle Medusa, Ejido El Sargento<br />
                23232 La Ventana, B.C.S., Mexico<br />
                info@bajablue.mx<br />
                +52 612 348 3865
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
