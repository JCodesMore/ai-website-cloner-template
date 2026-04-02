import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Our partners", href: "/partner" },
  { label: "Contact us", href: "#section-contact" },
] as const;

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/86950206/",
    icon: "/images/social/linkedin.webp",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/leadingcards.media/",
    icon: "/images/social/instagram.webp",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/LeadingCards",
    icon: "/images/social/facebook.webp",
  },
  {
    label: "Telegram",
    href: "https://t.me/LeadingCards",
    icon: "/images/social/telegram.webp",
  },
] as const;

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Condition", href: "/terms-conditions" },
  { label: "KYC & AML Policy", href: "/kyc-aml-policy" },
] as const;

export function Footer() {
  return (
    <footer className="px-6 pb-8 pt-12">
      <div className="relative mx-auto max-w-[58.75rem]">
        {/* Top section */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Left: Nav links */}
          <nav className="flex gap-6" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#4d5e80] transition-colors hover:text-[#151c28]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center: Logo + Social */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/" aria-label="LeadingCards home">
              <Image
                src="/images/logomark.svg"
                alt="LeadingCards"
                width={40}
                height={40}
              />
            </Link>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70"
                  aria-label={social.label}
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Right: placeholder for balance on desktop */}
          <div className="hidden md:block md:w-[200px]" />
        </div>

        {/* Decorative HR with dots */}
        <div className="relative my-8">
          <hr className="border-t border-[#dfe4ec]" />
          <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 justify-between px-[10%]">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="block h-2 w-2 rounded-full border border-[#dfe4ec] bg-white"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="text-sm text-[#4d5e80]">
            &copy; LeadingCards 2025
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#4d5e80] transition-colors hover:text-[#151c28]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
