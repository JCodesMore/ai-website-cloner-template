import Link from "next/link";
import type { SVGProps } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoIcon } from "@/components/icons";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3c.4 2.1 1.9 3.7 4 4v3c-1.5 0-2.9-.5-4-1.3v6.2c0 3.4-2.8 6.1-6.2 6.1S4 18.3 4 15c0-3.3 2.7-6 6.1-6.1.4 0 .8 0 1.2.1v3.1c-.4-.1-.8-.2-1.2-.2A2.9 2.9 0 0 0 7.1 15a2.9 2.9 0 0 0 5.8.1V3h3.6Z" />
    </svg>
  );
}

const ondayLinks = [
  { label: "Nos ingrédients", href: "/pages/ingredients" },
  { label: "Notre mission", href: "/pages/mission" },
  { label: "Devenir ambassadeur", href: "/pages/ambassadeur" },
];

const aideLinks = [
  { label: "Mon compte", href: "/account" },
  { label: "FAQ", href: "/pages/faq" },
  { label: "Contact", href: "/pages/contact" },
  { label: "Demande de retour", href: "/pages/retour" },
  { label: "Blog", href: "/blogs/news" },
];

const legalLinks = [
  { label: "CGV et mentions légales", href: "/pages/mentions-legales" },
  { label: "Politique de confidentialité", href: "/pages/confidentialite" },
];

export function Footer() {
  return (
    <footer className="bg-[#003D2A] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[35%_1fr_1fr_auto]">
          {/* Column 1: tagline + social */}
          <div className="flex flex-col gap-6">
            <p className="font-heading text-xl leading-snug text-white">
              Soutenir vos vies bien remplies par une micronutrition française
              de précision
            </p>
            <hr className="border-t border-dashed border-white/30" />
            <div className="flex items-center gap-4 text-[#e0ff0c]">
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-opacity hover:opacity-70"
              >
                <FacebookIcon className="size-6" />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-70"
              >
                <InstagramIcon className="size-6" />
              </Link>
              <Link
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="transition-opacity hover:opacity-70"
              >
                <TikTokIcon className="size-6" />
              </Link>
            </div>
          </div>

          {/* Column 2: Onday */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white/70">
              Onday
            </h3>
            <ul className="flex flex-col gap-3">
              {ondayLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Aide */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white/70">
              Aide
            </h3>
            <ul className="flex flex-col gap-3">
              {aideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: language selector */}
          <div className="flex items-start justify-start lg:justify-end">
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-sm text-white",
                "transition-colors hover:bg-white/10",
              )}
              aria-label="Sélectionner la langue"
            >
              <span aria-hidden="true">🇫🇷</span>
              <span>FR</span>
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>

        {/* Big lime wordmark */}
        <div className="mt-16 flex w-full items-center justify-center text-[#e0ff0c] lg:mt-24">
          <LogoIcon className="h-16 w-auto sm:h-24 lg:h-32" />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-dashed border-white/30 pt-6 text-xs text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:mt-16">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2024 ONDAY</span>
            <span>contact@onday.fr</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-opacity hover:opacity-80"
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
