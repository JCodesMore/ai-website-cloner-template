"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import ProjectGrid from "../components/ProjectGrid";
import ProjectList from "../components/ProjectList";
import FilterBar from "../components/FilterBar";
import { type Sector } from "../data/projects";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSector, setActiveSector] = useState<Sector>("Tous les secteurs");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [heroVisible, setHeroVisible] = useState(true);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Toggle header colour when projects panel is scrolled
  useEffect(() => {
    const el = rightPanelRef.current;
    if (!el) return;
    const onScroll = () => setHeroVisible(el.scrollTop < 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#F7F8F9]">
      {/* ── Navigation overlay ─────────────────────────────────── */}
      <Navigation open={navOpen} onClose={() => setNavOpen(false)} />

      {/* ── Fixed header ───────────────────────────────────────── */}
      <Header onMenuClick={() => setNavOpen(true)} light={heroVisible} />

      {/* ── Main split layout ──────────────────────────────────── */}
      <div className="h-full flex">
        {/* LEFT — Hero (60 vw on desktop, full width on mobile) */}
        <div className="relative flex-none w-full md:w-[60vw] h-full">
          <HeroSection />
        </div>

        {/* RIGHT — Projects panel (40 vw on desktop only) */}
        <div
          ref={rightPanelRef}
          className="hidden md:block flex-none w-[40vw] h-full overflow-y-auto no-scrollbar bg-[#F7F8F9]"
        >
          {view === "grid" ? (
            <ProjectGrid activeSector={activeSector} />
          ) : (
            <ProjectList activeSector={activeSector} />
          )}
        </div>
      </div>

      {/* ── Mobile: projects tray pinned to bottom ─────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 h-[46vh] bg-[#F7F8F9] border-t border-[rgba(33,33,34,0.25)]">
        {view === "grid" ? (
          <ProjectGrid activeSector={activeSector} />
        ) : (
          <ProjectList activeSector={activeSector} />
        )}
      </div>

      {/* ── Filter + toggle (fixed bottom-right) ──────────────── */}
      <FilterBar
        activeSector={activeSector}
        onSectorChange={setActiveSector}
        view={view}
        onViewChange={setView}
      />
    </div>
  );
}
