"use client";

import { useState } from "react";
import { sectors, type Sector } from "../data/projects";
import { ArrowDown, GridIcon, ListIcon } from "./icons";

type Props = {
  activeSector: Sector;
  onSectorChange: (s: Sector) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
};

export default function FilterBar({
  activeSector,
  onSectorChange,
  view,
  onViewChange,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-30 flex items-center gap-3 pointer-events-none">
      {/* Sector dropdown */}
      <div className="pointer-events-auto relative">
        <button
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-2 px-4 h-10 rounded-full bg-white border border-[rgba(33,33,34,0.25)]
            text-sm text-[#212122] hover:bg-[#212122] hover:text-white transition-colors duration-300"
        >
          <span>{activeSector}</span>
          <ArrowDown
            className={`w-2.5 h-auto transition-transform duration-300 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown list */}
        {dropdownOpen && (
          <div
            className="absolute bottom-full mb-2 right-0 bg-white border border-[rgba(33,33,34,0.25)]
              rounded-lg shadow-lg overflow-hidden min-w-[180px]"
          >
            <ul>
              {sectors.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => {
                      onSectorChange(s);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F7F8F9]
                      transition-colors duration-150
                      ${s === activeSector ? "font-medium" : ""}`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Grid / List toggle */}
      <div className="pointer-events-auto relative">
        <button
          onClick={() => onViewChange(view === "grid" ? "list" : "grid")}
          className="group w-12 h-12 rounded-full bg-[#212122] text-white flex items-center justify-center
            hover:scale-105 transition-transform duration-300"
          aria-label={view === "grid" ? "Vue liste" : "Vue grille"}
        >
          {view === "grid" ? (
            <ListIcon className="w-4 h-4" />
          ) : (
            <GridIcon className="w-4 h-4" />
          )}
          {/* Label tooltip */}
          <span
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2
              bg-[#212122] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            {view === "grid" ? "Vue liste" : "Vue grille"}
          </span>
        </button>
      </div>
    </div>
  );
}
