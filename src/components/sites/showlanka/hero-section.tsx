"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { heroImages, heroWords, tourRadarIframe } from "./data";
import { DeferredIframe } from "./deferred-iframe";
import { HeroEnquiryForm } from "./hero-enquiry-form";
import { GoogleGIcon } from "./icons";
import { TripadvisorBadge } from "./tripadvisor-badge";

const SLIDE_INTERVAL = 5000; // Owl Carousel autoplay default
const WORD_INTERVAL = 5000;

export function HeroSection() {
  const [slide, setSlide] = useState(0);
  // Number of word-rotation ticks. The source's first tick re-activates word 0,
  // so the first word stays up for two intervals.
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const slides = window.setInterval(() => setSlide((s) => (s + 1) % heroImages.length), SLIDE_INTERVAL);
    const words = window.setInterval(() => setTicks((t) => t + 1), WORD_INTERVAL);
    return () => {
      window.clearInterval(slides);
      window.clearInterval(words);
    };
  }, []);

  const active = ticks === 0 ? 0 : (ticks - 1) % heroWords.length;
  const prev = ticks === 0 ? -1 : (active - 1 + heroWords.length) % heroWords.length;

  return (
    <div className="hero-section-wrapper">
      <section className="carousel-content">
        <div className="inner-carousel-container">
          <div className="hero-slides" aria-roledescription="carousel">
            {heroImages.map((image, i) => (
              <div key={image.src} className={`hero-slide${i === slide ? " active" : ""}`} aria-hidden={i !== slide}>
                <img src={image.src} alt={image.alt} width={2400} height={1600} fetchPriority={i === 0 ? "high" : "auto"} />
              </div>
            ))}
          </div>
          <div className="overlay-tagline">
            <h1 className="hero-title">
              <span className="hero-prefix">Sri Lanka Tours:</span>
              <span className="hero-rotating" aria-live="polite">
                {heroWords.map((word, i) => (
                  <span
                    key={word}
                    className={`hero-word${i === active ? " is-active" : ""}${i === prev ? " is-prev" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>
            <p className="hero-subtitle">
              Custom Sri Lanka holiday packages with expert local guides — beaches, wildlife, culture &amp; adventure
              in one unforgettable trip.
            </p>
            {/* Phones: the hero is too short for the form, so this jumps to the copy below it */}
            <a className="btn common-btn hero-enquiry-jump" href="#hero-enquiry">
              Send an Inquiry
            </a>
            <HeroEnquiryForm className="hero-enquiry--overlay" />
          </div>
          <div className="hero-bottom">
            <div className="hero-review-badges">
              <div className="hero-tripadvisor-widget">
                <TripadvisorBadge />
              </div>
              <a
                className="hero-google-widget"
                href="https://www.google.com/maps?cid=3563717595747314560"
                target="_blank"
                rel="noopener"
              >
                <GoogleGIcon className="hero-google-widget__icon" />
                <span className="hero-google-widget__text">
                  <span className="hero-google-widget__rating">
                    <strong>4.7</strong> <span className="hero-google-widget__stars">★★★★★</span>
                  </span>
                  <span className="hero-google-widget__count">37 Google Reviews</span>
                </span>
              </a>
            </div>
            <div className="hero-tourradar-widget">
              <DeferredIframe src={tourRadarIframe} width={240} height={280} scrolling="no" title="TourRadar Reviews" />
            </div>
          </div>
        </div>
      </section>
      <HeroEnquiryForm className="hero-enquiry--below" id="hero-enquiry" />
    </div>
  );
}
