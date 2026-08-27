import Image from "next/image";
import Link from "next/link";
import { HandholdLogo } from "@/components/sites/handhold-io-1ee60dfc/shared/logos";

const NAV_LINKS = ["Sign in", "Contact us", "Careers"];
const LEGAL_LINKS = ["Privacy policy", "Cookie policy", "Responsible disclosure"];

export function Footer() {
  return (
    <div className="relative flex w-full flex-col gap-4 overflow-x-clip">
      <Image
        src="/sites/handhold-io-1ee60dfc/root-8a5edab2/images/hand-top-left.webp"
        alt=""
        width={2109}
        height={652}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[-1] h-auto w-[280px] md:w-[420px]"
      />
      <Image
        src="/sites/handhold-io-1ee60dfc/root-8a5edab2/images/hand-bottom-right.webp"
        alt=""
        width={2446}
        height={1046}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 z-[-1] h-auto w-[320px] md:w-[480px]"
      />

      <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-24 text-center md:pt-32">
        <h2 className="max-w-[600px] font-serif text-[28px] font-normal leading-[28px] tracking-[-0.84px] text-content-primary">
          Give a white glove experience to every prospect
        </h2>
        <Link
          href="#"
          className="mt-4 rounded-full bg-black px-5 py-[10px] text-sm text-white transition-colors hover:bg-black/80"
        >
          Let&apos;s talk
        </Link>
      </div>

      <div className="mx-auto mt-8 flex max-w-[900px] flex-col gap-4 px-6 text-center">
        <p className="text-xs leading-[18px] text-content-tertiary md:text-sm md:leading-5">
          Handhold (&quot;Handhold&quot;) provides technology and AI-powered agents designed to
          help businesses engage visitors, qualify inbound leads, deliver personalized product
          experiences, and guide users through onboarding. Handhold is a software platform and
          does not provide sales, marketing, legal, or advisory services.
        </p>
        <p className="text-xs leading-[18px] text-content-tertiary md:text-sm md:leading-5">
          Any customer interactions, product information, or recommendations generated through
          Handhold agents are based on the configuration and data provided by the customer.
          Handhold does not control, verify, or guarantee the accuracy, completeness, or
          suitability of any information presented through its platform. By using this website or
          the Handhold platform, you acknowledge that all content is provided for informational
          and operational purposes only and agree to our Terms of Use and Privacy Policy.
        </p>
      </div>

      <div className="mx-6 mt-8 flex flex-col items-center gap-8 border-t border-black/10 px-0 py-8 md:mx-10 md:flex-row md:items-center md:justify-between">
        <HandholdLogo className="h-5 w-36" />

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-16">
          <nav className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
            {NAV_LINKS.map((label) => (
              <Link
                key={label}
                href="#"
                className="text-sm text-content-secondary transition-colors hover:text-content-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-medium text-content-tertiary">Legal</span>
            <nav className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
              {LEGAL_LINKS.map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-sm text-content-secondary transition-colors hover:text-content-primary"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
