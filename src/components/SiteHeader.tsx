"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDownIcon, SearchIcon } from "@/components/icons";
import { NAV_LINKS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Inner pages always show the dark logo + white bar so the content beneath is visible.
  const solid = !isHome || scrolled;
  const logoSrc = solid ? "/img/logos/logo-inner.png" : "/img/logos/logo.png";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[99999]",
        "transition-[background-color,color,box-shadow] duration-300 ease-out",
        solid
          ? "bg-white text-[#010101] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-b border-[rgba(0,0,0,0.08)]"
          : "bg-transparent text-white",
      )}
    >
      <div className="yo-container">
        <div className="flex items-center justify-between h-[89px] gap-6">
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="VertexLink — Get Connected"
          >
            <Image
              src={logoSrc}
              alt="VertexLink"
              width={226}
              height={60}
              priority
              className="h-auto w-[150px] lg:w-[170px] xl:w-[180px]"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-1 flex-1 justify-center"
            aria-label="Primary"
          >
            {NAV_LINKS.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;

              if (!hasSubmenu) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "uppercase font-bold text-[16px] tracking-[0.8px] px-2 py-[21px]",
                      "transition-colors duration-200",
                      "hover:text-[#df0303]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label} className="relative group/nav-item">
                  <Link
                    href={item.href}
                    className={cn(
                      "uppercase font-bold text-[16px] tracking-[0.8px] px-2 py-[21px]",
                      "inline-flex items-center",
                      "transition-colors duration-200",
                      "hover:text-[#df0303] group-hover/nav-item:text-[#df0303]",
                    )}
                  >
                    {item.label}
                    <ChevronDownIcon className="size-3 inline ml-1" />
                  </Link>

                  <div
                    className={cn(
                      "absolute left-0 top-full pt-0",
                      "min-w-[220px]",
                      "opacity-0 invisible translate-y-2",
                      "group-hover/nav-item:opacity-100 group-hover/nav-item:visible group-hover/nav-item:translate-y-0",
                      "transition-all duration-200 ease-out",
                      "pointer-events-none group-hover/nav-item:pointer-events-auto",
                    )}
                    role="menu"
                  >
                    <ul
                      className={cn(
                        "mt-0 py-[10px] bg-white rounded-lg",
                        "shadow-[0_8px_30px_rgba(0,0,0,0.1)]",
                      )}
                    >
                      {item.submenu?.map((entry) => (
                        <li key={entry.label}>
                          <Link
                            href={entry.href}
                            className={cn(
                              "block px-6 py-[10px] text-[14.4px] font-semibold",
                              "text-[#42545e] hover:text-[#df0303]",
                              "transition-colors duration-150",
                            )}
                            role="menuitem"
                          >
                            {entry.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button
              type="button"
              aria-label="Search"
              className={cn(
                "inline-flex items-center justify-center",
                "size-10 rounded-full",
                "transition-colors duration-200",
                "hover:text-[#df0303]",
              )}
            >
              <SearchIcon className="size-5" />
            </button>
            <Link href="/contact" className="yo-btn yo-btn-primary">
              FREE QUOTE
            </Link>
          </div>

          <div className="flex lg:hidden items-center gap-3 shrink-0">
            <button
              type="button"
              aria-label="Search"
              className="inline-flex items-center justify-center size-10 rounded-full transition-colors duration-200 hover:text-[#df0303]"
            >
              <SearchIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex flex-col items-center justify-center size-10 rounded-md gap-[5px]"
            >
              <span
                className={cn(
                  "block h-[2px] w-6 bg-current transition-transform duration-200",
                  mobileOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-6 bg-current transition-opacity duration-200",
                  mobileOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-6 bg-current transition-transform duration-200",
                  mobileOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden bg-white text-[#42545e]",
          "transition-[max-height,opacity] duration-300 ease-out",
          "border-t border-[rgba(0,0,0,0.08)]",
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="yo-container py-4" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_LINKS.map((item) => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isOpen = openSubmenu === item.label;

              if (!hasSubmenu) {
                return (
                  <li
                    key={item.label}
                    className="border-b border-[rgba(0,0,0,0.06)]"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 uppercase font-bold text-[15px] tracking-[0.8px] text-[#010101]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={item.label}
                  className="border-b border-[rgba(0,0,0,0.06)]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3 uppercase font-bold text-[15px] tracking-[0.8px] text-[#010101]"
                    aria-expanded={isOpen}
                    onClick={() => setOpenSubmenu(isOpen ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDownIcon
                      className={cn(
                        "size-4 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height] duration-200 ease-out",
                      isOpen ? "max-h-[600px]" : "max-h-0",
                    )}
                  >
                    <ul className="pb-3 pl-3">
                      {item.submenu?.map((entry) => (
                        <li key={entry.label}>
                          <Link
                            href={entry.href}
                            className="block py-2 text-[14px] font-semibold text-[#42545e] hover:text-[#df0303]"
                            onClick={() => setMobileOpen(false)}
                          >
                            {entry.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
          <Link
            href="/contact"
            className="yo-btn yo-btn-primary mt-4 w-full"
            onClick={() => setMobileOpen(false)}
          >
            FREE QUOTE
          </Link>
        </nav>
      </div>
    </header>
  );
}
