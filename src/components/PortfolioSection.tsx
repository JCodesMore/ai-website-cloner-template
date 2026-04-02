"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
  InstagramIcon,
  YouTubeIcon,
  TikTokIcon,
  LinkedInIcon,
  XTwitterIcon,
  FacebookIcon,
  RedditIcon,
  ThreadsIcon,
  WhatsAppIcon,
} from "@/components/icons";

import "swiper/css";
import "swiper/css/effect-coverflow";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { name: "Instagram", handle: "@dr.paruzzo", href: "https://instagram.com/dr.paruzzo", icon: InstagramIcon, color: "#E1306C", desc: "Contenido diario, reels, historias" },
  { name: "YouTube", handle: "@dr.paruzzo", href: "https://youtube.com/@dr.paruzzo", icon: YouTubeIcon, color: "#FF0000", desc: "Videos largos, análisis profundos" },
  { name: "TikTok", handle: "@dr.paruzzo", href: "https://tiktok.com/@dr.paruzzo", icon: TikTokIcon, color: "#00f2ea", desc: "Clips cortos, tips rápidos" },
  { name: "LinkedIn", handle: "drparuzzo", href: "https://linkedin.com/in/drparuzzo", icon: LinkedInIcon, color: "#0A66C2", desc: "Networking profesional" },
  { name: "X / Twitter", handle: "@DrParuzzo", href: "https://x.com/DrParuzzo", icon: XTwitterIcon, color: "#ffffff", desc: "Opiniones, threads, debates" },
  { name: "Facebook", handle: "dr.paruzzo", href: "https://facebook.com/dr.paruzzo", icon: FacebookIcon, color: "#1877F2", desc: "Comunidad, eventos, lives" },
  { name: "IG Animaciones", handle: "@dr.paruzzo_animaciones", href: "https://instagram.com/dr.paruzzo_animaciones", icon: InstagramIcon, color: "#C13584", desc: "Animaciones 3D médicas" },
  { name: "TikTok Anim", handle: "@dr.paruzzo_animaciones", href: "https://tiktok.com/@dr.paruzzo_animaciones", icon: TikTokIcon, color: "#69C9D0", desc: "Clips de animaciones" },
  { name: "Reddit", handle: "dr_paruzzo", href: "https://reddit.com/user/dr_paruzzo", icon: RedditIcon, color: "#FF4500", desc: "Discusiones, AMAs" },
  { name: "Threads", handle: "@dr.paruzzo", href: "https://threads.net/@dr.paruzzo", icon: ThreadsIcon, color: "#ffffff", desc: "Conversaciones casuales" },
  { name: "WhatsApp", handle: "+54 358 418 9267", href: "https://wa.me/543584189267", icon: WhatsAppIcon, color: "#25D366", desc: "Mensajes directos" },
];

export function PortfolioSection() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ─── Heading: SplitType word blur reveal ─── */
      if (headingRef.current) {
        const split = new SplitType(headingRef.current, {
          types: "words",
          tagName: "span",
        });
        if (split.words) {
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
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          });
        }
      }

      /* ─── Carousel entrance ─── */
      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="portfolio-trigger"
      className="relative w-full overflow-hidden px-6 py-32 md:px-12"
    >
      {/* Tag + Heading */}
      <div className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <StarIcon className="h-3 w-3 animate-[starSpin_8s_linear_infinite]" />
          <span className="text-small">redes</span>
          <StarIcon className="h-3 w-3 animate-[starSpin_8s_linear_infinite]" />
        </div>

        <div ref={headingRef}>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 7.3vw, 105px)",
              fontWeight: 300,
              lineHeight: 0.85,
              textTransform: "uppercase",
            }}
          >
            Encontrame en todos lados
          </h2>
        </div>
      </div>

      {/* Swiper Carousel — 3D Coverflow effect */}
      <div ref={carouselRef} className="relative" style={{ perspective: "1200px" }}>
        <Swiper
          modules={[Navigation, FreeMode, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 8,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          slidesPerView={2.5}
          spaceBetween={20}
          freeMode
          grabCursor
          data-cursor-drag
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full"
        >
          {socials.map((social) => (
            <SwiperSlide key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-[500px] flex-col items-center justify-center gap-6 rounded-xl border border-white/8 transition-all duration-700 hover:border-white/20 hover:brightness-110"
                style={{
                  background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(10,22,40,0.95) 60%, ${social.color}08 100%)`,
                }}
              >
                {/* Icon */}
                <div className="transition-transform duration-500 group-hover:scale-125">
                  <social.icon className="h-16 w-16 text-white/60 transition-colors duration-500 group-hover:text-white" />
                </div>

                {/* Name */}
                <span className="font-display text-[32px] font-light uppercase leading-tight text-white">
                  {social.name}
                </span>

                {/* Handle */}
                <span className="text-[11px] uppercase tracking-[0.08em] text-white/40">
                  {social.handle}
                </span>

                {/* Description */}
                <span className="max-w-[200px] text-center text-[10px] uppercase tracking-[0.05em] text-white/25 transition-colors duration-500 group-hover:text-white/50">
                  {social.desc}
                </span>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        <div className="mt-8 flex items-center gap-6">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
            className="transition-all duration-300 hover:opacity-60 hover:scale-110"
          >
            <ArrowLeftIcon className="h-5 w-3" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
            className="transition-all duration-300 hover:opacity-60 hover:scale-110"
          >
            <ArrowRightIcon className="h-5 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
}
