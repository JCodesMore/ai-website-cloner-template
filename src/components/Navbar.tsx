"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setProductOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header
      className={`top-0 right-0 left-0 z-50 mt-6 pt-4 sticky transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-[oklch(0.217_0.0038309_106.715/0.8)]" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* 2x2 grid icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="1" y="1" width="7.5" height="7.5" rx="1" fill="white" fillOpacity="0.9" />
            <rect x="11.5" y="1" width="7.5" height="7.5" rx="1" fill="white" fillOpacity="0.9" />
            <rect x="1" y="11.5" width="7.5" height="7.5" rx="1" fill="white" fillOpacity="0.9" />
            <rect x="11.5" y="11.5" width="7.5" height="7.5" rx="1" fill="white" fillOpacity="0.9" />
          </svg>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "oklch(1 0 0 / 0.9)",
            }}
          >
            FLO
          </span>
        </Link>

        {/* CENTER: Nav links */}
        <nav
          className="flex items-center border border-white/10 bg-[oklch(0.285_0_0)]"
          style={{ borderRadius: 0, position: "relative" }}
        >
          {/* Product dropdown */}
          <div ref={productRef} style={{ position: "relative" }}>
            <button
              onClick={() => setProductOpen((v) => !v)}
              className="flex items-center gap-1"
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "oklch(1 0 0 / 0.6)",
                padding: "8px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Product <span style={{ fontSize: "10px", marginTop: "2px" }}>▾</span>
            </button>
            {productOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  minWidth: "220px",
                  background: "oklch(0.285 0 0)",
                  border: "1px solid oklch(1 0 0 / 0.1)",
                  zIndex: 100,
                  padding: "8px 0",
                }}
              >
                <Link
                  href="/#hero"
                  onClick={() => setProductOpen(false)}
                  style={{ display: "block", padding: "10px 20px", textDecoration: "none" }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", margin: 0 }}>Overview</p>
                  <p style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.45)", margin: "2px 0 0" }}>All automation systems</p>
                </Link>
                <div style={{ height: "1px", background: "oklch(1 0 0 / 0.07)", margin: "4px 0" }} />
                <Link
                  href="/#flowstack"
                  onClick={() => setProductOpen(false)}
                  style={{ display: "block", padding: "10px 20px", textDecoration: "none" }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", margin: 0 }}>FlowStack</p>
                  <p style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.45)", margin: "2px 0 0" }}>Lead capture &amp; client ops</p>
                </Link>
                <Link
                  href="/#flowops"
                  onClick={() => setProductOpen(false)}
                  style={{ display: "block", padding: "10px 20px", textDecoration: "none" }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", margin: 0 }}>FlowOps</p>
                  <p style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.45)", margin: "2px 0 0" }}>Internal ops &amp; data sync</p>
                </Link>
                <div style={{ height: "1px", background: "oklch(1 0 0 / 0.07)", margin: "4px 0" }} />
                <Link
                  href="/#meet-flo"
                  onClick={() => setProductOpen(false)}
                  style={{ display: "block", padding: "10px 20px", textDecoration: "none" }}
                >
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", margin: 0 }}>Meet FLO</p>
                  <p style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.45)", margin: "2px 0 0" }}>How we work with you</p>
                </Link>
              </div>
            )}
          </div>
          <a
            href="/pricing"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "oklch(1 0 0 / 0.6)",
              padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Pricing
          </a>
          <a
            href="/support"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "oklch(1 0 0 / 0.6)",
              padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Support
          </a>
          <a
            href="/docs"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "oklch(1 0 0 / 0.6)",
              padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Docs
          </a>
          <a
            href="/blog"
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "oklch(1 0 0 / 0.6)",
              padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Blog
          </a>
        </nav>

        {/* RIGHT: GitHub badge + Sign in + Sign up */}
        <div className="flex items-center gap-2 shrink-0">
          {/* GitHub star badge */}
          <a
            href="https://github.com/kilo-ai/kilo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
            style={{
              height: "40px",
              padding: "0 12px",
              backgroundColor: "oklch(0.285 0 0)",
              color: "oklch(1 0 0 / 0.9)",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 0,
              border: "1px solid oklch(1 0 0 / 0.1)",
            }}
          >
            <GitHubIcon size={16} />
            <span>17.8k</span>
          </a>

          {/* Sign in */}
          <a
            href="/signin"
            style={{
              height: "40px",
              padding: "0 16px",
              backgroundColor: "oklch(0.285 0 0)",
              color: "oklch(1 0 0 / 0.9)",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 0,
              display: "inline-flex",
              alignItems: "center",
              border: "1px solid oklch(1 0 0 / 0.1)",
            }}
          >
            Sign in
          </a>

          {/* Sign up */}
          <a
            href="/signup"
            style={{
              height: "40px",
              padding: "0 16px",
              backgroundColor: "oklch(0.567 0.15 248)",
              color: "oklch(1 0 0 / 0.9)",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 0,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
}
