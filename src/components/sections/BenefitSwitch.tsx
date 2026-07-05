"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Claim {
  number: string;
  label: string;
  detail: string;
}

const CLAIMS: Claim[] = [
  {
    number: "01",
    label: "Énergie",
    detail:
      "Les vitamines B1, B2, B3, B5, B6, B8, B12, C et le magnésium contribuent à un métabolisme énergétique normal. L'ashwagandha et le ginseng aident à se sentir plus énergique.",
  },
  {
    number: "02",
    label: "Immunité",
    detail:
      "Les vitamines B6, B9, B12, D, C, le sélénium et le zinc contribuent au fonctionnement normal du système immunitaire.",
  },
  {
    number: "03",
    label: "Sommeil",
    detail:
      "Les vitamines B2, B3, B5, B6, B9, B12, C et le magnésium contribuent à réduire la fatigue. L'ashwagandha contribue à l'endormissement.",
  },
  {
    number: "04",
    label: "Digestion",
    detail:
      "Le gingembre favorise la digestion et le fonctionnement normal de l'estomac, ce qui participe au bien-être digestif. Le chardon-marie soutient la digestion.",
  },
  {
    number: "05",
    label: "Stress",
    detail:
      "L'ashwagandha possède des propriétés adaptogènes qui aident l'organisme à faire face au stress et favorisent la stabilité émotionnelle.",
  },
  {
    number: "06",
    label: "Glycémie",
    detail:
      "Le chrome, le zinc et le ginseng contribuent au maintien d'une glycémie normale.",
  },
  {
    number: "07",
    label: "Peau",
    detail:
      "Les vitamines B2, B3, B8 et le zinc contribuent au maintien d'une peau normale. La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale des os, cartilages, gencives, peau, dents.",
  },
  {
    number: "08",
    label: "Focus",
    detail:
      "Les vitamines B1, B3, B6, B8, B12, C et le magnésium contribuent à des fonctions psychologiques normales. L'ashwagandha et le ginseng contribuent à une activité mentale et cognitive optimale.",
  },
];

function AccordionRow({ claim }: { claim: Claim }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left sm:py-5"
      >
        <span className="flex items-baseline gap-3">
          <sup className="text-xs font-medium text-white/50">
            {claim.number}
          </sup>
          <span className="text-base font-medium text-white sm:text-[17px]">
            {claim.label}
          </span>
        </span>
        <Plus
          aria-hidden="true"
          strokeWidth={1.5}
          className={cn(
            "size-5 shrink-0 text-white transition-transform duration-300 ease-out",
            isOpen && "rotate-45",
          )}
        />
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <p className="max-w-md text-sm leading-relaxed text-white/70">
            {claim.detail}
          </p>
        </div>
      </div>
    </li>
  );
}

export function BenefitSwitch() {
  const leftColumn = CLAIMS.slice(0, 4);
  const rightColumn = CLAIMS.slice(4);

  return (
    <section className="w-full bg-[#003D2A]">
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[500px]">
        <Image
          src="/images/onday/Site_image_toggle.png"
          alt="Coureur traversant un paysage de canyon au lever du soleil"
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex w-[100px] items-center justify-between gap-3 sm:w-[140px]">
            <span className="text-2xl font-medium text-white sm:text-[32px]">
              off
            </span>
            <span
              className="relative flex h-6 w-12 shrink-0 items-center rounded-full border border-white/70 bg-transparent sm:h-8 sm:w-16"
              aria-hidden="true"
            >
              <span className="absolute right-1 size-4 rounded-full bg-[#e0ff0c] sm:size-5" />
            </span>
            <span className="font-serif text-2xl italic text-white sm:text-[32px]">
              on
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
          <ul>
            {leftColumn.map((claim) => (
              <AccordionRow key={claim.number} claim={claim} />
            ))}
          </ul>
          <ul>
            {rightColumn.map((claim) => (
              <AccordionRow key={claim.number} claim={claim} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
