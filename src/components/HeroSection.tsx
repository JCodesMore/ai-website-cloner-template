"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { StarIcon } from "@/components/icons";
import { NeuralNetworkCanvas } from "@/components/neural-network-canvas";
import { useDeviceCapability } from "@/hooks/use-device-capability";

const BrainScene = dynamic(
  () => import("@/components/3d/brain-scene").then((m) => m.BrainScene),
  { ssr: false },
);

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const subHeroRef = useRef<HTMLDivElement>(null);
  const subHeroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const { canRender3D } = useDeviceCapability();
  const blobBottomRef = useRef<HTMLDivElement>(null);
  const blobTopRef = useRef<HTMLDivElement>(null);
  const blobCenterRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─── Hero title entrance: "DR. PARUZZO" ─── */
      if (heroTitleRef.current) {
        const titleSplit = new SplitType(heroTitleRef.current, {
          types: "chars",
          tagName: "span",
        });
        if (titleSplit.chars) {
          gsap.set(titleSplit.chars, {
            opacity: 0,
            filter: "blur(12px)",
            y: 40,
            scale: 0.9,
          });
          // Plays after preloader (≈2.8s delay)
          gsap.to(titleSplit.chars, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            stagger: 0.04,
            delay: 2.8,
          });
        }
      }

      /* ─── Scroll indicator fade in ─── */
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 3.8 },
        );
      }

      /* ─── Hero parallax — image scales and fades ─── */
      gsap.to(".hero-bg-image", {
        scale: 1.15,
        opacity: 0.2,
        scrollTrigger: {
          trigger: heroContentRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ─── Brain container parallax (for both 3D and fallback) ─── */
      if (brainRef.current) {
        gsap.to(brainRef.current, {
          y: -200,
          scale: 0.85,
          scrollTrigger: {
            trigger: heroContentRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ─── Sub-hero heading: SplitType word blur reveal ─── */
      if (subHeroHeadingRef.current) {
        const split = new SplitType(subHeroHeadingRef.current, {
          types: "words",
          tagName: "span",
        });
        if (split.words && split.words.length > 0) {
          gsap.set(split.words, {
            opacity: 0,
            filter: "blur(0.8vw)",
            scale: 0.95,
            willChange: "opacity, filter, transform",
          });
          gsap.to(split.words, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.8,
            ease: "power1.inOut",
            stagger: { each: 0.4 / split.words.length },
            scrollTrigger: {
              trigger: subHeroHeadingRef.current,
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          });
        }
      }

      /* ─── Description paragraph: line-by-line reveal ─── */
      if (descRef.current) {
        const descSplit = new SplitType(descRef.current, {
          types: "lines",
          tagName: "span",
        });
        if (descSplit.lines) {
          gsap.fromTo(
            descSplit.lines,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power1.in",
              stagger: 0.15,
              scrollTrigger: {
                trigger: descRef.current,
                start: "top 90%",
                scrub: false,
                toggleActions: "play none none none",
              },
            },
          );
        }
      }

      /* ─── Blue blob parallax ─── */
      [
        { el: blobBottomRef.current, y: -120 },
        { el: blobTopRef.current, y: 100 },
        { el: blobCenterRef.current, y: -60 },
      ].forEach(({ el, y }) => {
        if (!el) return;
        gsap.to(el, {
          y,
          scrollTrigger: {
            trigger: subHeroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero-trigger" className="relative" style={{ height: "2755px" }}>
      {/* ───── Part 1: Hero Content ───── */}
      <div ref={heroContentRef} className="relative h-screen overflow-hidden">
        {/* Hero background image */}
        <div className="hero-bg-image absolute inset-0">
          <Image
            src="/images/dr-paruzzo-banner-1.webp"
            alt="Dr. Paruzzo — Donde convergen cuerpo, mente y tecnología"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </div>

        {/* 3D Brain scene (desktop) or static fallback (mobile) */}
        <div
          ref={brainRef}
          className="absolute left-1/2 top-[50%] z-[5] aspect-square w-[40vw] max-w-[550px] -translate-x-1/2 -translate-y-1/2"
        >
          {canRender3D ? (
            <BrainScene scrollTrigger="#hero-trigger" />
          ) : (
            <div style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 20px rgba(0,212,255,0.3))" }}>
              <Image
                src="/images/dr-paruzzo-brain.webp"
                alt="Neurociencia e Inteligencia Artificial"
                width={500}
                height={500}
                className="h-auto w-full"
                priority
              />
            </div>
          )}
        </div>

        {/* Neural network synapses background */}
        <NeuralNetworkCanvas
          nodeCount={canRender3D ? 100 : 60}
          pulseCount={canRender3D ? 25 : 15}
          opacity={0.25}
        />

        {/* Heading: DR. PARUZZO — entrance animation via SplitType */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <h1
            ref={heroTitleRef}
            className="font-display text-center text-white"
            style={{
              fontSize: "clamp(8rem, 13.5vw, 195px)",
              fontWeight: 300,
              lineHeight: 0.76,
              textTransform: "uppercase",
            }}
          >
            <span className="block">Dr.</span>
            <span className="block">Paruzzo</span>
          </h1>
        </div>

        {/* Circular scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
          style={{ opacity: 0 }}
        >
          <svg
            width="80"
            height="40"
            viewBox="0 0 80 40"
            fill="none"
            className="mb-1 opacity-40"
          >
            <path
              d="M 5 38 A 35 35 0 0 1 75 38"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
          <span className="text-[10px] font-normal uppercase tracking-[0.15em] text-white/80">
            Scroll down
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className="mt-1 text-white/60"
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </div>

      {/* ───── Star decoration ───── */}
      <div className="flex items-center justify-center py-12">
        <StarIcon className="h-4 w-4 animate-[starSpin_12s_linear_infinite]" />
      </div>

      {/* ───── Part 2: Sub-Hero ───── */}
      <div
        ref={subHeroRef}
        className="relative overflow-hidden"
        style={{ height: "1855px" }}
      >
        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/blur-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        >
          <source src="/videos/blur-bg.webm" type="video/webm" />
          <source src="/videos/blur-bg.mp4" type="video/mp4" />
        </video>

        {/* Teal glow blob — bottom right (strong) */}
        <div
          ref={blobBottomRef}
          className="pointer-events-none absolute -bottom-20 -right-20 rounded-full opacity-90"
          style={{ width: "900px", height: "900px", background: "radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)", filter: "blur(40px)" }}
          aria-hidden="true"
        />

        {/* Gold glow blob — top left */}
        <div
          ref={blobTopRef}
          className="pointer-events-none absolute -left-40 top-[15%] rounded-full opacity-50"
          style={{ width: "800px", height: "800px", background: "radial-gradient(circle, rgba(200,149,62,0.3) 0%, transparent 70%)", filter: "blur(40px)" }}
          aria-hidden="true"
        />

        {/* Teal glow blob — center for text area */}
        <div
          ref={blobCenterRef}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
          style={{ width: "1200px", height: "1200px", background: "radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)", filter: "blur(60px)" }}
          aria-hidden="true"
        />

        {/* Sub-hero content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          {/* Large heading — SplitType blur reveal */}
          <h2
            ref={subHeroHeadingRef}
            className="text-center font-light"
            style={{
              fontSize: "clamp(4rem, 15vw, 220px)",
              lineHeight: 0.88,
              textTransform: "uppercase",
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontWeight: 200,
              color: "rgba(255,255,255,1)",
              letterSpacing: "-0.03em",
            }}
          >
            DONDE CONVERGEN CUERPO MENTE Y TECNOLOGÍA
          </h2>

          {/* Horizontal rule + star */}
          <div className="relative mt-28 flex w-full items-center justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
            <StarIcon className="relative z-10 h-3 w-3 animate-[starSpin_8s_linear_infinite]" />
          </div>

          {/* Description paragraph — line-by-line reveal */}
          <p
            ref={descRef}
            className="text-small mx-auto mt-10 max-w-[620px] text-center uppercase tracking-[0.05em] text-white/70"
            style={{ lineHeight: 1.9, fontSize: "11px" }}
          >
            Médico, psicólogo y explorador de inteligencia artificial.
            Creo contenido, herramientas y experiencias que conectan
            la salud, la mente y la tecnología — para profesionales
            y para todos los que buscan entender el futuro.
          </p>

          {/* Vertical line + CTA Button */}
          <div className="mt-16 flex flex-col items-center gap-0">
            <div className="h-24 w-px bg-white/15" />
            <a
              href="#services"
              className="text-small mt-4 inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3 text-[11px] uppercase tracking-[0.1em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]"
            >
              Explorar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
