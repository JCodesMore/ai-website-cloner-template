"use client";

import { LogoShape, CloseIcon } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
};

const menuLinks = [
  { label: "Projets",   href: "#projets" },
  { label: "Équipe",    href: "#equipe" },
  { label: "Carrière",  href: "#carriere" },
  { label: "Nouvelles", href: "#nouvelles" },
  { label: "Contact",   href: "#contact" },
];

export default function Navigation({ open, onClose }: Props) {
  return (
    <>
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Nav panel */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[101] bg-white px-5 pt-5 pb-8
          transition-transform duration-500 ease-[cubic-bezier(0.215,0.61,0.355,1)]
          border-b border-[rgba(33,33,34,0.25)]
          grid grid-cols-2 items-start gap-y-10
          ${open ? "translate-y-0" : "-translate-y-full"}`}
        style={{ fontFamily: '"Maison Neue", sans-serif' }}
      >
        {/* Logo */}
        <a href="/" aria-label="Héloïse Thibodeau Architecte" onClick={onClose}>
          <LogoShape className="w-9 h-10 text-[#212122]" />
        </a>

        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-[#212122] opacity-80 hover:opacity-100 transition-opacity p-1"
            aria-label="Fermer"
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>

        {/* Menu items */}
        <ul className={`col-span-2 flex flex-wrap gap-x-8 gap-y-1 text-[1.25rem] leading-none nav-open-${open ? "on" : "off"}`}>
          {menuLinks.map((link, i) => (
            <li
              key={link.label}
              className="nav-item"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-20px)",
                transition: `opacity 0.5s cubic-bezier(0.215,0.61,0.355,1) ${0.55 - i * 0.05}s,
                             transform 0.5s cubic-bezier(0.215,0.61,0.355,1) ${0.55 - i * 0.05}s`,
              }}
            >
              <a
                href={link.href}
                onClick={onClose}
                className="block py-1 hover:opacity-60 transition-opacity duration-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Name + lang */}
        <div
          className="col-span-2 flex items-end justify-between pt-4 text-sm"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.5s cubic-bezier(0.215,0.61,0.355,1) 0.3s",
          }}
        >
          <span
            className="text-[1.375rem] font-medium leading-none"
            style={{ fontFamily: '"Neue Haas Grotesk Display", sans-serif' }}
          >
            Héloïse Thibodeau Architecte
          </span>
          <a
            href="#"
            className="text-sm hover:opacity-60 transition-opacity"
          >
            English
          </a>
        </div>
      </nav>
    </>
  );
}
