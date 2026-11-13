"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ASSETS, mainMenu } from "./data";
import { usePageLoaded } from "./use-page-loaded";

export function SiteHeader() {
  const loaded = usePageLoaded();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu icon is a video: the first 2/5 animates burger → close, the rest back.
  const toggleMenu = () => {
    const video = videoRef.current;
    const opening = !menuOpen;
    setMenuOpen(opening);
    if (!video) return;
    const stopAt = opening ? (video.duration / 5) * 2 : video.duration;
    const onTime = () => {
      if (video.currentTime >= stopAt) {
        video.pause();
        if (!opening) video.currentTime = 0;
        video.removeEventListener("timeupdate", onTime);
      }
    };
    video.addEventListener("timeupdate", onTime);
    void video.play().catch(() => video.removeEventListener("timeupdate", onTime));
  };

  return (
    <header id="masthead" className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container-fluid">
        <div className={`header-wrapper on-load-animate-header flex${loaded ? " animated" : ""}`}>
          <Link href="/" rel="home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/images/logo.png`} alt="Show Lanka tours" width={558} height={379} />
          </Link>
          <div className="flex right-section">
            <button
              type="button"
              className="menu-icon-wrapper"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              onClick={toggleMenu}
            >
              <video ref={videoRef} className="menu-video" preload="auto" playsInline muted>
                <source src={`${ASSETS}/video/menu-icon.webm`} type="video/webm" />
              </video>
            </button>
            <nav
              id="primary-menu"
              className={`main-menu-wrapper menu flex${menuOpen ? " animated" : ""}`}
              aria-label="Primary"
            >
              <ul className="nav-menu">
                {mainMenu.map((item) => {
                  const current = item.href === pathname;
                  return (
                    <li key={item.label} className={current ? "current-menu-item" : undefined}>
                      <Link href={item.href} aria-current={current ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
