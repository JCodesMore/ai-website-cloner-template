import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-deep pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-display text-warm-white text-3xl tracking-wide mb-4">PRIVACY POLICY</h1>
          <p className="text-warm-white/30 text-sm font-body mb-12">Last updated: April 13, 2026</p>

          <div className="space-y-8 text-warm-white/60 text-sm font-body leading-relaxed">
            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Who We Are</h2>
              <p>Bajablue Tours is a marine expedition tour operator based in La Ventana, Baja California Sur, Mexico. Our website address is https://bajablue.mx. Bajablue is run by its founders and local team members.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">What Data We Collect</h2>
              <p>When you use our contact form, we collect your name, email address, and message content. When you contact us via WhatsApp, your phone number and messages are processed through WhatsApp (Meta Platforms). We do not collect payment information through our website.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To respond to your tour inquiries and booking requests</li>
                <li>To send you trip confirmation details and logistics information</li>
                <li>To improve our website and services based on usage patterns</li>
              </ul>
              <p className="mt-3">We never sell, rent, or share your personal information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Cookies and Analytics</h2>
              <p>We use Google Analytics to understand how visitors interact with our website. Google Analytics uses cookies to collect anonymized usage data including pages visited, time on site, and referring source. You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser Add-on.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Third-Party Services</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Firebase (Google)</strong> — Authentication and data storage for our admin dashboard</li>
                <li><strong>Google Analytics</strong> — Website usage analytics</li>
                <li><strong>WhatsApp (Meta)</strong> — Customer communication</li>
                <li><strong>Vercel</strong> — Website hosting</li>
              </ul>
              <p className="mt-3">Each service has its own privacy policy governing how they handle data.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Data Retention</h2>
              <p>Contact form submissions are retained for 12 months, then deleted. WhatsApp conversations are retained according to WhatsApp&apos;s policies. Analytics data is retained for 26 months (Google Analytics default).</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Your Rights</h2>
              <p>Under Mexico&apos;s Federal Law on Protection of Personal Data (LFPDPPP) and applicable international privacy laws, you have the right to access, rectify, cancel, or oppose the processing of your personal data. To exercise these rights, contact us at info@bajablue.mx or +52 612 348 3865.</p>
            </section>

            <section>
              <h2 className="text-warm-white text-base font-body font-medium mb-3">Contact</h2>
              <p>For privacy-related inquiries:<br />
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
