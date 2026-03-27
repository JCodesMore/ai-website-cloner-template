"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

function Logo({ textColor = "#1a1d4f" }: { textColor?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      {/* Logo mark: coral circle with white checkmark */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "#ff6c50",
          flexShrink: 0,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 9.5L7.5 13L14 6"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {/* Logo text */}
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        SimplyBook
        <span style={{ color: "#00c8d4" }}>.me</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isScrolled = scrolled;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 72,
          transition: "background 0.3s, box-shadow 0.3s",
          background: isScrolled ? "#ffffff" : "transparent",
          boxShadow: isScrolled
            ? "0 2px 20px rgba(15,19,64,0.08)"
            : "none",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Left: Logo */}
          <Logo textColor="#1a1d4f" />

          {/* Center: Desktop Nav */}
          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              flex: 1,
              justifyContent: "center",
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1a1d4f",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
                className="hover:!text-[#00c8d4]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA buttons */}
          <div
            className="hidden md:flex"
            style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}
          >
            <Link
              href="/login"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#1a1d4f",
                textDecoration: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
              className="hover:!text-[#00c8d4]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                background: "#ff6c50",
                borderRadius: 6,
                padding: "10px 20px",
                textDecoration: "none",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
              className="hover:!bg-[#e85a3e]"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile: Hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex md:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "#1a1d4f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        aria-hidden={!mobileOpen}
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          right: 0,
          zIndex: 49,
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(15,19,64,0.1)",
          overflow: "hidden",
          maxHeight: mobileOpen ? 600 : 0,
          transition: "max-height 0.3s ease",
        }}
        className="md:hidden"
      >
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "16px 24px",
                fontSize: 15,
                fontWeight: 500,
                color: "#1a1d4f",
                textDecoration: "none",
                borderBottom: "1px solid #dde3f0",
                transition: "color 0.2s",
              }}
              className="hover:!text-[#00c8d4]"
            >
              {link.label}
            </Link>
          ))}
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#1a1d4f",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              className="hover:!text-[#00c8d4]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                background: "#ff6c50",
                borderRadius: 6,
                padding: "12px 20px",
                textDecoration: "none",
                transition: "background 0.2s",
                display: "inline-block",
                textAlign: "center",
              }}
              className="hover:!bg-[#e85a3e]"
            >
              Get started free
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
