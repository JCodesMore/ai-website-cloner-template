"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "vaul";
import { Toaster } from "sonner";
import { siteConfig, navLinks } from "@/data/site";
import { BookingDrawer } from "./BookingDrawer";

type MobileShellProps = {
  children: React.ReactNode;
};

const TABS = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Tours", href: "/tours", icon: ToursIcon },
  { label: "Book", action: "book", icon: BookIcon, primary: true },
  { label: "Gallery", href: "/gallery", icon: GalleryIcon },
  { label: "Contact", href: "/contact", icon: ContactIcon },
];

export function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function buzz() {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(15);
  }

  return (
    <>
      {/* Top header (slim) */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? "bg-deep/95 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" onClick={buzz}>
            <img
              src="/images/logos/bajablue-horizontal.svg?v=2"
              alt="Bajablue Tours"
              width={140}
              height={20}
              className="h-5 w-auto"
            />
          </Link>
          <button
            onClick={() => {
              buzz();
              setMenuOpen(true);
            }}
            className="flex flex-col gap-[5px] p-2"
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 bg-warm-white" />
            <span className="block w-5 h-0.5 bg-warm-white" />
            <span className="block w-5 h-0.5 bg-warm-white" />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="pb-20">{children}</main>

      {/* Bottom-tab navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[100] bg-deep/95 backdrop-blur-md border-t border-teal/15"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.href ? pathname === tab.href : false;

            if (tab.action === "book") {
              return (
                <button
                  key={tab.label}
                  onClick={() => {
                    buzz();
                    setBookingOpen(true);
                  }}
                  className="flex flex-col items-center justify-center py-2 px-1 relative"
                >
                  <span className="absolute -top-5 w-12 h-12 rounded-full bg-coral flex items-center justify-center shadow-lg shadow-coral/30 active:scale-95 transition-transform">
                    <Icon className="w-5 h-5 text-deep" />
                  </span>
                  <span className="text-[9px] font-body tracking-widest uppercase mt-7 text-coral">
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={tab.label}
                href={tab.href!}
                onClick={buzz}
                className={`flex flex-col items-center justify-center py-3 px-1 transition-colors ${
                  isActive ? "text-teal-light" : "text-warm-white/50 active:text-warm-white/80"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`} />
                <span className="text-[9px] font-body tracking-widest uppercase mt-1">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Slide-out menu drawer */}
      <Drawer.Root open={menuOpen} onOpenChange={setMenuOpen} direction="right">
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 z-[200]" />
          <Drawer.Content className="fixed top-0 right-0 bottom-0 z-[201] w-[85vw] max-w-sm bg-deep-light border-l border-teal/20 flex flex-col">
            <Drawer.Title className="sr-only">Menu</Drawer.Title>
            <Drawer.Description className="sr-only">Site navigation menu</Drawer.Description>

            <div className="px-6 py-6 border-b border-teal/10">
              <img
                src="/images/logos/bajablue-horizontal.svg?v=2"
                alt="Bajablue Tours"
                width={140}
                height={20}
                className="h-6 w-auto"
              />
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    buzz();
                    setMenuOpen(false);
                  }}
                  className="block px-6 py-4 text-warm-white text-lg font-body tracking-wide border-b border-white/[0.04] active:bg-white/[0.04]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-6 py-6 border-t border-teal/10 space-y-3">
              <a
                href={siteConfig.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-coral text-deep text-center py-3 text-xs font-body tracking-[0.2em] uppercase rounded-sm font-medium"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                className="block w-full text-warm-white/60 text-center py-3 text-xs font-body tracking-[0.2em] uppercase border border-teal/20 rounded-sm"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <BookingDrawer open={bookingOpen} onOpenChange={setBookingOpen} />

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(15, 40, 50, 0.98)",
            color: "#FFF9F0",
            border: "1px solid rgba(74, 157, 178, 0.3)",
            fontSize: "13px",
          },
        }}
      />
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ToursIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22 L22 22" />
      <path d="M3 18 L21 18 L19 14 L5 14 Z" />
      <path d="M12 14 V6" />
      <path d="M12 6 L18 9 L12 12" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
