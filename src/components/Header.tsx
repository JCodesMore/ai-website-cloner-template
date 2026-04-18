"use client";

import { LogoShape } from "./icons";

type Props = {
  onMenuClick: () => void;
  light?: boolean; // white text (over dark hero bg)
};

export default function Header({ onMenuClick, light = false }: Props) {
  const color = light ? "text-white" : "text-[#212122]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[120] px-5 py-5 flex items-center justify-between
        pointer-events-none transition-colors duration-500
        ${light ? "" : "bg-white border-b border-[rgba(33,33,34,0.25)]"}
        ${color}`}
    >
      {/* Logo mark */}
      <a
        href="/"
        aria-label="Héloïse Thibodeau Architecte"
        className="pointer-events-auto"
      >
        <LogoShape className="w-7 h-8" />
      </a>

      {/* Site name — desktop center, fades to 0 over hero */}
      <a
        href="/"
        className="hidden md:block text-[0.9375rem] font-medium leading-none pointer-events-auto transition-opacity duration-500"
        style={{
          fontFamily: '"Neue Haas Grotesk Display", sans-serif',
          opacity: light ? 0 : 1,
        }}
      >
        Héloïse Thibodeau Architecte
      </a>

      {/* Menu button */}
      <button
        onClick={onMenuClick}
        className="pointer-events-auto text-[15px] leading-none hover:opacity-60 transition-opacity duration-300"
      >
        Menu
      </button>
    </header>
  );
}
