"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ASSETS, googleReviews, tourRadarIframe } from "./data";
import { DeferredIframe } from "./deferred-iframe";
import { PlayIcon } from "./icons";
import { TripadvisorBadge } from "./tripadvisor-badge";

const VIDEO_ID = "Szkym8CIPes";
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}&list=PLglAFGJWHrBducvofQ0pYZ9lj8-SpQA2D`;
const AUTOPLAY_MS = 6000;

function VideoReview() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="col-lg-3 col-12 video-review-wrapper">
      <h4>Visual Chronicles: Narratives of Adventure in Motion</h4>
      <div className="video-container">
        <div className="video-inner-wrapper">
          <div
            className="bg-image"
            role="img"
            aria-label="Happy customer"
            style={{ backgroundImage: `url('${ASSETS}/images/review-pic.png')` }}
          />
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              width="100%"
              height={315}
              title="Happy customer"
            />
          ) : (
            <a
              href={VIDEO_URL}
              className="video-thumbnail"
              aria-label="Watch video: Happy customer"
              onClick={(event) => {
                event.preventDefault();
                setPlaying(true);
              }}
            >
              <span className="play-wrapper">
                <PlayIcon />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function TourRadarWidget() {
  return (
    <div className="tr-widget">
      <div className="tr-widget__head">
        <a href="https://www.tourradar.com/" target="_blank" title="TourRadar" rel="noopener">
          <div className="tr-widget__logo" />
        </a>
        <a href="https://www.tourradar.com/review#7578-134495" target="_blank" rel="noopener">
          <div className="tr-widget__write">
            <span>Leave a review</span>
          </div>
        </a>
      </div>
      <div className="tr-widget__operator" />
      <DeferredIframe src={tourRadarIframe} width={240} height={280} scrolling="no" title="TourRadar Reviews" />
    </div>
  );
}

function GoogleReviews() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [pauseKey, setPauseKey] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const last = googleReviews.length - 1;

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i >= last ? 0 : i + 1)), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [last, pauseKey]);

  const go = (next: number) => {
    setIndex(next);
    setOpen(null);
    setPauseKey((k) => k + 1);
  };

  return (
    <div className="ti-widget" aria-roledescription="carousel" aria-label="Google reviews">
      <div className="ti-widget-container">
        <div className="ti-reviews-container">
          {index > 0 && (
            <button type="button" className="ti-nav ti-prev" aria-label="Previous review" onClick={() => go(index - 1)} />
          )}
          <button
            type="button"
            className="ti-nav ti-next"
            aria-label="Next review"
            onClick={() => go(index >= last ? 0 : index + 1)}
          />
          <div
            className="ti-reviews-viewport"
            onTouchStart={(event) => setTouchX(event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (touchX === null) return;
              const dx = event.changedTouches[0].clientX - touchX;
              setTouchX(null);
              if (dx < -40) go(index >= last ? 0 : index + 1);
              else if (dx > 40 && index > 0) go(index - 1);
            }}
          >
            <div className="ti-reviews-track" style={{ transform: `translateX(-${index * 100}%)` }}>
              {googleReviews.map((review, i) => (
                <div key={review.name} className="ti-review-item" aria-hidden={i !== index}>
                  <div className="ti-review-header">
                    <div className="ti-profile-img">
                      <img
                        src={`${ASSETS}/reviews/avatar-${i + 1}.png`}
                        alt={`${review.name} profile picture`}
                        width={40}
                        height={40}
                        loading="lazy"
                      />
                    </div>
                    <div className="ti-profile-details">
                      <div className="ti-name">{review.name}</div>
                      <div className="ti-date" title={review.dateFull}>
                        {review.date}
                      </div>
                    </div>
                  </div>
                  <div className="ti-review-content">
                    <span className="ti-stars">
                      {Array.from({ length: 5 }, (_, s) => (
                        <img
                          key={s}
                          className="ti-star"
                          src={`${ASSETS}/reviews/google-star-${s < review.stars ? "full" : "empty"}.svg`}
                          alt={`Google star ${s + 1}`}
                          width={17}
                          height={17}
                        />
                      ))}
                      <span className="ti-verified" title="Trustindex verifies that the original source of the review is Google." />
                    </span>
                    <div className={`ti-review-text${open === i ? " is-open" : ""}`}>{review.text}</div>
                    {review.text.length > 120 && (
                      <span className="ti-read-more">
                        <button type="button" onClick={() => setOpen(open === i ? null : i)} tabIndex={i === index ? 0 : -1}>
                          {open === i ? "Hide" : "Read more"}
                        </button>
                      </span>
                    )}
                    <div className="ti-platform-icon" title="Posted on Google">
                      <img src={`${ASSETS}/reviews/google-icon.svg`} alt="Google" width={20} height={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ti-controls-line" aria-hidden="true">
          <div
            className="dot"
            style={{ width: `${100 / googleReviews.length}%`, left: `${(index * 100) / googleReviews.length}%` }}
          />
        </div>
        <div className="ti-footer">
          <span className="nowrap">
            <strong>Google</strong> rating score:{" "}
          </span>
          <span className="nowrap">
            <strong>4.7</strong> of 5,{" "}
          </span>
          <br />
          <span className="nowrap">
            based on <strong>37 reviews</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export function ReviewSection() {
  return (
    <section className="review-section" id="review-section">
      <div className="container-fluid">
        <p className="uppercase-subtitle border-after">Traveler Tales</p>
        <h2 className="section-title">Inspiring Stories from Around the Globe</h2>
        <div className="row">
          <VideoReview />
          <div className="col-lg-9 col-12">
            <div className="row">
              <div className="col-12 col-lg-4 review-content tr-column">
                <div className="text-content flex-fill">
                  <TourRadarWidget />
                </div>
              </div>
              <div className="col-12 col-lg-4 review-content">
                <div className="text-content flex-fill">
                  <GoogleReviews />
                </div>
              </div>
              <div className="col-12 col-lg-4 review-content">
                <div className="text-content flex-fill">
                  {/* The widget's outer wrapper stretches; the bordered badge keeps its own height. */}
                  <div>
                    <TripadvisorBadge />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
