import Image from "next/image";

const footerLinks = [
  { text: "Give Feedback", href: "/us/Feedback/index" },
  { text: "Privacy Policy", href: "https://www.hbomax.com/privacy" },
  { text: "Terms of Use", href: "https://www.hbomax.com/terms-of-use" },
  { text: "Cookie Settings", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#252525] text-white">
      <div className="hbo-gutter flex flex-col gap-6 py-[28px]">
        <div className="flex flex-wrap items-center gap-x-[28px] gap-y-3 text-[16px] leading-[20px]">
          {footerLinks.map((l) => (
            <a
              key={l.text}
              href={l.href}
              className="font-medium text-white no-underline hover:underline"
            >
              {l.text}
            </a>
          ))}
          <div className="ml-auto flex items-center gap-3 text-[14px]">
            <span className="text-white/80">Follow us</span>
            <a
              href="https://x.com/hbomaxhelp"
              aria-label="HBO Max Help on X"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-80"
            >
              <Image src="/icons/twitter.svg" alt="" width={20} height={20} />
            </a>
          </div>
        </div>

        <p className="m-0 text-[13px] leading-[18px] text-white/70">
          © 2026 WarnerMedia Direct, LLC. All Rights Reserved. HBO Max is used
          under license.
        </p>
      </div>
    </footer>
  );
}
