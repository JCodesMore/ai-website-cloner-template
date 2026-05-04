"use client";

import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { tours, getWetravelUrl, siteConfig } from "@/data/site";
import { events } from "@/lib/analytics";

type BookingDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTourSlug?: string;
};

export function BookingDrawer({ open, onOpenChange, initialTourSlug }: BookingDrawerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialTourSlug ?? tours[0].slug);
  const selected = tours.find((t) => t.slug === selectedSlug) ?? tours[0];

  // WeTravel URL is read from env-driven config. When null (current state, while
  // the WeTravel trips are still being created), the primary CTA flips to a
  // clear "booking opens soon" path that routes to WhatsApp instead of silently
  // failing or sending guests to a fabricated URL.
  const wetravelUrl = getWetravelUrl(selectedSlug);
  const bookingReady = wetravelUrl !== null;

  // Track drawer open with tour context
  useEffect(() => {
    if (open) events.bookingDrawerOpen(initialTourSlug ?? selectedSlug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialTourSlug]);

  function handleBook() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(30);
    }
    if (!wetravelUrl) {
      // Booking not yet available — fall back to WhatsApp with a clear preset
      // message rather than masking the missing-URL state.
      events.whatsappClick(`booking-drawer-fallback-${selectedSlug}`);
      const fallbackMsg = encodeURIComponent(
        `Hi — I'd like to book the ${selected.name} but the online booking page isn't live yet. Can you walk me through it?`
      );
      window.location.href = `${siteConfig.whatsappLink}?text=${fallbackMsg}`;
      return;
    }
    events.bookingWeTravelClick(selectedSlug, selected.name, "mobile-drawer");
    window.location.href = `${wetravelUrl}?utm_source=bajablue&utm_medium=mobile-drawer&utm_campaign=${selectedSlug}`;
  }

  const askWhatsAppHref = `${siteConfig.whatsappLink}?text=${encodeURIComponent(
    `Hi! I'd like to ask about the ${selected.name} tour.`
  )}`;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/70 z-[200]" />
        <Drawer.Content className="bg-deep-light border-t border-teal/20 flex flex-col rounded-t-2xl mt-24 fixed bottom-0 left-0 right-0 z-[201] max-h-[92vh]">
          <Drawer.Title className="sr-only">Book your expedition</Drawer.Title>
          <Drawer.Description className="sr-only">
            Pick a tour and continue to {bookingReady ? "WeTravel checkout" : "message us on WhatsApp"}.
          </Drawer.Description>

          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-warm-white/20 my-3" />

          <div className="px-6 pb-8 overflow-y-auto">
            <p className="text-warm-white/40 text-[10px] font-body tracking-[0.4em] uppercase mb-2">
              Step 1 · pick a tour
            </p>
            <h2 className="text-display text-warm-white text-2xl tracking-wide mb-5">BOOK YOUR EXPEDITION</h2>

            <div className="space-y-2 mb-6">
              {tours.map((t) => (
                <button
                  key={t.slug}
                  onClick={() => {
                    setSelectedSlug(t.slug);
                    events.bookingTourSelected(t.slug, t.name);
                    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
                  }}
                  className={`w-full text-left p-4 rounded-sm border transition-colors ${
                    selectedSlug === t.slug
                      ? "bg-teal/15 border-teal/40"
                      : "bg-white/[0.03] border-white/10 active:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-warm-white font-body font-medium">{t.name}</span>
                    <span className="text-teal-light text-sm font-body tabular-nums">{t.pricePerPerson}</span>
                  </div>
                  <p className="text-warm-white/50 text-xs font-body">
                    {t.duration} · {t.season}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-sm p-4 mb-6">
              <p className="text-warm-white/40 text-[10px] font-body tracking-[0.3em] uppercase mb-2">Selected</p>
              <p className="text-warm-white text-base font-body font-medium">{selected.name}</p>
              <p className="text-warm-white/60 text-sm font-body mt-1 leading-relaxed">{selected.tagline}</p>
              <p className="text-teal-light text-base font-body font-medium mt-3 tabular-nums">{selected.pricePerPerson}</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBook}
                className="w-full bg-coral text-deep py-4 text-sm font-body tracking-[0.2em] uppercase rounded-sm font-medium active:scale-[0.98] transition-transform"
              >
                {bookingReady
                  ? "Continue to WeTravel →"
                  : "Booking opens soon — message us on WhatsApp →"}
              </button>
              <a
                href={askWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => events.whatsappClick(`booking-drawer-ask-${selectedSlug}`)}
                className="w-full text-center text-warm-white/60 py-3 text-xs font-body tracking-[0.2em] uppercase border border-teal/20 rounded-sm active:bg-white/[0.04]"
              >
                Ask first on WhatsApp
              </a>
            </div>

            <p className="text-warm-white/30 text-[10px] font-body text-center mt-5 leading-relaxed">
              {bookingReady
                ? "Secure booking via WeTravel · 60% deposit · cancellation policy applies"
                : "Online checkout launching shortly. WhatsApp the Bajablue team directly to lock your dates."}
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
