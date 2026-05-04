"use client";

import { motion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { siteConfig } from "@/data/site";
import { BeamsBackground } from "@/components/ui/beams-background";
import { ContactPageMobile } from "@/components/mobile/ContactPageMobile";
import { events } from "@/lib/analytics";

export default function ContactPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <ContactPageMobile />
      <main className="hidden md:block">
        {/* Hero — animated underwater beams */}
        <BeamsBackground intensity="strong" className="h-[50vh]">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-display text-white text-5xl md:text-8xl tracking-wide">CONTACT</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-white/60 text-sm font-body mt-4">Start your journey today</motion.p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-deep to-transparent z-10" />
        </BeamsBackground>

        <section className="bg-deep py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
            {/* WhatsApp primary */}
            <ScrollReveal>
              <div>
                <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4">Fastest Way</p>
                <h2 className="text-display text-warm-white text-2xl md:text-3xl tracking-wide mb-6">How Do I Book a Tour?</h2>
                <p className="text-warm-white/60 text-sm font-body leading-relaxed mb-8">
                  The fastest way to book a Bajablue expedition is to start a WhatsApp conversation with us. We typically respond within 2 hours during business hours (8am-7pm Mexico City time, 7 days a week). Ask us anything about tour availability, pricing, packing, or how to plan your trip from La Paz or Los Cabos.
                </p>
                <a
                  href={siteConfig.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => events.whatsappClick("contact-page-desktop")}
                  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-8 py-4 font-body text-sm tracking-wide transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>

                <div className="dashed-divider-dark w-full my-10" />

                <div className="space-y-4 text-sm font-body">
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Phone</p>
                    <p className="text-warm-white/70"><a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`} className="hover:text-copper transition-colors">{siteConfig.phone}</a></p>
                  </div>
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-warm-white/70 hover:text-copper transition-colors">{siteConfig.email}</a>
                  </div>
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Location</p>
                    <p className="text-warm-white/50">{siteConfig.address}<br />{siteConfig.city}, {siteConfig.state}<br />{siteConfig.country} {siteConfig.zip}</p>
                  </div>
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Coordinates</p>
                    <p className="text-warm-white/50">24° 03&apos; N, 109° 59&apos; W</p>
                  </div>
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Business Hours</p>
                    <p className="text-warm-white/50">Monday – Sunday<br />8:00 AM – 7:00 PM (CST, UTC−6)</p>
                  </div>
                  <div>
                    <p className="text-warm-white/40 text-xs tracking-[0.3em] uppercase mb-1">Response Time</p>
                    <p className="text-warm-white/50">Typically within 2 hours during business hours.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact form backup */}
            <ScrollReveal direction="right">
              <div>
                <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4">Or Send a Message</p>
                <h2 className="text-display text-warm-white text-2xl tracking-wide mb-6">ENQUIRE</h2>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-warm-white/40 text-xs font-body tracking-[0.3em] uppercase block mb-1">Name</label>
                    <input type="text" className="w-full bg-transparent border-b border-warm-white/15 focus:border-copper py-2 text-sm font-body text-warm-white outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs font-body tracking-[0.3em] uppercase block mb-1">Email</label>
                    <input type="email" className="w-full bg-transparent border-b border-warm-white/15 focus:border-copper py-2 text-sm font-body text-warm-white outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs font-body tracking-[0.3em] uppercase block mb-1">Tour Interest</label>
                    <select className="w-full bg-transparent border-b border-warm-white/15 focus:border-copper py-2 text-sm font-body text-warm-white outline-none transition-colors">
                      <option>Ocean Safari (Day Trip)</option>
                      <option>Blue Expedition (3-Day)</option>
                      <option>Master Seafari (7-Day)</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-warm-white/40 text-xs font-body tracking-[0.3em] uppercase block mb-1">Message</label>
                    <textarea rows={4} className="w-full bg-transparent border-b border-warm-white/15 focus:border-copper py-2 text-sm font-body text-warm-white outline-none transition-colors resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-navy hover:bg-navy/80 text-white py-3.5 font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300">
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* How to get here (F39) */}
        <section className="bg-sand py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <p className="text-copper text-xs font-body tracking-[0.4em] uppercase mb-4 text-center">Getting Here</p>
              <h2 className="text-display text-navy text-2xl md:text-3xl tracking-wide mb-10 text-center">How Do I Get to La Ventana?</h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
              <ScrollReveal direction="left">
                <h3 className="text-display text-navy text-xl tracking-wide mb-4">From La Paz Airport (LAP)</h3>
                <ul className="text-navy/70 text-sm font-body leading-relaxed space-y-2 list-disc list-inside">
                  <li>Drive time: approximately 45 minutes south on Highway 286.</li>
                  <li>Rental car: recommended for flexibility — pick up at the airport, drop off in La Ventana on departure.</li>
                  <li>Private shuttle: ~$80 USD one-way; book via WhatsApp at least 48 hours in advance.</li>
                  <li>Taxi: ~$60 USD; available at the airport curb.</li>
                  <li>Multi-day packages (Blue Expedition, Master Seafari) include round-trip transfer at no extra cost.</li>
                </ul>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <h3 className="text-display text-navy text-xl tracking-wide mb-4">From Los Cabos Airport (SJD)</h3>
                <ul className="text-navy/70 text-sm font-body leading-relaxed space-y-2 list-disc list-inside">
                  <li>Drive time: approximately 2.5 hours north on Federal Highway 1.</li>
                  <li>Rental car: recommended; allow 3 hours total for stops.</li>
                  <li>Private shuttle: ~$220 USD one-way; book in advance.</li>
                  <li>Multi-day packages include round-trip Los Cabos transfer at no extra cost.</li>
                </ul>
              </ScrollReveal>
            </div>

            {/* Google Maps embed (F43) */}
            <ScrollReveal>
              <div className="aspect-[16/9] w-full overflow-hidden border border-navy/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29185.2!2d-109.9876!3d24.0654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDAzJzU1LjQiTiAxMDnCsDU5JzE1LjYiVw!5e0!3m2!1sen!2smx!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bajablue Tours location in La Ventana, Baja California Sur"
                />
              </div>
              <p className="text-navy/50 text-xs font-body text-center mt-4">
                <a href="https://www.google.com/maps/place/La+Ventana,+Baja+California+Sur,+Mexico" target="_blank" rel="noopener noreferrer" className="hover:text-copper transition-colors">
                  Open in Google Maps →
                </a>
              </p>
            </ScrollReveal>
          </div>
        </section>

        <p className="bg-deep text-warm-white/30 text-xs font-body text-center py-6 px-6">
          Last updated: April 2026
        </p>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
