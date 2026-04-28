"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HamburgerIcon, MonochromeLogo } from "./icons";

const NAV_LINKS = [
  { href: "/#products", label: "製品情報" },
  { href: "/journal", label: "ジャーナル" },
  { href: "/press", label: "ニュース" },
] as const;

function HeaderInner() {
  return (
    <div className="base-px relative flex h-[var(--header-height)] w-full items-center justify-between py-5">
      {/* Logo (left) */}
      <Link
        href="/"
        aria-label="Monochrome — Home"
        className="relative z-10 inline-flex items-center text-black"
      >
        <MonochromeLogo />
      </Link>

      {/* Nav (absolutely centered, hidden < lg) */}
      <nav
        aria-label="Primary"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      >
        <ul className="pointer-events-auto flex items-center gap-10">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[14px] font-normal text-[#141419] transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right cluster: CTAs + Hamburger */}
      <div className="relative z-10 flex items-center gap-3">
        <Link
          href="/contact"
          className="button-base button-fill hidden md:inline-flex"
        >
          お問い合わせ
        </Link>
        <Link
          href="/download"
          className="button-base button-outline hidden md:inline-flex"
        >
          製品資料一覧
        </Link>
        <button
          type="button"
          aria-label="Open menu"
          className="ml-1 inline-flex h-10 w-10 items-center justify-center text-black"
        >
          <HamburgerIcon />
        </button>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportH = window.innerHeight;
      const nearBottom = y + viewportH >= docHeight - 200;

      if (y <= 0) {
        setShown(false);
      } else if (nearBottom) {
        setShown(false);
      } else if (delta < -10) {
        // scrolling up beyond threshold
        setShown(true);
      } else if (delta > 0) {
        // scrolling down
        setShown(false);
      }

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* In-page top bar — naturally scrolls away with the page */}
      <div className="relative z-40 w-full text-black">
        <HeaderInner />
      </div>

      {/* Fixed reveal-on-scroll-up bar */}
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[9999] w-full bg-white text-black",
          "will-change-transform transform transition-transform duration-[400ms] ease-out-expo",
          shown ? "translate-y-0" : "-translate-y-full",
        )}
        aria-hidden={!shown}
      >
        <HeaderInner />
      </header>
    </>
  );
}
