"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell } from "lucide-react";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // hide on scroll down, reveal on scroll up (matches animesaga)
      setHidden(y > 120 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[1000] flex h-[72px] items-center gap-4 px-3 transition-[transform,background] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:pl-[76px]"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        background: scrolled
          ? "rgba(4,5,8,0.82)"
          : "linear-gradient(to bottom, rgba(4,5,8,0.9), transparent)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex shrink-0 items-center gap-2 pl-1">
        <Image
          src="/icons/icon.png"
          alt="AnimeSaga"
          width={30}
          height={30}
          className="h-[30px] w-[30px]"
        />
        <span className="font-heading text-[19px] font-extrabold tracking-tight">
          ANIME<span className="text-accent">SAGA</span>
        </span>
      </Link>

      {/* Search */}
      <div className="relative mx-auto hidden w-full max-w-[420px] sm:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search anime..."
          className="h-10 w-full rounded-full border border-[var(--border-strong)] bg-white/[0.04] pl-10 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/60 focus:outline-none"
        />
        <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-[var(--border-strong)] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:flex">
          Ctrl S
        </kbd>
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-[var(--accent-foreground)]">
          <span className="text-[13px] leading-none">文</span>A EN
        </button>
        <button className="text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="size-[22px]" />
        </button>
        <button className="size-8 overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-secondary" />
      </div>
    </header>
  );
}
