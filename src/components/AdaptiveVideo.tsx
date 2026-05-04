"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { videoUrl } from "@/lib/video";

interface AdaptiveVideoProps {
  src4k?: string;
  src1080: string;
  src720?: string;
  src480?: string;
  poster: string;
  className?: string;
  objectPosition?: string;
  mediaFilter?: string;
  playbackRate?: number;
  priority?: boolean; // load immediately vs lazy
  posterAlt?: string;
  description?: string;
}

export function AdaptiveVideo({
  src4k,
  src1080,
  src720,
  src480,
  poster,
  className = "",
  objectPosition = "center",
  // Brightness was 1.34 — pushed footage too hot on desktop monitors. 1.10
  // gives a subtle natural lift while keeping the original color grading.
  // If you want it brighter on a specific instance, override via prop.
  mediaFilter = "brightness(1.10) saturate(1.08) contrast(1.01)",
  playbackRate = 1,
  priority = false,
  posterAlt = "Sea of Cortez coastline near La Ventana, Baja California Sur, Mexico",
  description = "Sea of Cortez footage near La Ventana, Baja California Sur. Crystal blue waters, desert coastline, and Cerralvo Island visible in the distance — this is the launch zone for every Bajablue Tours marine expedition.",
}: AdaptiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);
  const mediaStyle: CSSProperties = { objectPosition, filter: mediaFilter };

  // Track in-viewport state so we only DECODE the video that's actually
  // on screen. Mobile browsers have ~4-8 hardware video decoders. When
  // multiple <video> elements run autoplay+loop in parallel, they thrash
  // decoder slots and produce a 1-on/1-off stutter. We pause off-screen
  // videos to keep only the visible one (or one near-visible) decoding.
  //
  // Two thresholds:
  //  - rootMargin 400px → load (mount) the video before it enters viewport
  //  - rootMargin 0px → play/pause based on actual visibility
  const [inViewport, setInViewport] = useState(priority);
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      setInViewport(true);
    }
    if (!containerRef.current) return;

    // Loader observer (mount the <video> element early — once)
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    loadObserver.observe(containerRef.current);

    // Visibility observer (PERSISTENT — controls play/pause as user scrolls).
    // Threshold 0.1 = at least 10% visible → considered "in view."
    const playObserver = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.1 },
    );
    playObserver.observe(containerRef.current);

    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [priority]);

  // Decoder-pressure-aware playback control.
  //
  // Why this is shaped the way it is:
  //  - Mobile browsers cap concurrent hardware video decoders (typically 4-8).
  //    When all 3 page videos play at once (Hero, Season, Tours) PLUS the
  //    Bubbles widget mascot WebMs, decoders thrash → 1-second-on/off stutter.
  //  - We pause when scrolled off-screen so only the visible video runs.
  //  - We do NOT listen on the `pause` event to auto-resume. The browser
  //    pauses naturally during buffering or backgrounding; manually calling
  //    play() in response races with the in-flight play promise and throws
  //    AbortError, which used to flash the poster on/off.
  //  - `playFailed` only trips on the FIRST failed play. Once the video has
  //    played at least once, transient errors don't flash the poster.
  useEffect(() => {
    const v = videoRef.current;
    if (!isVisible || !v) return;
    v.defaultPlaybackRate = playbackRate;
    v.playbackRate = playbackRate;
    if (v.readyState >= 2) setIsLoaded(true);

    let hasEverPlayed = false;

    const tryPlay = () => {
      if (!v.paused) return; // already running
      v.play()
        .then(() => {
          hasEverPlayed = true;
          setPlayFailed(false);
        })
        .catch(() => {
          if (!hasEverPlayed) setPlayFailed(true);
        });
    };

    const onPlay = () => {
      hasEverPlayed = true;
      setIsLoaded(true);
      setPlayFailed(false);
    };
    const onCanPlay = () => {
      setIsLoaded(true);
      // Only nudge if we want it playing AND it isn't yet
      if (inViewport && !hasEverPlayed) tryPlay();
    };
    const onVisibility = () => {
      // Tab returned to foreground — resume only if we want it playing
      if (!document.hidden && inViewport && v.paused) tryPlay();
    };

    // Apply current viewport state: play if visible, pause if not.
    if (inViewport) {
      tryPlay();
    } else {
      try { v.pause(); } catch { /* fine */ }
    }

    // iOS Low Power Mode unlock: any first user gesture allows muted autoplay
    const onFirstTouch = () => {
      if (inViewport) tryPlay();
      document.removeEventListener("touchstart", onFirstTouch);
      document.removeEventListener("click", onFirstTouch);
    };
    document.addEventListener("touchstart", onFirstTouch, { passive: true });
    document.addEventListener("click", onFirstTouch);

    v.addEventListener("playing", onPlay);
    v.addEventListener("canplay", onCanPlay);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("canplay", onCanPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("touchstart", onFirstTouch);
      document.removeEventListener("click", onFirstTouch);
    };
  }, [isVisible, playbackRate, inViewport]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Visually hidden description for crawlers/screen readers (F17) */}
      <p className="sr-only">{description}</p>

      {/* Poster shown until video loads */}
      <img
        src={videoUrl(poster)}
        alt={posterAlt}
        width={1920}
        height={1080}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
          isLoaded && !playFailed ? "opacity-0" : "opacity-100"
        }`}
        style={mediaStyle}
      />

      {isVisible && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          poster={videoUrl(poster)}
          onLoadedData={() => setIsLoaded(true)}
          onClick={(e) => e.preventDefault()}
          className={`pointer-events-none w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded && !playFailed ? "opacity-100" : "opacity-0"
          }`}
          style={mediaStyle}
        >
          {/* Mobile first: smallest source */}
          {src480 && (
            <source
              media="(max-width: 640px)"
              src={videoUrl(src480)}
              type="video/mp4"
            />
          )}
          {/* Tablet */}
          {src720 && (
            <source
              media="(max-width: 1024px)"
              src={videoUrl(src720)}
              type="video/mp4"
            />
          )}
          {/* 4K is excellent on large screens, but too heavy for phone decoding. */}
          {src4k && (
            <source
              media="(min-width: 1024px)"
              src={videoUrl(src4k)}
              type="video/mp4"
            />
          )}
          {/* High-quality fallback, used by mobile when no smaller source is provided. */}
          <source src={videoUrl(src1080)} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
