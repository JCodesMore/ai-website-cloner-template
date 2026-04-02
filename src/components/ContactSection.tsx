"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import {
  StarIcon,
  ArrowRightIcon,
  WhatsAppIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  FacebookIcon,
  TikTokIcon,
  XTwitterIcon,
  RedditIcon,
  ThreadsIcon,
} from "@/components/icons";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const blobRightRef = useRef<HTMLDivElement>(null);
  const blobLeftRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("loading");
    setFormError("");

    const data = new FormData(e.currentTarget);
    const body = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      message: data.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
        setFormError(json.error ?? "Error al enviar");
      }
    } catch {
      setFormStatus("error");
      setFormError("Error de conexión. Intentá de nuevo.");
    }
  }

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
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00d4ff]/20 blur-[150px]" />
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
            ¿Querés integrar IA en tu práctica profesional? ¿Tenés una idea, un proyecto o simplemente curiosidad? Hablemos.
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
            Conectemos y construyamos juntos
          </h2>
        </div>

        {/* Contact form — stagger entrance */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto max-w-[900px]"
        >
          <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                aria-label="Nombre"
                className="input-field"
                autoComplete="name"
                required
              />
            </div>
            <div className="row-span-2">
              <textarea
                name="message"
                placeholder="¿En qué puedo ayudarte?"
                aria-label="Mensaje"
                className="input-field resize-none md:h-full"
                rows={4}
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                aria-label="Teléfono"
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
                aria-label="Email"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={formStatus === "loading"}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6 py-3 uppercase text-white transition-all duration-300 hover:border-[#00d4ff]/60 hover:shadow-[0_0_25px_rgba(0,212,255,0.15)] disabled:opacity-50"
              style={{ fontSize: "10.5px", letterSpacing: "0.05em" }}
            >
              {formStatus === "loading" ? "Enviando..." : "Enviar mensaje"}
              <ArrowRightIcon className="h-3 w-2" />
            </button>
            <div aria-live="polite" className="text-[10px] uppercase tracking-[0.05em]">
              {formStatus === "success" && (
                <span className="text-[#00d4ff]">Mensaje enviado. Te respondo pronto.</span>
              )}
              {formStatus === "error" && (
                <span className="text-red-400">{formError}</span>
              )}
            </div>
          </div>
        </form>

        {/* Social Networks Grid */}
        <div className="mx-auto mt-20 max-w-[900px]">
          <div className="mb-8 flex items-center justify-center gap-3">
            <StarIcon className="h-3 w-3 text-white/60" />
            <span className="uppercase tracking-[0.05em] text-white" style={{ fontSize: "10.5px" }}>
              Encontrame en todas las plataformas
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/543584189267" },
              { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com/dr.paruzzo" },
              { icon: InstagramIcon, label: "IG Animaciones", href: "https://instagram.com/dr.paruzzo_animaciones" },
              { icon: YouTubeIcon, label: "YouTube", href: "https://youtube.com/@dr.paruzzo" },
              { icon: TikTokIcon, label: "TikTok", href: "https://tiktok.com/@dr.paruzzo" },
              { icon: TikTokIcon, label: "TikTok Animaciones", href: "https://tiktok.com/@dr.paruzzo_animaciones" },
              { icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com/in/drparuzzo" },
              { icon: XTwitterIcon, label: "X / Twitter", href: "https://x.com/DrParuzzo" },
              { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com/dr.paruzzo" },
              { icon: RedditIcon, label: "Reddit", href: "https://reddit.com/user/dr_paruzzo" },
              { icon: ThreadsIcon, label: "Threads", href: "https://threads.net/@dr.paruzzo" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[10px] uppercase tracking-[0.05em] text-white/70 transition-all duration-300 hover:border-[#00d4ff]/40 hover:text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.1)]"
              >
                <social.icon className="h-4 w-4" />
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
