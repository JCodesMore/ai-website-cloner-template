"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { LogoIcon } from "@/components/icons";

const NAV_LINKS = [
  { label: "Nos ingrédients", href: "/pages/ingredients" },
  { label: "Notre mission", href: "/pages/mission" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-6xl items-center justify-between gap-6 rounded-full border border-black/5 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur">
        <Link href="/" aria-label="Onday" className="shrink-0 text-[#003D2A]">
          <LogoIcon className="h-6 w-auto md:h-[30px]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#1a1a1a] transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/pages/faq"
            className="hidden text-sm text-[#1a1a1a] transition-opacity hover:opacity-70 sm:inline"
          >
            FAQ
          </Link>
          <Link
            href="/account"
            className="hidden text-sm text-[#1a1a1a] transition-opacity hover:opacity-70 sm:inline"
          >
            Mon compte
          </Link>
          <Link
            href="/products/onday"
            className="rounded-full bg-[#e0ff0c] px-5 py-2 text-sm font-medium text-[#003D2A] transition-transform hover:scale-[1.03]"
          >
            Commander
          </Link>
          <button
            type="button"
            aria-label="Ouvrir la navigation"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5 text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </header>
  );
}
