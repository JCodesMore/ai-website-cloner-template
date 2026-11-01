"use client";

import { useEffect, useRef } from "react";
import { ASSETS } from "./data";
import { CompassIcon, EarthIcon, PlaneIcon } from "./icons";
import { PRELOADER_STORAGE_KEY as STORAGE_KEY } from "./preloader-script";

/** First-visit preloader: fades out 400ms after window load. Its setup script is inlined by the root layout. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el || root.classList.contains("sl-preloaded")) return;
    document.body.style.overflow = "hidden";

    let timer: number | undefined;
    const onLoad = () => {
      el.classList.add("is-hiding");
      timer = window.setTimeout(() => {
        root.classList.add("sl-preloaded");
        document.body.style.overflow = "";
      }, 400);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div ref={ref} className="sl-preloader" aria-hidden="true">
      <div className="sl-preloader__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/images/logo.png`} alt="" className="sl-preloader__logo" />
        <div className="sl-preloader__icon sl-preloader__compass" data-variant="compass">
          <CompassIcon />
        </div>
        <div className="sl-preloader__icon sl-preloader__plane-track" data-variant="plane">
          <PlaneIcon />
        </div>
        <div className="sl-preloader__icon sl-preloader__globe" data-variant="globe">
          <EarthIcon />
          <span className="sl-preloader__orbit">
            <PlaneIcon />
          </span>
        </div>
        <p className="sl-preloader__text">Preparing your Sri Lankan adventure&hellip;</p>
      </div>
    </div>
  );
}

/** Fades the page out before following a same-site link, like the source's theme.js. */
export function PageTransitions() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }
      let destination: URL;
      try {
        destination = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname && destination.hash)
      ) {
        return;
      }
      event.preventDefault();
      const root = document.querySelector(".sl");
      root?.classList.add("sl-exit");
      // Force a reflow so the transition starts from full opacity.
      void (root as HTMLElement | null)?.offsetHeight;
      root?.classList.add("sl-exit-active");
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 320);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) document.querySelector(".sl")?.classList.remove("sl-exit", "sl-exit-active");
    };
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
