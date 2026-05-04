"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";

const BOOKING_URL = "https://hotels.cloudbeds.com/en/reservation/rmDkzN?currency=mxn";

type Amenity = { icon: React.ReactNode; label: string; detail: string };

const stroke = "currentColor";
const ic = (p: React.ReactNode) => (
  <svg className="w-5 h-5 text-teal-light" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {p}
  </svg>
);

const amenities: Amenity[] = [
  {
    icon: ic(<><path d="M3 18v-6a3 3 0 013-3h12a3 3 0 013 3v6" /><path d="M3 14h18" /><path d="M5 18v2M19 18v2" /></>),
    label: "Private rooms",
    detail: "King, Queen, or Double",
  },
  {
    icon: ic(<><circle cx="12" cy="6" r="2" /><path d="M12 8v4" /><path d="M6 14h12l-1 6H7z" /><path d="M9 17h6" /></>),
    label: "En-suite bath",
    detail: "Hot water, towels",
  },
  {
    icon: ic(<><path d="M5 12.55a11 11 0 0114 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>),
    label: "High-speed wifi",
    detail: "Fiber across the property",
  },
  {
    icon: ic(<><path d="M8 3h8l-1 17a2 2 0 01-2 2h-2a2 2 0 01-2-2L8 3z" /><path d="M8 8h8" /></>),
    label: "Smoothie bar",
    detail: "Fresh fruit + superfoods",
  },
  {
    icon: ic(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>),
    label: "Sea-view terrace",
    detail: "Sunset & sunrise",
  },
  {
    icon: ic(<><path d="M3 11h18l-1 9a2 2 0 01-2 2H6a2 2 0 01-2-2l-1-9z" /><path d="M7 11V7a5 5 0 0110 0v4" /></>),
    label: "Full kitchen",
    detail: "Self-cater anytime",
  },
];

const photos = [
  { src: "/images/accommodations/room-1.jpg", alt: "Private room with ceiling fan and en-suite bathroom" },
  { src: "/images/accommodations/room-2.jpg", alt: "Premium teal bunk bed room for solo travelers" },
  { src: "/images/accommodations/room-3.jpg", alt: "Spacious king-bed room with sliding barn door" },
  { src: "/images/accommodations/room-4.jpg", alt: "Sunset yoga on the terrace overlooking the sea" },
  { src: "/images/accommodations/room-5.jpg", alt: "In-house smoothie bar with fresh fruit" },
  { src: "/images/accommodations/room-6.jpg", alt: "Guests biking outside the hostel" },
];

export function AccommodationsPageMobile() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  function open(idx: number) {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
    setActiveIdx(idx);
  }

  function close() {
    setActiveIdx(null);
  }

  function next() {
    if (activeIdx === null) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    setActiveIdx((activeIdx + 1) % photos.length);
  }

  function prev() {
    if (activeIdx === null) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    setActiveIdx((activeIdx - 1 + photos.length) % photos.length);
  }

  return (
    <div className="md:hidden bg-deep">
      {/* Hero */}
      <section className="relative h-[44dvh] overflow-hidden">
        <img
          src="/images/accommodations/hostel-hero.jpg"
          alt="La Ventana Hostel exterior at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep/30 via-deep/50 to-deep" />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2"
          >
            Your Baja basecamp
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-display text-warm-white text-3xl tracking-wide leading-tight"
          >
            LA VENTANA HOSTEL
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-warm-white/65 text-sm font-body leading-relaxed mt-2"
          >
            Boutique comfort, 5 min from the beach — included with multi-day expeditions.
          </motion.p>
        </div>
      </section>

      {/* Sticky book strip */}
      <div className="sticky top-0 z-20 bg-deep/95 backdrop-blur-md border-b border-warm-white/5 px-5 py-3 flex items-center justify-between">
        <div>
          <p className="text-warm-white/45 text-[10px] font-body tracking-[0.25em] uppercase">From</p>
          <p className="text-warm-white text-base font-body">$65 USD <span className="text-warm-white/45 text-xs">/ night</span></p>
        </div>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
          }}
          className="bg-coral text-deep text-xs font-body font-medium tracking-[0.25em] uppercase px-5 py-2.5 rounded-full active:scale-95 transition-transform"
        >
          Book stay
        </a>
      </div>

      {/* Intro */}
      <section className="px-5 py-7">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-2">More than a hostel</p>
        <h2 className="text-display text-warm-white text-2xl tracking-wide leading-tight mb-4">
          Private rooms with panoramic sea views
        </h2>
        <p className="text-warm-white/70 text-sm font-body leading-relaxed">
          Our basecamp in La Ventana — a 5-minute walk from the beach, 5 minutes from the boat ramp. Private rooms (no dorms),
          en-suite bathrooms, fast wifi, smoothie bar, and a panoramic terrace.
        </p>
        <p className="text-warm-white/50 text-xs font-body leading-relaxed mt-3">
          Included with all Blue Expedition and Master Seafari packages. Also bookable for independent stays.
        </p>
      </section>

      {/* Amenities grid */}
      <section className="px-5 py-4">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-4">What&apos;s included</p>
        <div className="grid grid-cols-2 gap-3">
          {amenities.map((a) => (
            <div
              key={a.label}
              className="bg-white/[0.04] border border-teal/15 rounded-sm p-4"
            >
              <div className="mb-3">{a.icon}</div>
              <p className="text-warm-white text-sm font-body font-medium">{a.label}</p>
              <p className="text-warm-white/50 text-xs font-body mt-0.5">{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="px-3 py-6">
        <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3 px-2">Inside the hostel</p>
        <div className="grid grid-cols-2 gap-2">
          {photos.map((p, idx) => (
            <button
              key={p.src}
              onClick={() => open(idx)}
              className={`relative overflow-hidden rounded-sm active:scale-[0.97] transition-transform ${
                idx === 0 ? "aspect-[3/4] col-span-2" : "aspect-square"
              }`}
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep/30" />
            </button>
          ))}
        </div>
      </section>

      {/* Location info */}
      <section className="px-5 py-6">
        <div className="bg-white/[0.04] border border-teal/15 rounded-sm p-5">
          <p className="text-teal-light text-[10px] font-body tracking-[0.3em] uppercase mb-3">Getting here</p>
          <ul className="space-y-2.5 text-sm font-body">
            <li className="flex items-start gap-3">
              <span className="text-copper text-xs mt-1">●</span>
              <div>
                <p className="text-warm-white">45 min from La Paz Airport (LAP)</p>
                <p className="text-warm-white/45 text-xs">Recommended: rent a car or shared shuttle</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-copper text-xs mt-1">●</span>
              <div>
                <p className="text-warm-white">2.5 hrs from Los Cabos (SJD)</p>
                <p className="text-warm-white/45 text-xs">Direct route on Hwy 1 / Hwy 286</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-copper text-xs mt-1">●</span>
              <div>
                <p className="text-warm-white">5 min walk to the beach</p>
                <p className="text-warm-white/45 text-xs">5 min drive to the public boat ramp</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-8">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
          }}
          className="block w-full bg-coral text-deep text-center text-sm font-body font-medium tracking-[0.25em] uppercase py-4 rounded-sm active:scale-[0.99] transition-transform"
        >
          Check availability →
        </a>
        <p className="text-warm-white/40 text-[11px] font-body text-center mt-3 leading-relaxed">
          Booked through CloudBeds · MXN or USD · Free cancellation up to 7 days
        </p>
      </section>

      <p className="text-warm-white/30 text-[10px] font-body text-center py-6">
        24° 03&apos; N · 109° 59&apos; W · La Ventana, Baja California Sur
      </p>

      {/* Lightbox */}
      <Drawer.Root
        open={activeIdx !== null}
        onOpenChange={(o) => {
          if (!o) close();
        }}
        direction="bottom"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black z-[200]" />
          <Drawer.Content className="fixed inset-0 z-[201] bg-deep flex flex-col touch-none">
            <Drawer.Title className="sr-only">Hostel photo viewer</Drawer.Title>
            <Drawer.Description className="sr-only">Swipe to navigate.</Drawer.Description>

            <div className="flex items-center justify-between p-4 z-10">
              <span className="text-warm-white/50 text-xs font-body tabular-nums">
                {activeIdx !== null ? `${activeIdx + 1} / ${photos.length}` : ""}
              </span>
              <button
                onClick={close}
                aria-label="Close"
                className="w-10 h-10 rounded-full bg-deep/60 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg className="w-4 h-4 text-warm-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeIdx !== null && (
                  <motion.img
                    key={activeIdx}
                    src={photos[activeIdx].src}
                    alt={photos[activeIdx].alt}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -80) next();
                      else if (info.offset.x > 80) prev();
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-full max-h-full w-auto h-auto object-contain touch-pan-y"
                    draggable={false}
                  />
                )}
              </AnimatePresence>

              <button onClick={prev} aria-label="Previous" className="absolute left-0 top-0 bottom-0 w-1/4 z-10" />
              <button onClick={next} aria-label="Next" className="absolute right-0 top-0 bottom-0 w-1/4 z-10" />
            </div>

            <div className="p-5 pb-8 z-10">
              {activeIdx !== null && (
                <p className="text-warm-white/60 text-xs font-body leading-relaxed text-center max-w-md mx-auto">
                  {photos[activeIdx].alt}
                </p>
              )}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-4 bg-coral text-deep text-center text-xs font-body font-medium tracking-[0.25em] uppercase py-3 rounded-sm active:scale-[0.99] transition-transform"
              >
                Book this room →
              </a>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
