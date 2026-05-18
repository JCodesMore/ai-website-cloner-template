"use client";

import { useEffect, useState } from "react";
import { BurgerIcon, CloseIcon } from "./icons";

const NAV_ITEMS = ["Agency", "Works", "Contact", "Join us"];
const DISCLAIMER =
  "This project was originally a real project for an agency. Unfortunately, the visual and written content didn’t meet the studio’s standards, so we decided to release the website under a different name in order to showcase the project.";

export function HomeNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <div className="flex items-center justify-between px-8 py-7 md:px-12 md:py-9">
          <a
            href="/"
            className="pointer-events-auto flex items-center gap-2.5 text-white transition-opacity duration-300 hover:opacity-80"
          >
            <img
              src="/images/footer-logo.DGEgvHlG.png"
              alt=""
              className="h-10 w-10"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="leading-[1]">
              <span className="block font-display text-[22px] font-bold tracking-[-0.01em]">
                Aurora
              </span>
              <span className="-mt-[2px] block font-display text-[11px] font-light tracking-[0.04em] opacity-80">
                Agency
              </span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="glass-pill pointer-events-auto grid h-[52px] w-[52px] place-items-center rounded-[14px] text-[#1a1320] transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_12px_40px_-8px_rgba(212,172,197,0.7)] active:scale-95"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <BurgerIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-[90] overflow-hidden text-white transition-opacity duration-700 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#11121d]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 20% 110%, rgba(243,196,201,0.55) 0%, transparent 65%), radial-gradient(50% 60% at 85% 100%, rgba(151,125,189,0.6) 0%, transparent 65%), radial-gradient(40% 50% at 50% 100%, rgba(212,172,197,0.55) 0%, transparent 65%)",
          }}
        />
        <div className="relative grid h-full grid-cols-1 px-10 pb-16 pt-36 md:grid-cols-[1.4fr_1fr] md:px-16 md:pt-44">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <li
                key={item}
                onClick={() => setOpen(false)}
                className="cursor-pointer font-display text-[56px] font-bold leading-[1.02] tracking-[-0.02em] text-[#f3c4c9] transition-all duration-500 hover:text-white hover:translate-x-3 sm:text-[80px] md:text-[104px]"
                style={{
                  animation: open
                    ? `fade-up 0.7s cubic-bezier(0.2,0.7,0.2,1) ${i * 0.08}s both`
                    : undefined,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="hidden items-start justify-end md:flex">
            <p className="max-w-[360px] font-mono-display text-[13px] font-normal leading-[1.6] text-white/80">
              {DISCLAIMER}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
