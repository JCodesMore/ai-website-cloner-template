"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ASSETS } from "./data";

const SPEED = 0.6;

export function TourOfTheMonth() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Same parallax as theme.js: translateY((scrollTop - elementTop) * 0.6) while in view.
  // Like jQuery's offset(), elementTop includes the transform already applied.
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    const onScroll = () => {
      const scroll = window.scrollY;
      const top = el.getBoundingClientRect().top + scroll;
      const bottom = top + el.offsetHeight;
      if (scroll + window.innerHeight >= top && scroll <= bottom) {
        el.style.transform = `translateY(${(scroll - top) * SPEED}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="special-tour-section">
      <article className="fullpage-container">
        <div
          ref={bgRef}
          className="bg-image-container"
          role="img"
          aria-label="Tour of the month"
          style={{ backgroundImage: `url('${ASSETS}/images/lotus-tower.jpg')` }}
        />
        <div className="flex flex-col text-content">
          <p className="uppercase-subtitle border-after">Discover Unforgettable Adventures</p>
          <h2 className="section-title">Tour of the month</h2>
          <p>
            This month, we invite you to embark on an unforgettable journey with history, culture, and natural beauty
            intertwine to create an experience like no other
          </p>
          <Link className="common-btn" href="/sri-lanka-express">
            Read More<span className="sr-only"> about Tour of the month</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
