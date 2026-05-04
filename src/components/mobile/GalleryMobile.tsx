"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import { AdaptiveVideo } from "../AdaptiveVideo";

type GalleryItem = { src: string; alt: string };

export function GalleryMobile({ items }: { items: GalleryItem[] }) {
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
    setActiveIdx((activeIdx + 1) % items.length);
  }

  function prev() {
    if (activeIdx === null) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
    setActiveIdx((activeIdx - 1 + items.length) % items.length);
  }

  return (
    <div className="md:hidden bg-deep">
      {/* Hero header with whale video backdrop */}
      <section className="relative h-[32dvh] overflow-hidden">
        <AdaptiveVideo
          src4k="/videos/mobile/gallery-montage-4k.mp4"
          src1080="/videos/mobile/gallery-montage-1080.mp4"
          src720="/videos/mobile/gallery-montage-720.mp4"
          poster="/videos/mobile/gallery-montage-poster.jpg"
          posterAlt="Orcas swimming underwater in the Sea of Cortez"
          className="absolute inset-0 w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/16 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <p className="text-teal-light/80 text-[10px] font-body tracking-[0.35em] uppercase mb-2">Life beneath the surface</p>
          <h1 className="text-display text-warm-white text-3xl tracking-wide leading-tight">GALLERY</h1>
        </div>
      </section>

      {/* Masonry-ish grid */}
      <section className="px-3 pb-8">
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, idx) => (
            <button
              key={item.src + idx}
              onClick={() => open(idx)}
              className={`relative overflow-hidden rounded-sm active:scale-[0.97] transition-transform ${
                idx % 5 === 0 ? "aspect-[3/4] col-span-2" : "aspect-square"
              }`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep/30" />
            </button>
          ))}
        </div>
      </section>

      {/* Full-screen lightbox */}
      <Drawer.Root
        open={activeIdx !== null}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        direction="bottom"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black z-[200]" />
          <Drawer.Content className="fixed inset-0 z-[201] bg-deep flex flex-col touch-none">
            <Drawer.Title className="sr-only">Photo viewer</Drawer.Title>
            <Drawer.Description className="sr-only">
              Swipe left/right to navigate, tap to close.
            </Drawer.Description>

            {/* Top bar */}
            <div className="flex items-center justify-between p-4 z-10">
              <span className="text-warm-white/50 text-xs font-body tabular-nums">
                {activeIdx !== null ? `${activeIdx + 1} / ${items.length}` : ""}
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

            {/* Photo viewer */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeIdx !== null && (
                  <motion.img
                    key={activeIdx}
                    src={items[activeIdx].src}
                    alt={items[activeIdx].alt}
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

              {/* Swipe hints (left/right invisible tap zones) */}
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-0 top-0 bottom-0 w-1/4 z-10"
              />
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-0 top-0 bottom-0 w-1/4 z-10"
              />
            </div>

            {/* Nav dots only — no captions */}
            <div className="p-5 pb-8 z-10">
              <div className="flex items-center justify-center gap-1.5">
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      activeIdx === i ? "w-5 bg-teal-light" : "w-1 bg-warm-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
