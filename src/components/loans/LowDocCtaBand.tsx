import Link from "next/link";

/**
 * `section.ldl-cta2-section` — the CTA band on `/low-doc-loans`.
 *
 * Deliberately **not** the shared `CtaBand`: this one is a white, left-aligned two-column band
 * (copy left, stacked buttons right) using `#111827`/`#6b7280` greys and a 6px radius, versus
 * `CtaBand`'s full-bleed `#e61919` single centred column with an 8px radius. See spec §4.6.
 *
 * The two buttons are `inline-block` with different vertical padding (14px vs 13px) so the outline
 * one's 2px border lands them 2px apart in height; inside a stretching column flexbox they end up
 * the same width. Ported with `leading-[20px]` in place of Webflow's body line box.
 */
export function LowDocCtaBand() {
  return (
    <section className="bg-white p-[64px] font-inter max-[992px]:px-[24px] max-[768px]:px-[16px]">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-[48px] font-inter max-[992px]:flex-col max-[992px]:px-[24px] max-[992px]:text-center max-[768px]:gap-[24px] max-[768px]:px-[16px]">
        {/* .ldl-cta2-left */}
        <div className="flex-1 max-[992px]:w-full max-[992px]:max-w-full max-[992px]:text-center">
          <h2 className="m-0 mb-[16px] font-inter text-[34px] leading-[1.25] font-bold text-[#111827] max-[768px]:text-[24px]">
            Get your low doc loan sorted today
          </h2>
          <p className="m-0 max-w-[480px] font-inter text-[15px] leading-[1.6] text-[#6b7280] max-[992px]:mx-auto">
            Free consultation. No tax returns needed. We compare 40+ lenders and handle everything
            from application to settlement.
          </p>
        </div>

        {/* .ldl-cta2-right */}
        <div className="flex shrink-0 flex-col gap-[14px] max-[992px]:w-full max-[992px]:items-center max-[992px]:justify-center">
          <Link
            href="/contact"
            className="inline-block rounded-[6px] bg-[#bc1a1a] px-[28px] py-[14px] text-center font-inter text-[15px] leading-[20px] font-semibold whitespace-nowrap text-white no-underline max-[768px]:w-full"
          >
            Book Free Consultation →
          </Link>

          <a
            href="tel:0412885734"
            className="inline-block rounded-[6px] border-2 border-[#111827] bg-transparent px-[28px] py-[13px] text-center font-inter text-[15px] leading-[20px] font-semibold whitespace-nowrap text-[#111827] no-underline max-[768px]:w-full"
          >
            Call 0412 885 734
          </a>
        </div>
      </div>
    </section>
  );
}
