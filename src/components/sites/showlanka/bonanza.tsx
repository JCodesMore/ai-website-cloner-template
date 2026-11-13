"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { coupons } from "./content/pages";
import { CircleXmarkIcon } from "./icons";
import { upload } from "./site-link";

function useItemsPerView() {
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    // theme.js: 3 items unless the window is narrower than 768px
    const update = () => setPerView(window.innerWidth < 768 ? 1 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return perView;
}

/** Owl Carousel "bonanza" setup: looped, one item per step, ‹ › arrows, no autoplay. */
export function BonanzaCarousel() {
  const perView = useItemsPerView();
  const [index, setIndex] = useState(0);
  const step = (dir: number) => setIndex((i) => (i + dir + coupons.length) % coupons.length);
  // Repeat the list so a looped window is always full.
  const loop = [...coupons, ...coupons];

  return (
    <div className="bonanza-carousel three" aria-roledescription="carousel" aria-label="Sweet Bonanza coupons">
      <div className="bonanza-track" style={{ transform: `translateX(-${(index * 100) / perView}%)` }}>
        {loop.map((src, i) => (
          <div key={i} aria-hidden={i < index || i >= index + perView}>
            <img src={upload(src)} alt="Our coupons" width={300} height={600} loading="lazy" />
          </div>
        ))}
      </div>
      <button type="button" className="bonanza-nav prev" aria-label="Previous" onClick={() => step(-1)}>
        ‹
      </button>
      <button type="button" className="bonanza-nav next" aria-label="Next" onClick={() => step(1)}>
        ›
      </button>
    </div>
  );
}

/** Coupon popup that the source opens 3s after load on tour pages, plus the side tab. */
export function BonanzaPopup() {
  const [state, setState] = useState<"hidden" | "visible" | "fading">("hidden");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: number | undefined;
    const show = () => {
      timer = window.setTimeout(() => setState("visible"), 3000);
    };
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => {
      window.removeEventListener("load", show);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (state !== "visible") return;
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setState("fading");
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setState("fading");
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "fading") return;
    const timer = window.setTimeout(() => setState("hidden"), 500);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <>
      <div
        className={`bonanza-outer-container${state !== "hidden" ? " visible" : ""}${state === "fading" ? " fading" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Sweet Bonanza offers"
        aria-hidden={state === "hidden"}
      >
        <div ref={boxRef} className={`bonanza-popup-container${state === "visible" ? " shake-animation" : ""}`}>
          <button type="button" className="bonanza-close" aria-label="Close" onClick={() => setState("fading")}>
            <CircleXmarkIcon />
          </button>
          {state !== "hidden" && <BonanzaCarousel />}
        </div>
      </div>
      <Link href="/sweet-bonanza" className="see-bonanza-btn">
        Sweet Bonanza
      </Link>
    </>
  );
}
