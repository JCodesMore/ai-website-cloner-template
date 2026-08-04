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

const FOOTER_LINK_CLASS =
  "text-sm font-medium text-[#ffffffcc] no-underline transition-colors duration-200 hover:text-white";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffffff1a] bg-[#0f0f0f] py-10">
      <div className="mx-auto w-full max-w-[1280px] px-4">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link href="/" className="flex shrink-0 items-center no-underline">
            <Image
              src="/images/fundup-logo.webp"
              alt="FundUp"
              width={1920}
              height={800}
              sizes="(min-width: 1024px) 160px, 120px"
              className="block h-auto max-h-12 w-auto lg:max-h-16"
            />
          </Link>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={FOOTER_LINK_CLASS}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex max-w-4xl flex-col gap-4">
            <p className="text-sm text-[#ffffffcc]">
              © 2026 FundUp. All rights reserved.
            </p>
            <p className="text-xs leading-relaxed text-[#ffffff99]">
              Loan Ranger Finance Pty Ltd Trading as FundUp is a Credit
              Representative 571356 of LMG Broker Services Pty Ltd ACN 632 405
              504 Australian Credit Licence 517192.
            </p>
            <p className="text-xs leading-relaxed text-[#ffffff99]">
              The information provided on this site is on the understanding that
              it is for illustrative and discussion purposes only. Whilst all
              care and attention is taken in its preparation any party seeking to
              rely on its content or otherwise should make their own enquiries
              and research to ensure its relevance to your specific personal and
              business requirements and circumstances. Terms, conditions, fees
              and charges may apply. Normal lending criteria apply. Rates subject
              to change. Approved applicants only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
