"use client";

import { useState, useEffect } from "react";
import { siteConfig, navLinks } from "@/data/site";
import { events } from "@/lib/analytics";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hidden md:contents">
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-deep/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 h-20">
          <a href="/" className="flex items-center gap-2" aria-label="Bajablue Tours — home">
            <img
              src="/images/logos/bajablue-horizontal.svg?v=2"
              alt="Bajablue Tours"
              width={251}
              height={31}
              decoding="async"
              className="h-6 md:h-7 w-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-warm-white/60 hover:text-warm-white text-sm font-body tracking-wide transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => events.whatsappClick("navbar-enquire")}
              className="hidden md:inline-flex items-center gap-2 bg-coral text-deep px-6 py-2.5 text-sm font-body font-medium tracking-wide hover:bg-coral-light transition-colors duration-300"
            >
              Enquire
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-warm-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-warm-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-warm-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[99] bg-deep transition-opacity duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-display text-warm-white text-4xl tracking-wider hover:text-teal-light transition-colors">
              {link.label}
            </a>
          ))}
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => events.whatsappClick("navbar-mobile-menu")}
            className="mt-4 bg-coral text-deep px-10 py-3 text-lg font-body tracking-wide"
          >
            Enquire Now
          </a>
        </div>
      </div>

    </div>
  );
}
