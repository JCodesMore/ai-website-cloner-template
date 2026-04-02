"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { StarIcon } from "@/components/icons";
import { NeuralNetworkCanvas } from "@/components/neural-network-canvas";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    number: "(01)",
    title: "Médico y Psicólogo",
    description:
      "No soy un tech bro hablando de IA. Soy profesional de la salud — entiendo el cuerpo, la mente y cómo la tecnología impacta en ambos.",
  },
  {
    number: "(02)",
    title: "Sin barreras, sin jerga",
    description:
      "Traduzco lo complejo en algo que podés usar hoy. Ya seas profesional de la salud o simplemente alguien curioso, el contenido es para vos.",
  },
  {
    number: "(03)",
    title: "Todo abierto, todo real",
    description:
      "Comparto prompts, agentes, análisis y herramientas que realmente uso. Sin humo, sin venta de cursos vacíos — lo que funciona, lo regalo.",
  },
];

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

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
              end: "top 30%",
              scrub: true,
            },
          });
        }
      }

      /* ─── Benefit items: stagger fade + slide ─── */
      const items = itemsRef.current?.querySelectorAll<HTMLDivElement>(".benefit-item");
      if (items) {
        items.forEach((item) => {
          // Animate the border line drawing
          gsap.fromTo(
            item,
            { opacity: 0, y: 40, clipPath: "inset(0 100% 0 0)" },
            {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0% 0 0)",
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                end: "top 55%",
                scrub: true,
              },
            },
          );
        });
      }

      /* ─── Blue blob parallax ─── */
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          y: (i % 2 === 0 ? -1 : 1) * (70 + i * 25),
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
    <section
      ref={sectionRef}
      id="benefits"
      className="relative w-full overflow-hidden px-6 py-32 md:px-12"
    >
      {/* Background blue blobs — intense + parallax */}
      <div className="pointer-events-none absolute inset-0">
        <div ref={(el) => { blobRefs.current[0] = el; }} className="absolute -right-40 top-0 h-[1200px] w-[900px] opacity-70">
          <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
        </div>
        <div ref={(el) => { blobRefs.current[1] = el; }} className="absolute -left-40 bottom-0 h-[1000px] w-[800px] opacity-45">
          <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-xl" aria-hidden="true" />
        </div>
        <div ref={(el) => { blobRefs.current[2] = el; }} className="absolute right-1/4 bottom-1/4 h-[800px] w-[600px] opacity-30">
          <Image src="/images/blue-blur.webp" alt="" fill className="object-contain blur-2xl" aria-hidden="true" />
        </div>
      </div>

      {/* Neural network background */}
      <NeuralNetworkCanvas nodeCount={60} pulseCount={12} opacity={0.12} />

      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, transparent 40%, rgba(200,149,62,0.1) 80%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Tag + Sub-heading */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <StarIcon className="h-3 w-3 animate-[starSpin_8s_linear_infinite]" />
            <span className="text-small">por qué</span>
            <StarIcon className="h-3 w-3 animate-[starSpin_8s_linear_infinite]" />
          </div>
          <span className="text-small text-white/60">
            por qué Dr. Paruzzo
          </span>
        </div>

        {/* Large Heading — SplitType */}
        <div ref={headingRef} className="mb-24">
          <h2
            style={{
              fontSize: "clamp(2.5rem, 7.3vw, 105px)",
              fontWeight: 300,
              lineHeight: 0.76,
              textTransform: "uppercase",
            }}
          >
            La diferencia está en quién te lo cuenta
          </h2>
        </div>

        {/* Benefits List */}
        <div ref={itemsRef} className="flex flex-col gap-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.number}
              className="benefit-item flex flex-col items-start gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center md:gap-12"
            >
              <span className="text-small shrink-0 text-white/70">
                {benefit.number}
              </span>
              <h3 className="text-heading-small flex-1">{benefit.title}</h3>
              <p className="text-small max-w-[450px] leading-[1.6] text-white/40">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
