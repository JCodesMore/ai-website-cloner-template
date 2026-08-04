"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MenuIcon, PhoneIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * `nav.fu-nav-1` from fundup.au.
 *
 * Fixed, pure black (#000 — not the #0f0f0f used elsewhere on the site), with a
 * 1px #ffffff1a hairline underneath. There is deliberately NO scroll-triggered
 * state: the bar looks identical at every scroll position. Because it is fixed,
 * `layout.tsx` pads the content wrapper by the matching nav height.
 *
 * Source breakpoints are desktop-first max-widths (991 / 767 / 479) inverted to
 * mobile-first here: base = 56px bar, `md:` = 64px, `lg:` = 112px + full links.
 */

type NavLink = {
  readonly href: string;
  readonly label: string;
};

const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/self-employed-loans", label: "Self-Employed Loans" },
  { href: "/low-doc-loans", label: "Low Doc Loans" },
  { href: "/calculators", label: "Calculators" },
  { href: "/contact", label: "Contact" },
];

const PHONE_HREF = "tel:0412885734";

/** `.fu-nav__link-1` — #fffc → #fff on hover, `transition: color .2s`. */
const NAV_LINK_CLASS =
  "text-sm font-medium text-[#ffffffcc] no-underline transition-colors duration-200 hover:text-white";

/**
 * `.fu-nav__call-btn-1` — 36px red pill, 12px inline padding, 6px radius,
 * `0 4px 6px #0000004d` shadow, `transition: filter .2s` → brightness(1.1).
 */
const CALL_BUTTON_CLASS =
  // NB: explicit 6px — `rounded-md` resolves to 8px against this project's radius scale.
  "flex h-9 items-center gap-2 whitespace-nowrap rounded-[6px] bg-[#bc1a1a] px-3 text-sm font-semibold text-white no-underline shadow-[0_4px_6px_#0000004d] transition-[filter] duration-200 hover:brightness-110";

const MOBILE_MENU_ID = "fu-nav-mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);

  // Close on route change — adjusted during render rather than in an effect so
  // the panel never paints for a frame on the new route.
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setIsMenuOpen(false);
  }

  // Close on Escape.
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#ffffff1a] bg-black font-inter">
      {/* .fu-nav__container-1 */}
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-4 md:h-16 lg:h-28">
        {/* .fu-nav__logo-link + .fu-nav__logo-1 */}
        <Link href="/" className="flex shrink-0 items-center no-underline">
          <Image
            src="/images/fundup-logo.webp"
            alt="FundUp"
            width={1920}
            height={800}
            loading="eager"
            sizes="(min-width: 1024px) 240px, 120px"
            className="block h-auto max-h-8 w-[76.7969px] min-[480px]:w-auto md:max-h-9 lg:h-24 lg:max-h-none lg:w-auto"
          />
        </Link>

        {/* .fu-nav__links-wrapper-1 — display:none below 992px */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <a href={PHONE_HREF} className={CALL_BUTTON_CLASS}>
            <PhoneIcon className="size-4" />
            Call Now
          </a>
        </div>

        {/* .fu-nav__mobile-btn-1 — transparent below 480px, red above, gone at lg */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={cn(
            "flex cursor-pointer items-center justify-center bg-transparent p-2 text-white",
            "min-[480px]:bg-[#bc1a1a]",
            "lg:hidden",
          )}
        >
          <MenuIcon className="size-6" />
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="border-t border-[#ffffff1a] bg-black lg:hidden"
        >
          <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={cn(NAV_LINK_CLASS, "block py-3")}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={PHONE_HREF}
              onClick={closeMenu}
              className={cn(CALL_BUTTON_CLASS, "my-3 w-full justify-center")}
            >
              <PhoneIcon className="size-4" />
              Call Now
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
