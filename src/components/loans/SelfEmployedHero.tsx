import Link from "next/link";

/** `.sel-hero-checks` — three `✓` spans, red, wrapping on desktop and stacking below 768px. */
const TRUST_TICKS: readonly string[] = [
  "✓ Free consultation",
  "✓ No obligation",
  "✓ 40+ lenders compared",
];

/**
 * `section.sel-hero` — the `/self-employed-loans` hero.
 *
 * Flat `#111` with a left-to-right darkening gradient on top (`.sel-hero-overlay`) — there is no
 * background image on this page, unlike the homepage hero.
 *
 * `.sel-hero-btn-outline` is a plain inline `<a>` in the source; as a flex item it blockifies and
 * its declared 52px height resolves to exactly `2 + 14 + 20 + 14 + 2`. Rendering it as a centred
 * inline-flex reproduces that end state without depending on Webflow's 20px body line box.
 *
 * The primary CTA points at `#contact` on the live site, but no element with that id exists on
 * this page — the button jumps nowhere. Retargeted at `/contact` (spec §5).
 */
export function SelfEmployedHero() {
  return (
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-[#111111]">
      {/* .sel-hero-overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,#000000b3_30%,#0000004d_100%)]"
      />

      {/* .sel-hero-content */}
      <div className="relative z-[2] max-w-[560px] px-[40px] pt-[152px] pb-[80px] text-left font-inter max-[992px]:max-w-full max-[992px]:px-[24px] max-[992px]:pt-[104px] max-[768px]:px-[16px] max-[768px]:pt-[88px] max-[768px]:pb-[48px]">
        <p className="m-0 mb-[16px] font-inter text-[14px] leading-[20px] font-medium tracking-[0.15em] text-[#bfbfbf] uppercase">
          SELF-EMPLOYED LENDING SPECIALISTS
        </p>

        <h1 className="m-0 mb-[24px] font-inter text-[60px] leading-[1.1] font-bold text-white max-[992px]:text-[40px] max-[992px]:leading-[1.15] max-[768px]:text-[28px] max-[768px]:leading-[1.2]">
          Self-Employed Home Loans
          <br />
          <span className="font-inter text-[#bc1a1a]">Australia</span>
        </h1>

        <p className="m-0 mb-[16px] font-inter text-[20px] leading-[1.6] font-normal text-[#ffffffcc] max-[768px]:text-[15px]">
          Getting a home loan when you&apos;re self-employed shouldn&apos;t be hard. We specialise in
          matching ABN holders, sole traders, and business owners with lenders who understand your
          income.
        </p>

        <p className="m-0 mb-[32px] flex flex-wrap gap-[16px] font-inter text-[14px] leading-[20px] font-semibold text-[#bc1a1a] max-[768px]:flex-col max-[768px]:gap-[6px] max-[768px]:text-[13px]">
          {TRUST_TICKS.map((tick) => (
            <span key={tick} className="font-inter">
              {tick}
            </span>
          ))}
        </p>

        <div className="flex flex-wrap gap-[12px] max-[768px]:w-full max-[768px]:flex-col max-[768px]:items-stretch">
          <Link
            href="/contact"
            className="inline-flex h-[52px] items-center justify-center gap-[6px] rounded-[8px] bg-[#bc1a1a] px-[32px] font-inter text-[15px] leading-[20px] font-bold text-white no-underline shadow-[0_4px_20px_#0000004d] max-[768px]:w-full max-[768px]:text-center"
          >
            Book a Free Consult →
          </Link>

          <a
            href="tel:0412885734"
            className="inline-flex h-[52px] items-center justify-center rounded-[8px] border-2 border-white bg-transparent px-[32px] font-inter text-[15px] leading-[20px] font-bold text-white no-underline max-[768px]:w-full max-[768px]:text-center"
          >
            Call 0412 885 734
          </a>
        </div>
      </div>
    </section>
  );
}
