"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Our Partners", href: "/partner" },
  { label: "Blog", href: "/blog" },
  { label: "Contact us", href: "#section-contact" },
] as const;

const languages = [
  { code: "en", label: "English", short: "ENG" },
  { code: "uk", label: "Ukrainian", short: "UKR" },
  { code: "ru", label: "Russian", short: "RUS" },
  { code: "es", label: "Spanish", short: "ESP" },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<(typeof languages)[number]>(
    languages[0]
  );
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full pt-8 pb-4 px-6"
      style={{ zIndex: 999, backgroundColor: "transparent" }}
    >
      <div
        className="mx-auto grid items-center"
        style={{
          gridTemplateColumns: "1fr 0.4fr 1fr",
          maxWidth: "71rem",
        }}
      >
        {/* Center: Nav Links (desktop only) */}
        <div className="hidden xl:flex items-center justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 text-xl leading-none"
              style={{ color: "#f1f4f8" }}
            >
              <span
                className="inline-block overflow-hidden"
                style={{ paddingBottom: "3px", lineHeight: 1 }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Left: Logo */}
        <div>
          <Link href="/" className="inline-block transition-all duration-200">
            <Image
              src="/images/leading-cards.svg"
              alt="Leading Cards"
              width={180}
              height={40}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Right: Auth Buttons + Language (desktop) / Hamburger (mobile) */}
        <div className="flex items-center justify-end gap-3">



          {/* Language Dropdown */}
          <div ref={langRef} className="relative hidden xl:block">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm transition-colors duration-200 hover:bg-white/10 rounded-lg"
              style={{ color: "#f1f4f8" }}
            >
              <span>{selectedLang.short}</span>
              <Image
                src="/images/arrow-down.svg"
                alt=""
                width={12}
                height={12}
                className={cn(
                  "transition-transform duration-200",
                  langDropdownOpen && "rotate-180"
                )}
              />
            </button>
            {langDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border border-white/15 bg-[#1a1a2e]/95 py-1 backdrop-blur-md"
                style={{ zIndex: 1000 }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-white/10",
                      selectedLang.code === lang.code
                        ? "text-white font-medium"
                        : "text-white/70"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons (desktop only) */}
          <div className="hidden xl:flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg transition-colors duration-200 hover:bg-white/10 button-primary cc-secondary"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#f1f4f8",
                fontSize: "clamp(1.125rem, 0.993rem + 0.5634vw, 1.5rem)",
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className="rounded-lg transition-colors duration-200 hover:bg-white/20 button-primary cc-ghost"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#f1f4f8",
                fontSize: "clamp(1.125rem, 0.993rem + 0.5634vw, 1.5rem)",
              }}
            >
              Sign up
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            className="xl:hidden p-2 transition-colors duration-200 hover:bg-white/10 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <Image
              src="/images/menu.svg"
              alt="Menu"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden mt-4 mx-auto rounded-xl border border-white/10 bg-[#1a1a2e]/95 p-6 backdrop-blur-md"
          style={{ maxWidth: "71rem" }}
        >
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-lg rounded-lg transition-colors duration-150 hover:bg-white/10"
                style={{ color: "#f1f4f8" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Language Selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors duration-150",
                  selectedLang.code === lang.code
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/60 hover:bg-white/10 hover:text-white/80"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              className="w-full rounded-lg py-3 px-5 text-lg transition-colors duration-200 hover:bg-white/10 button-primary cc-secondary"
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#f1f4f8",
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className="w-full rounded-lg py-3 px-5 text-lg transition-colors duration-200 hover:bg-white/20 button-primary cc-ghost"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#f1f4f8",
              }}
            >
              Sign up
            </button>
          </div>


        </div>
      )}
    </nav>
  );
}
