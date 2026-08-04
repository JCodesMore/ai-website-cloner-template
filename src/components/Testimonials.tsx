"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

/**
 * `section.rs2-section` › `section.fu-testi` from fundup.au — ONE section.
 *
 * `rs2-section` is only the Webflow `w-embed w-script` shell around the `fu-testi` markup,
 * but it is not cosmetic: it contributes its own `80px 24px` padding and a `#0f0f0f`
 * background, so `#0f0f0f` shows as a band around the inner `#111111` block and the total
 * vertical padding is 160px. Both elements are reproduced.
 *
 * The embed carries its own red, `#e5341a` — NOT the `#bc1a1a` used by the rest of the site.
 * Per docs/research/FIXES.md the three site reds are preserved exactly where each appears.
 *
 * The embed's `CameraPlainVariable` webfont is omitted (FIXES.md #12 — a `cdn.gpteng.co`
 * third-party leftover), so this falls back to the project `font-sans` stack.
 *
 * See docs/research/components/testimonials-and-journey.spec.md.
 */

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "Excellent service, quick replies to emails and phone calls. Always available and on hand to help with any queries or assistance required. Second time we have used Ned for mortgage advice.",
    author: "Martin – Returning Client",
    rating: 5,
  },
  {
    quote:
      "Ned was absolutely fantastic! As first home buyers, we couldn't have asked for a better broker. He guided us through every step and made the whole process completely stress free.",
    author: "Shannon – First Home Buyer",
    rating: 5,
  },
  {
    quote:
      "Absolutely fantastic Mortgage Broker. Would highly recommend this bloke to anyone looking to buy a home. He has made the whole experience so easy for us and stress free. He really goes above and beyond and cares about his customers. Thankyou mate for all your help!",
    author: "Daniel – Upgrader",
    rating: 5,
  },
];

interface MiniCard {
  /** Truncated excerpt, including the straight quotes the source hard-codes into the text. */
  readonly excerpt: string;
  readonly name: string;
  readonly rating: number;
  /**
   * Slide this card jumps to, and the slide whose index highlights it.
   *
   * The live site lists the mini-cards in REVERSE of the slide order while numbering their
   * `data-idx` 0,1,2 — so on fundup.au the Daniel card drives the Martin slide and vice versa,
   * and the highlighted card disagrees with the quote on screen at positions 0 and 2.
   *
   * FIXED: each card now targets its own slide. Logged in docs/research/FIXES.md.
   */
  readonly targetIndex: number;
}

const TESTIMONIAL_MINI_CARDS: readonly MiniCard[] = [
  {
    excerpt:
      '"Absolutely fantastic Mortgage Broker. Would highly recommend this bloke to anyone looking to buy a home..."',
    name: "Daniel – Upgrader",
    rating: 5,
    targetIndex: 2,
  },
  {
    excerpt:
      '"Ned was absolutely fantastic! As first home buyers, we couldn\'t have asked for better help..."',
    name: "Shannon – First Home Buyer",
    rating: 5,
    targetIndex: 1,
  },
  {
    excerpt:
      '"Excellent service, quick replies to emails and phone calls. Always available and on hand..."',
    name: "Martin – Returning Client",
    rating: 5,
    targetIndex: 0,
  },
];

const REVIEWS_HREF = "https://www.google.com/search?q=fundup+au+reviews";

/** `resetTimer()` in the source — `setInterval(..., 5000)`. */
const AUTOPLAY_MS = 5000;

/** `Math.abs(diff) > 40` in the source's `touchend` handler. */
const SWIPE_THRESHOLD_PX = 40;

const STAR = "★";
const OPEN_QUOTE = "“";
const CLOSE_QUOTE = "”";

/**
 * `translateX(-${index * 100}%)` as static classes.
 *
 * The track's own width equals one slide (each slide is `min-width: 100%` of the track's
 * containing block and overflows it), so `-100%` / `-200%` of the track are exactly one and
 * two slides. Written out in full so Tailwind's scanner emits them.
 */
const SLIDE_TRANSFORMS = ["translate-x-0", "-translate-x-full", "-translate-x-[200%]"] as const;

/** `.fu-testi__arrow` — the `--prev`/`--next` modifiers only differ in their inset. */
const ARROW_CLASS =
  "absolute top-1/2 z-[2] flex size-[38px] -translate-y-1/2 cursor-pointer select-none " +
  "items-center justify-center rounded-full border border-white/15 " +
  "bg-[rgba(30,30,30,0.92)] text-[18px] leading-none text-white outline-none " +
  "transition-[background-color,border-color] duration-200 " +
  "hover:border-[#e5341a] hover:bg-[#e5341a] [-webkit-tap-highlight-color:transparent]";

function wrapIndex(next: number): number {
  const total = TESTIMONIALS.length;
  return ((next % total) + total) % total;
}

/** `.fu-testi__stars` / `.fu-testi__mini-stars` — literal ★ glyphs, sized typographically. */
function StarRow({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: rating }, (_, i) => (
        <span key={i} className="text-[#e5341a]">
          {STAR}
        </span>
      ))}
    </div>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // The source's `go()` ends with `resetTimer()`, so any manual change restarts the full 5s
  // dwell. Reading `index` here makes it a genuine dependency: every change tears this
  // interval down and re-arms it, which *is* `resetTimer()`.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex(wrapIndex(index + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [index, prefersReducedMotion]);

  // Touch/swipe, bound natively so `touchstart` really is `{ passive: true }` as in the
  // source. The functional `setIndex` keeps `index` out of the deps, so the listeners are
  // attached once rather than re-bound on every slide change.
  useEffect(() => {
    const element = slidesRef.current;
    if (!element) return;

    let startX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0]?.clientX ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const diff = startX - endX;
      if (Math.abs(diff) <= SWIPE_THRESHOLD_PX) return;
      setIndex((current) => wrapIndex(diff > 0 ? current + 1 : current - 1));
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  /** Every control routes through this, exactly like the source's `go(n)`. */
  const go = (next: number) => setIndex(wrapIndex(next));

  return (
    /* .rs2-section — the Webflow embed shell, #0f0f0f with its own 80px/24px padding */
    <section className="bg-[#0f0f0f] px-6 py-20">
      {/* .fu-testi */}
      <div className="w-full bg-[#111111] px-6 py-20 font-sans">
        {/* .fu-testi__inner */}
        <div className="mx-auto max-w-[960px]">
          {/* .fu-testi__badge */}
          <div className="mb-6 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-white/20" />
            <span className="text-[14px] text-[#e5341a]" aria-hidden="true">
              {STAR}
            </span>
            <span className="text-[11px] font-semibold tracking-[2px] text-white/60 uppercase">
              5.0 on Google {"—"} 36 Reviews
            </span>
            <span className="h-px w-8 bg-white/20" />
          </div>

          {/* .fu-testi__heading */}
          <div className="mb-10 text-center">
            <h2 className="font-sans text-[clamp(34px,5vw,54px)] leading-[1.15] font-bold tracking-[-1px] text-white">
              Trusted by Australians <span className="block text-[#e5341a] italic">nationwide</span>
            </h2>
          </div>

          {/* .fu-testi__carousel */}
          <div
            className="relative mb-8"
            role="group"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
          >
            {/* .fu-testi__track */}
            <div className="overflow-hidden rounded-2xl">
              {/* .fu-testi__inner-slides — #fuSlides */}
              <div
                ref={slidesRef}
                aria-live="polite"
                className={cn(
                  "flex transition-transform duration-[450ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] motion-reduce:transition-none",
                  SLIDE_TRANSFORMS[index],
                )}
              >
                {TESTIMONIALS.map((testimonial, i) => (
                  <div
                    key={testimonial.author}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
                    aria-hidden={i !== index}
                    className="min-w-full rounded-2xl border border-white/8 bg-[#1e1e1e] px-5 py-6 min-[601px]:px-12 min-[601px]:py-9"
                  >
                    <p className="mb-7 text-[clamp(14px,2.2vw,17px)] leading-[1.75] text-white/82 italic">
                      {OPEN_QUOTE}
                      {testimonial.quote}
                      {CLOSE_QUOTE}
                    </p>
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#e5341a] text-[16px] font-bold text-white"
                        aria-hidden="true"
                      >
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <div className="mb-[5px] text-[14px] font-semibold text-white">
                          {testimonial.author}
                        </div>
                        <StarRow rating={testimonial.rating} className="text-[13px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* .fu-testi__arrow--prev / --next — ‹ › glyphs, as the source ships them */}
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous testimonial"
              className={cn(ARROW_CLASS, "left-1 min-[601px]:-left-[19px]")}
            >
              <span aria-hidden="true">{"‹"}</span>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next testimonial"
              className={cn(ARROW_CLASS, "right-1 min-[601px]:-right-[19px]")}
            >
              <span aria-hidden="true">{"›"}</span>
            </button>

            {/* .fu-testi__dots — #fuDots */}
            <div className="mt-4 flex justify-center gap-2">
              {TESTIMONIALS.map((testimonial, i) => (
                <button
                  key={testimonial.author}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1 cursor-pointer rounded-[2px] border-none p-0 transition-[background-color,width] duration-[250ms]",
                    i === index ? "w-8 bg-[#e5341a]" : "w-6 bg-white/20",
                  )}
                />
              ))}
            </div>
          </div>

          {/* .fu-testi__mini-grid */}
          <div className="mb-8 grid grid-cols-1 gap-3.5 min-[641px]:grid-cols-3">
            {TESTIMONIAL_MINI_CARDS.map((card) => (
              <button
                key={card.name}
                type="button"
                onClick={() => go(card.targetIndex)}
                aria-label={`Show the testimonial from ${card.name}`}
                aria-current={card.targetIndex === index}
                className={cn(
                  // `translate` is listed with `transform` because Tailwind v4 compiles
                  // `-translate-y-0.5` to the standalone `translate` property.
                  "cursor-pointer rounded-lg border bg-[#1e1e1e] p-[18px] text-left transition-[border-color,transform,translate] duration-200 hover:-translate-y-0.5 hover:border-[rgba(229,52,26,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  card.targetIndex === index ? "border-[#e5341a]" : "border-white/8",
                )}
              >
                <StarRow rating={card.rating} className="mb-2.5 text-[11px]" />
                <p className="mb-2.5 line-clamp-3 text-[12px] leading-[1.6] text-white/60">
                  {card.excerpt}
                </p>
                <div className="text-[11px] font-semibold text-white/45">{card.name}</div>
              </button>
            ))}
          </div>

          {/* .fu-testi__cta */}
          <div className="flex justify-center">
            <a
              href={REVIEWS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-7 py-[13px] text-[14px] font-semibold tracking-[0.3px] text-white no-underline transition-[background-color,border-color] duration-200 hover:border-[#e5341a] hover:bg-[#e5341a] hover:text-white"
            >
              <span
                className="text-[14px] text-[#e5341a] transition-colors duration-200 group-hover:text-white"
                aria-hidden="true"
              >
                {STAR}
              </span>
              See all Google Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
