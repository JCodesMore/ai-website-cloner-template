import Link from "next/link";

/**
 * `section.sel-cta` — the mid-page red CTA band on `/self-employed-loans`.
 *
 * Deliberately **not** the shared `CtaBand`: that component is `.ctab-section` from `/` —
 * `#e61919`, an 860px container, a 44px heading, `#1a1a1a` buttons and no responsive rules at all.
 * `.sel-cta` is `#bc1a1a` on a 760px container with a 32px heading, a `#1a2035` navy primary and a
 * full-width stack below 768px, none of which `CtaBand` exposes. See spec §3.5.
 *
 * Both buttons are declared with `padding: 14px 28px` and no height; the outline one is 4px taller
 * because of its 2px border, and `.sel-cta-btns`' default `align-items: stretch` pulls the dark one
 * up to match. Pinning both to 52px reproduces that end state directly.
 */
export function SelfEmployedCtaBand() {
  return (
    <section className="bg-[#bc1a1a] px-[24px] py-[64px] font-inter max-[768px]:px-[16px] max-[768px]:py-[48px]">
      <div className="mx-auto max-w-[760px] text-center">
        <h2 className="m-0 mb-[12px] font-inter text-[32px] leading-[1.2] font-extrabold text-white max-[992px]:text-[28px] max-[768px]:text-[24px]">
          Ready to get your self-employed home loan sorted?
        </h2>

        <p className="m-0 mb-[28px] font-inter text-[15px] leading-[20px] text-[#ffffffd9]">
          Free consultation · No obligation · Compare 40+ lenders
        </p>

        <div className="flex flex-wrap justify-center gap-[16px] max-[768px]:w-full max-[768px]:flex-col max-[768px]:items-stretch">
          <Link
            href="/contact"
            className="inline-flex h-[52px] items-center justify-center rounded-[8px] bg-[#1a2035] px-[28px] text-center font-inter text-[15px] leading-[20px] font-bold text-white no-underline max-[768px]:w-full"
          >
            Book Free Consultation →
          </Link>

          <a
            href="tel:0412885734"
            className="inline-flex h-[52px] items-center justify-center rounded-[8px] border-2 border-white bg-transparent px-[28px] text-center font-inter text-[15px] leading-[20px] font-semibold text-white no-underline max-[768px]:w-full"
          >
            Call 0412 885 734
          </a>
        </div>
      </div>
    </section>
  );
}
