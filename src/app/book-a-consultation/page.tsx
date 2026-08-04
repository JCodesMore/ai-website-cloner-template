import type { Metadata } from "next";
import Script from "next/script";

import { GetInTouch } from "@/components/GetInTouch";

export const metadata: Metadata = {
  // The live page ships a bare `<title>Book A Consultation</title>` with no brand suffix, so
  // opt out of the root layout's `%s | FundUp` template.
  title: { absolute: "Book A Consultation" },
  // Duplicated verbatim from `/contact` on the live site — including the promise of a message
  // form that neither page actually has.
  description:
    "Ready to find the right loan? Contact FundUp for a free, no-obligation mortgage consultation. Call 0412 885 734 or send us a message — we're here to help.",
};

/**
 * `/book-a-consultation` — the orphaned booking page. Nothing on the site links to it; it is
 * still built and reachable by URL, matching the original.
 *
 *   main#contact-git.git-section → section.faq-section › div.code-embed › GoHighLevel iframe
 *
 * Two divergences from the source markup, both deliberate:
 *
 * 1. The source ships the same dead `.faq-item` accordion script as `/`, `/contact` and
 *    `/low-doc-loans`, with **no matching markup on this page**. Omitted — `FIXES.md` #11.
 * 2. `div.inline-div-0` is `display: none` and empty, so it is not rendered.
 *
 * **No `<h1>`** — the page starts at the `<h2>` inside `GetInTouch`, which also renders the
 * page's only `<main>`. Header and footer come from `layout.tsx`.
 */
export default function BookAConsultationPage() {
  return (
    <>
      <GetInTouch
        heading="Book a Consultation"
        subheading="Ready to find the right loan? Contact FundUp for a free, no-obligation mortgage consultation. Call 0412 885 734 or send us a message — we're here to help."
        showContactList={false}
      />

      {/* section.faq-section — same wrapper the FAQ uses elsewhere; here it holds the embed. */}
      <section className="w-full overflow-x-hidden bg-white px-[16px] py-0 min-[992px]:overflow-x-visible min-[992px]:px-0">
        {/*
         * div.code-embed.w-embed.w-iframe.w-script
         *
         * ⚠️ Preserved defect — flag for the orchestrator. The source's desktop rule is
         * `padding-left: 500px; padding-right: 500px` (≥992px only), which leaves the iframe
         * `100vw − 1000px` wide: ~920px at 1920px, ~440px at 1440px, and effectively **zero**
         * between 992px and ~1050px. Reproduced 1:1 per the match-first mandate, but this is a
         * genuine layout break and a strong candidate for a new `FIXES.md` row (a centred
         * `max-width` would be the natural fix). Responsive ladder, verbatim:
         *   ≥992  → 40px 500px          ≤991 → 24px gutters
         *   ≤767  → 16px gutters        ≤479 → 8px gutters, display:block
         */}
        {/* FIXED: the source's `padding: 40px 500px` at ≥992px leaves the iframe
            100vw−1000px wide — effectively zero between 992 and ~1050px, where the
            booking calendar disappears entirely. Replaced with a centred max-width
            that matches the source's rendered width at common desktop sizes.
            See docs/research/FIXES.md. */}
        <div className="mx-auto mb-[40px] block w-full max-w-[920px] min-w-0 overflow-hidden px-[8px] pt-[40px] min-[480px]:px-[16px] md:px-[24px]">
          <iframe
            id="cjRBEEobuaiBp31Omzz5_1778555821508"
            src="https://api.leadconnectorhq.com/widget/booking/cjRBEEobuaiBp31Omzz5"
            title="Book a consultation with FundUp"
            scrolling="no"
            // The source sets no height, so the browser default (150px) applies until
            // form_embed.js posts the measured height back and rewrites `style.height`.
            // The floor keeps the calendar from rendering as a sliver in the meantime.
            className="block h-[700px] min-h-[500px] w-full overflow-hidden border-none"
          />
        </div>
      </section>

      {/*
       * The site's only third-party embed. `lazyOnload` defers it past hydration — the iframe
       * renders and loads on its own; this script only handles the postMessage auto-resize.
       */}
      <Script src="https://api.leadconnectorhq.com/js/form_embed.js" strategy="lazyOnload" />
    </>
  );
}
