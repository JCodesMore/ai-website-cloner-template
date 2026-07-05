"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Zap,
  Activity,
  ShieldCheck,
  Leaf,
  Moon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Benefit {
  label: string;
  icon: LucideIcon;
  image: string;
  caption: string;
}

const BENEFITS: Benefit[] = [
  {
    label: "Énergie",
    icon: Zap,
    image: "/images/onday/Energie_2.png",
    caption: "Soutient une vitalité stable et durable, du matin au soir.",
  },
  {
    label: "Récupération",
    icon: Activity,
    // No dedicated "récupération" asset was provided; this motion-blurred
    // running shot is the closest fitness/effort-themed photo available.
    image: "/images/onday/Rectangle_8102_1.png",
    caption:
      "Régénère l'organisme en profondeur après l'effort et le stress quotidien.",
  },
  {
    label: "Immunité",
    icon: ShieldCheck,
    image: "/images/onday/Immunite_3.png",
    caption:
      "Active votre bouclier naturel pour un corps résistant en toute saison.",
  },
  {
    label: "Digestion",
    icon: Leaf,
    image: "/images/onday/Digestion_3.png",
    caption: "Régule le transit et apaise les ballonnements.",
  },
  {
    label: "Sommeil",
    icon: Moon,
    image: "/images/onday/Sommeil_698346db-fe68-49a2-9c90-442b3e7f08c0.png",
    caption:
      "Apaise le système nerveux pour un endormissement serein et réparateur.",
  },
  {
    label: "Peau, ongles & cheveux",
    icon: Sparkles,
    image: "/images/onday/Peau_ongles_cheveux_2.png",
    caption: "Fortifie les tissus et prévient le vieillissement cellulaire.",
  },
];

const PILLS = ["Complément à boire", "43 actifs en synergie", "100% français"];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const Icon = benefit.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl transition-all duration-500 ease-out",
        inView
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
      )}
      style={{ transitionDelay: inView ? `${index * 100}ms` : "0ms" }}
    >
      <Image
        src={benefit.image}
        alt={benefit.label}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
      />

      {/* Badge pill: icon chip + label, top-left */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 py-1.5 pl-1.5 pr-3.5 backdrop-blur-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e0ff0c]">
          <Icon className="h-3.5 w-3.5 text-[#003D2A]" strokeWidth={2.5} />
        </span>
        <span className="text-[13px] font-medium uppercase tracking-wide text-white">
          {benefit.label}
        </span>
      </div>

      {/* Bottom scrim + caption */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 px-4 pb-4 text-sm leading-snug text-white">
        {benefit.caption}
      </p>
    </div>
  );
}

export function BenefitsList() {
  return (
    <section className="w-full bg-[#003D2A] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Heading block */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/80">
            Tous vos nutriments essentiels, chaque matin
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full bg-white/10 px-4 py-1.5 text-[13px] text-white"
              >
                {pill}
              </span>
            ))}
          </div>

          <h2 className="font-heading mt-6 text-[32px] leading-tight text-white">
            Votre organisme renforcé en profondeur dès le premier mois
          </h2>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit, index) => (
            <BenefitCard key={benefit.label} benefit={benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsList;
