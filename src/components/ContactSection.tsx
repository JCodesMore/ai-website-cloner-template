"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { StarIcon, ArrowRightIcon } from "@/components/icons";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const blobRightRef = useRef<HTMLDivElement>(null);
  const blobLeftRef = useRef<HTMLDivElement>(null);

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
              start: "top 85%",
              end: "top 25%",
              scrub: true,
            },
          });
        }
      }

      /* ─── Description: line-by-line ─── */
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

      /* ─── Form fields: stagger entrance ─── */
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll(".input-field, button");
        gsap.fromTo(
          fields,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      /* ─── Blob parallax ─── */
      [
        { el: blobRightRef.current, y: -100 },
        { el: blobLeftRef.current, y: 80 },
      ].forEach(({ el, y }) => {
        if (!el) return;
        gsap.to(el, {
          y,
          scrollTrigger: {
            trigger: el.parentElement,
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
    <section id="contact" className="relative z-0 pt-32 pb-16 overflow-hidden">
      {/* Blue gradient blob backgrounds — intense + parallax */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/30 blur-[150px]" />
        <div ref={blobRightRef} className="absolute -right-40 bottom-0 h-[800px] w-[800px] opacity-70">
          <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
        </div>
        <div ref={blobLeftRef} className="absolute -left-40 top-1/4 h-[800px] w-[800px] opacity-50">
          <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
        </div>
      </div>

      {/* Background video */}
      <video
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.15]"
        src="/videos/blur-bg.webm"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1400px] px-8">
        {/* Tag block */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <StarIcon className="h-3 w-3 text-white/60" />
          <span
            className="uppercase tracking-[0.05em] text-white"
            style={{ fontSize: "10.5px" }}
          >
            Contact
          </span>
        </div>

        {/* Massive heading — SplitType blur reveal */}
        <div className="mb-16 flex items-start gap-8">
          {/* Left description */}
          <p
            ref={descRef}
            className="max-w-[200px] shrink-0 pt-2 uppercase leading-[1.7] text-white/60"
            style={{ fontSize: "10px", letterSpacing: "0.05em" }}
          >
            Planning a wedding, launch, or private event? Have a vision, a feeling, a moment you want to bring to life? We&apos;ll bring it into bloom.
          </p>

          {/* Large heading */}
          <h2
            ref={headingRef}
            style={{
              fontSize: "clamp(3rem, 9vw, 130px)",
              fontWeight: 200,
              lineHeight: 0.88,
              textTransform: "uppercase",
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            Let&apos;s create something unforgettable
          </h2>
        </div>

        {/* Contact form — stagger entrance */}
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto max-w-[900px]"
        >
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="input-field"
                autoComplete="name"
              />
            </div>
            <div className="row-span-2">
              <textarea
                name="message"
                placeholder="How can we help you"
                className="input-field resize-none md:h-full"
                rows={4}
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="input-field"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div className="md:col-start-2">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                className="input-field"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6 py-3 uppercase text-white transition-all duration-300 hover:border-white/60 hover:shadow-[0_0_25px_rgba(100,150,255,0.15)]"
              style={{ fontSize: "10.5px", letterSpacing: "0.05em" }}
            >
              Discuss the project
              <ArrowRightIcon className="h-3 w-2" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
