import Image from "next/image";
import Link from "next/link";

/**
 * `footer.fu-footer` from fundup.au — #0f0f0f surface, 1px #ffffff1a top
 * hairline, 40px block padding.
 *
 * The source adds `margin-inline: -20px; padding-right: 0` below 767px, which
 * pushes the footer past the viewport edge and causes horizontal overflow. That
 * is a bug in the original and is deliberately NOT reproduced — this footer is
 * full width with the standard 16px gutters at every breakpoint.
 *
 * The link list also deliberately omits `/privacy-policy`, matching the source.
 *
 * Two source declarations are omitted because they are no-ops as authored:
 * `.footer_bottom-1` gets `padding-left/right: 0` at ≤767px (it has no inline
 * padding to begin with) and `font-size: 12px` at ≤479px (both `.footer_legal`
 * children already set 12px themselves).
 *
 * The trailing "Powered by WaynAI" credit is an addition, not part of the source.
 */

type FooterLink = {
  readonly href: string;
  readonly label: string;
};

const FOOTER_LINKS: readonly FooterLink[] = [
  { href: "/#services", label: "Services" },
  { href: "/contact", label: "Contact" },
  { href: "/self-employed-loans", label: "Self-Employed Loans" },
  { href: "/low-doc-loans", label: "Low Doc Loans" },
  { href: "/calculators", label: "Calculators" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
];

/** `.footer_link-1` — 14px/400 #ffffff99, `white-space: nowrap`, `transition: color .2s`. */
const FOOTER_LINK_CLASS =
  "whitespace-nowrap text-sm text-[#ffffff99] no-underline transition-colors duration-200 hover:text-white";

/** `.footer_legal` — 12px/1.6 #ffffff66, centred, no margin. */
const FOOTER_LEGAL_CLASS = "text-center text-xs leading-[1.6] text-[#ffffff66]";

/** Inherits `.footer_legal`'s muted tier; hover follows the footer's `.footer_link-1` idiom. */
const FOOTER_CREDIT_LINK_CLASS = "no-underline transition-colors duration-200 hover:text-white";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffffff1a] bg-[#0f0f0f] py-10">
      {/* .footer_container — max-width 1280px, 16px gutters. */}
      <div className="mx-auto w-full max-w-[1280px] px-4">
        {/*
          .footer_top — a wrapping `space-between` row at ≥768px (logo · links ·
          copyright), collapsing to a centred column at ≤767px.
          `max-[768px]` compiles to `not all and (min-width:768px)`, i.e. the
          source's `≤767px`; `max-[480px]` likewise covers `≤479px`.
        */}
        <div className="flex flex-wrap items-center justify-between gap-[16px] max-[768px]:flex-col max-[768px]:items-center max-[768px]:gap-[24px] max-[768px]:text-center max-[480px]:gap-[20px]">
          {/* .footer_logo-link */}
          <Link href="/" className="flex shrink-0 items-center no-underline">
            <Image
              src="/images/fundup-logo.webp"
              alt="FundUp"
              width={1920}
              height={800}
              sizes="120px"
              /* `.footer_logo` — `width: auto; height: 32px` at every breakpoint. */
              className="block h-8 w-auto"
            />
          </Link>

          {/* .footer_links — wrapping row at ≥768px, column at ≤767px. */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-[24px] max-[768px]:flex-col max-[768px]:items-center max-[768px]:justify-center max-[768px]:gap-[12px] max-[480px]:gap-[10px]"
          >
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={FOOTER_LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* .footer_copyright — the third item of the row, not part of the legal block. */}
          <p className="text-center text-sm text-[#ffffff80]">© 2026 FundUp. All rights reserved.</p>
        </div>

        {/* .footer_bottom-1 — hairline-separated legal block spanning the full container. */}
        <div className="mt-[24px] flex flex-col gap-[8px] border-t border-[#ffffff1a] pt-[24px]">
          <p className={FOOTER_LEGAL_CLASS}>
            The information provided on this site is on the understanding that it is for
            illustrative and discussion purposes only. Whilst all care and attention is taken in its
            preparation any party seeking to rely on its content or otherwise should make their own
            enquiries and research to ensure its relevance to your specific personal and business
            requirements and circumstances. Terms, conditions, fees and charges may apply. Normal
            lending criteria apply. Rates subject to change. Approved applicants only.
          </p>
          <p className={FOOTER_LEGAL_CLASS}>
            Loan Ranger Finance Pty Ltd Trading as FundUp is a Credit Representative 571356 of LMG
            Broker Services Pty Ltd ACN 632 405 504 Australian Credit Licence 517192.
          </p>
          <p className={FOOTER_LEGAL_CLASS}>
            Powered by{" "}
            <a
              href="https://waynai.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className={FOOTER_CREDIT_LINK_CLASS}
            >
              WaynAI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
