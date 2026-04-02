"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, EffectCoverflow } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from "@/components/icons";

import "swiper/css";
import "swiper/css/effect-coverflow";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Project-8", image: "/images/project-8.webp", year: "2024" },
  { name: "Project 1", image: "/images/project-1.webp", year: "2024" },
  { name: "Project 2", image: "/images/project-2.webp", year: "2024" },
  { name: "Project 3", image: "/images/project-3.webp", year: "2024" },
  { name: "Project 4", image: "/images/project-4.webp", year: "2024" },
  { name: "Project 5", image: "/images/project-5.webp", year: "2024" },
  { name: "Project 6", image: "/images/project-6.webp", year: "2024" },
  { name: "Project 7", image: "/images/project-7.webp", year: "2024" },
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
          <span className="text-small">portfolio</span>
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
            Our Work, in full bloom
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
          {projects.map((project) => (
            <SwiperSlide key={project.name}>
              <div className="group flex flex-col">
                <div className="overflow-hidden rounded-sm">
                  <Image
                    src={project.image}
                    alt={project.name}
                    width={500}
                    height={650}
                    className="h-auto w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                    sizes="(max-width: 768px) 80vw, 35vw"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-small">{project.year}</span>
                  <span className="text-small text-white/50 uppercase">
                    {project.name}
                  </span>
                </div>
              </div>
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
