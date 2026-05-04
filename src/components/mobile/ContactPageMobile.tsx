"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";

export function ContactPageMobile() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", tour: "Ocean Safari (Day Trip)", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
    // Compose WhatsApp message
    const msg = encodeURIComponent(
      `Hi, I'm ${form.name}.\n\nI'd like to book the ${form.tour}.\n\n${form.message}\n\nReply: ${form.email}`
    );
    window.open(`${siteConfig.whatsappLink}?text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="md:hidden bg-deep">
      {/* Hero — animated gradient (no heavy beams on mobile) */}
      <section className="relative h-[34dvh] overflow-hidden bg-gradient-to-br from-navy via-deep to-deep-light">
        {/* Subtle animated orbs for depth */}
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-teal/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-20 w-72 h-72 rounded-full bg-copper/15 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
          >
            Start the journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-tight"
          >
            CONTACT
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-warm-white/60 text-xs font-body mt-2"
          >
            We respond within 2 hours · 7 days a week
          </motion.p>
        </div>
      </section>

      {/* Quick action buttons — primary touch targets */}
      <section className="px-5 py-6 space-y-2.5">
        <a
          href={siteConfig.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
            events.whatsappClick("contact-page-primary");
          }}
          className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-4 rounded-sm active:scale-[0.98] transition-transform"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <div className="flex-1">
            <p className="text-white text-sm font-body font-medium">WhatsApp us</p>
            <p className="text-white/70 text-[11px] font-body">Fastest reply · usually within 2 hrs</p>
          </div>
          <span className="text-white/80 text-base">→</span>
        </a>

        <a
          href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
          }}
          className="flex items-center gap-3 bg-white/[0.04] border border-teal/20 text-warm-white px-5 py-4 rounded-sm active:scale-[0.98] transition-transform"
        >
          <svg className="w-5 h-5 text-teal-light flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
          <div className="flex-1">
            <p className="text-warm-white text-sm font-body font-medium">Call directly</p>
            <p className="text-warm-white/55 text-[11px] font-body">{siteConfig.phone}</p>
          </div>
          <span className="text-warm-white/60 text-base">→</span>
        </a>

        <a
          href={`mailto:${siteConfig.email}`}
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
          }}
          className="flex items-center gap-3 bg-white/[0.04] border border-teal/20 text-warm-white px-5 py-4 rounded-sm active:scale-[0.98] transition-transform"
        >
          <svg className="w-5 h-5 text-teal-light flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <div className="flex-1">
            <p className="text-warm-white text-sm font-body font-medium">Send an email</p>
            <p className="text-warm-white/55 text-[11px] font-body">{siteConfig.email}</p>
          </div>
          <span className="text-warm-white/60 text-base">→</span>
        </a>
      </section>

      {/* Form — secondary path */}
      <section className="px-5 py-4">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Or send a message</p>
        <h2 className="text-display text-warm-white text-xl tracking-wide mb-4">Quick enquiry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.25em] uppercase block mb-1.5">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/[0.04] border border-teal/15 focus:border-teal-light focus:bg-white/[0.06] rounded-sm px-4 py-3 text-sm font-body text-warm-white outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.25em] uppercase block mb-1.5">Email</label>
            <input
              type="email"
              required
              inputMode="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/[0.04] border border-teal/15 focus:border-teal-light focus:bg-white/[0.06] rounded-sm px-4 py-3 text-sm font-body text-warm-white outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.25em] uppercase block mb-1.5">Tour interest</label>
            <select
              value={form.tour}
              onChange={(e) => setForm({ ...form, tour: e.target.value })}
              className="w-full bg-white/[0.04] border border-teal/15 focus:border-teal-light focus:bg-white/[0.06] rounded-sm px-4 py-3 text-sm font-body text-warm-white outline-none transition-all appearance-none"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2390cdcd' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "12px",
              }}
            >
              <option>Ocean Safari (Day Trip)</option>
              <option>Blue Expedition (3-Day)</option>
              <option>Master Seafari (7-Day)</option>
              <option>Not sure yet</option>
            </select>
          </div>
          <div>
            <label className="text-warm-white/40 text-[10px] font-body tracking-[0.25em] uppercase block mb-1.5">Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/[0.04] border border-teal/15 focus:border-teal-light focus:bg-white/[0.06] rounded-sm px-4 py-3 text-sm font-body text-warm-white outline-none transition-all resize-none"
              placeholder="Dates, group size, questions..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-coral text-deep py-3.5 rounded-sm font-body text-xs font-medium tracking-[0.25em] uppercase active:scale-[0.99] transition-transform"
          >
            {sent ? "Opening WhatsApp..." : "Send →"}
          </button>
          <p className="text-warm-white/40 text-[10px] font-body text-center">
            Sends via WhatsApp for fastest reply
          </p>
        </form>
      </section>

      {/* Hours + location */}
      <section className="px-5 py-6 space-y-4">
        <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-4">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Hours</p>
          <p className="text-warm-white text-sm font-body">Mon – Sun · 8:00 AM – 7:00 PM</p>
          <p className="text-warm-white/45 text-xs font-body mt-1">CST (UTC−6) · La Ventana, Mexico</p>
        </div>
        <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-4">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">Location</p>
          <p className="text-warm-white text-sm font-body">{siteConfig.address}</p>
          <p className="text-warm-white/65 text-sm font-body">
            {siteConfig.city}, {siteConfig.state}, {siteConfig.country} {siteConfig.zip}
          </p>
          <p className="text-warm-white/45 text-xs font-body mt-2">24° 03&apos; N · 109° 59&apos; W</p>
        </div>
      </section>

      {/* Getting here — collapsible cards */}
      <section className="px-5 py-6">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3">Getting here</p>
        <div className="space-y-3">
          <details className="bg-white/[0.04] border border-teal/15 rounded-sm group">
            <summary className="px-4 py-3.5 cursor-pointer flex items-center justify-between list-none">
              <div>
                <p className="text-warm-white text-sm font-body font-medium">From La Paz (LAP)</p>
                <p className="text-warm-white/45 text-[11px] font-body">45 min south · Hwy 286</p>
              </div>
              <span className="text-teal-light text-base group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="px-4 pb-4 pt-0">
              <ul className="text-warm-white/65 text-xs font-body leading-relaxed space-y-2 list-disc list-inside">
                <li>Rental car: best for flexibility — pick up at airport</li>
                <li>Private shuttle: ~$80 USD one-way (book 48 hrs ahead)</li>
                <li>Taxi: ~$60 USD from airport curb</li>
                <li>Multi-day packages include round-trip transfer free</li>
              </ul>
            </div>
          </details>

          <details className="bg-white/[0.04] border border-teal/15 rounded-sm group">
            <summary className="px-4 py-3.5 cursor-pointer flex items-center justify-between list-none">
              <div>
                <p className="text-warm-white text-sm font-body font-medium">From Los Cabos (SJD)</p>
                <p className="text-warm-white/45 text-[11px] font-body">2.5 hrs north · Hwy 1</p>
              </div>
              <span className="text-teal-light text-base group-open:rotate-180 transition-transform">⌄</span>
            </summary>
            <div className="px-4 pb-4 pt-0">
              <ul className="text-warm-white/65 text-xs font-body leading-relaxed space-y-2 list-disc list-inside">
                <li>Rental car: allow 3 hrs total for stops</li>
                <li>Private shuttle: ~$220 USD one-way</li>
                <li>Multi-day packages include round-trip transfer free</li>
              </ul>
            </div>
          </details>
        </div>

        <a
          href="https://www.google.com/maps/place/La+Ventana,+Baja+California+Sur,+Mexico"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-center text-teal-light text-xs font-body tracking-[0.2em] uppercase py-3 border border-teal/30 rounded-sm active:scale-[0.99] transition-transform"
        >
          Open in Google Maps →
        </a>
      </section>

      <p className="text-warm-white/30 text-[10px] font-body text-center py-6">
        Last updated April 2026
      </p>
    </div>
  );
}
