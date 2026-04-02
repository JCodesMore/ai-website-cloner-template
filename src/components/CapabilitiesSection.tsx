"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { StarIcon } from "@/components/icons";

gsap.registerPlugin(ScrollTrigger);

interface CapabilityCard {
  number: string;
  title: string;
  description: string;
}

const CARDS: CapabilityCard[] = [
  {
    number: "(01)",
    title: "Artificial Flowers and Plants",
    description:
      "Low-maintenance, high-quality artificial plants for lasting indoor & outdoor aesthetics",
  },
  {
    number: "(02)",
    title: "Custom Event Decorations",
    description:
      "Tailored solutions for weddings, corporate events, and private parties",
  },
  {
    number: "(03)",
    title: "Modern Table Settings",
    description:
      "Elegant and modern table designs that complement every theme",
  },
  {
    number: "(04)",
    title: "Design Consultations",
    description:
      "Expert advice on theme development, color schemes, and layout planning",
  },
];

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─── Heading: SplitType word blur reveal ─── */
      if (headingRef.current) {
        const split = new SplitType(headingRef.current, {
          types: "words",
          tagName: "span",
        });
        if (split.words && split.words.length > 0) {
          gsap.set(split.words, {
            opacity: 0,
            filter: "blur(0.8vw)",
            scale: 0.95,
          });
          gsap.to(split.words, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.8,
            ease: "power1.inOut",
            stagger: { each: 0.4 / split.words.length },
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              end: "top 35%",
              scrub: true,
            },
          });
        }
      }

      /* ─── Description: line-by-line reveal ─── */
      if (descRef.current) {
        const descSplit = new SplitType(descRef.current, {
          types: "lines",
          tagName: "span",
        });
        if (descSplit.lines) {
          gsap.fromTo(
            descSplit.lines,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power1.in",
              stagger: 0.15,
              scrollTrigger: {
                trigger: descRef.current,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      }

      /* ─── Mirror image parallax ─── */
      gsap.to(".mirror-parallax", {
        y: -100,
        scrollTrigger: {
          trigger: ".mirror-parallax",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ─── Capability cards: scroll-driven entrance + exit ─── */
      const cardEls = cardsContainerRef.current?.querySelectorAll<HTMLDivElement>(".cap-card");
      if (cardEls) {
        cardEls.forEach((card) => {
          // Entrance: scale up + fade in + slight rotateX
          gsap.fromTo(
            card,
            {
              opacity: 0,
              scale: 0.85,
              rotateX: 8,
              y: 60,
            },
            {
              opacity: 1,
              scale: 1,
              rotateX: 0,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card.closest(".cap-card-wrapper"),
                start: "top 70%",
                end: "top 30%",
                scrub: true,
              },
            },
          );

          // Exit: scale down slightly as you scroll past
          gsap.to(card, {
            scale: 0.92,
            opacity: 0.7,
            scrollTrigger: {
              trigger: card.closest(".cap-card-wrapper"),
              start: "bottom 55%",
              end: "bottom 15%",
              scrub: true,
            },
          });
        });
      }

      /* ─── Blue blob parallax ─── */
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          y: (i % 2 === 0 ? -1 : 1) * (80 + i * 30),
          scrollTrigger: {
            trigger: sectionRef.current,
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
    <section ref={sectionRef} id="services" className="relative overflow-hidden bg-black">
      {/* Background blue gradient blobs — intense + parallax */}
      <div ref={(el) => { blobRefs.current[0] = el; }} className="pointer-events-none absolute -left-40 top-0 h-[1600px] w-[1000px] opacity-80">
        <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
      </div>
      <div ref={(el) => { blobRefs.current[1] = el; }} className="pointer-events-none absolute -right-40 top-[30%] h-[1600px] w-[1000px] opacity-70">
        <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
      </div>
      <div ref={(el) => { blobRefs.current[2] = el; }} className="pointer-events-none absolute bottom-[5%] left-1/4 h-[1600px] w-[1000px] opacity-50">
        <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
      </div>
      <div ref={(el) => { blobRefs.current[3] = el; }} className="pointer-events-none absolute right-1/4 top-[60%] h-[1200px] w-[800px] opacity-40">
        <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-2xl" aria-hidden="true" />
      </div>

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="pointer-events-none absolute top-[20%] left-1/2 z-0 h-auto w-full max-w-[1000px] -translate-x-1/2 opacity-15"
      >
        <source src="/videos/orchid-video.webm" type="video/webm" />
      </video>

      {/* Content */}
      <div className="relative z-10">
        {/* Part 1: Section Heading — SplitType blur reveal */}
        <div className="px-8 pb-20 pt-32">
          <div className="mb-12 flex items-center gap-2">
            <StarIcon className="h-3 w-3 animate-[starSpin_10s_linear_infinite]" />
            <span className="text-[10.5px] font-normal uppercase tracking-[0.05em] text-white">
              capabilities
            </span>
          </div>

          <div ref={headingRef}>
            <h2 className="text-left" style={{ fontSize: "clamp(2.5rem, 7.3vw, 105px)", fontWeight: 300, lineHeight: 0.76, textTransform: "uppercase" }}>
              Let&apos;s make
            </h2>
            <h2 className="text-right" style={{ fontSize: "clamp(2.5rem, 7.3vw, 105px)", fontWeight: 300, lineHeight: 0.76, textTransform: "uppercase" }}>
              the moment
            </h2>
            <h2 className="text-left" style={{ fontSize: "clamp(2.5rem, 7.3vw, 105px)", fontWeight: 300, lineHeight: 0.76, textTransform: "uppercase" }}>
              blossom
            </h2>
          </div>
        </div>

        {/* Part 2: Description + CTA */}
        <div className="flex items-start justify-between px-8 pb-24">
          <div className="flex items-center gap-2">
            <StarIcon className="h-3 w-3" />
            <span className="text-[10.5px] font-normal uppercase tracking-[0.05em] text-white">
              capabilities
            </span>
          </div>
          <div className="flex max-w-[300px] flex-col items-end gap-6">
            <p ref={descRef} className="text-[10.5px] uppercase leading-[1.6] tracking-[0.05em] text-white/60">
              What fades in form can still remain in feeling. Our arrangements
              reflect your moment — its light, its tone, its soul — and let it
              echo gently, even after it&apos;s gone.
            </p>
            <a
              href="#contact"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[10.5px] uppercase tracking-[0.05em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(100,150,255,0.1)]"
            >
              Plan Your Event
            </a>
          </div>
        </div>

        {/* Part 3: Mirror Image with parallax */}
        <div className="relative flex justify-center pb-32">
          <div className="mirror-parallax relative w-[65vw]">
            <Image
              src="/images/mirror.webp"
              alt="Decorative mirror"
              width={1200}
              height={800}
              className="h-auto w-full opacity-80"
              sizes="65vw"
            />
          </div>
        </div>

        {/* Part 4: Capability Cards — 3D sticky stack with scroll-driven animations */}
        <div ref={cardsContainerRef} className="relative" style={{ perspective: "1200px" }}>
          {CARDS.map((card, i) => (
            <div key={card.number} className="cap-card-wrapper h-[1800px]">
              <div
                className="sticky top-1/2 flex -translate-y-1/2 items-center justify-center"
                style={{ zIndex: i + 1 }}
              >
                <div
                  className="cap-card relative flex h-[540px] w-[480px] flex-col items-center justify-between overflow-hidden rounded-[24px] px-10 pb-12 pt-16"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotate(${i % 2 === 0 ? 3 : -3}deg)`,
                    background: "linear-gradient(180deg, rgba(20,40,100,0.5) 0%, rgba(5,10,30,0.9) 50%, rgba(10,20,50,0.7) 100%)",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(30,64,175,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Glassmorphism glow at top */}
                  <div
                    className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2"
                    style={{ width: "400px", height: "300px", background: "radial-gradient(ellipse, rgba(40,80,200,0.25) 0%, transparent 70%)" }}
                  />

                  {/* Border overlay */}
                  <Image
                    src="/images/capabilities-border.webp"
                    alt=""
                    fill
                    className="pointer-events-none rounded-[24px] object-cover opacity-60"
                    sizes="480px"
                  />

                  {/* Card content */}
                  <div className="relative z-10 flex h-full flex-col items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-white/70">
                      {card.number}
                    </span>
                    <h3 className="font-display text-center text-[56px] font-light uppercase leading-[0.88] text-white">
                      {card.title}
                    </h3>
                    <p className="max-w-[320px] text-center text-[11px] uppercase leading-[1.7] tracking-[0.06em] text-white/55">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
