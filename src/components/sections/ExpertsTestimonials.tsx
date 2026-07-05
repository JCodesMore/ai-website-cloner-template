"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Nathan Guerbeur",
    role: "Triathlète Professionnel",
    quote:
      "Entre les trois disciplines, mon corps est mis à rude épreuve. Onday m'assure une énergie constante et une récupération optimale.",
    image: "/images/onday/Natahan_Guerbeur.png",
  },
  {
    name: "Mathilde Benoit",
    role: "Volleyeuse Professionnelle",
    quote:
      "L'exigence du haut niveau demande une routine sans faille. Le rituel Onday est devenu mon allié quotidien.",
    image: "/images/onday/Mathilde_Benoit_1.png",
  },
  {
    name: "Clarisse Sousa",
    role: "Diététicienne D.E Nutritionniste",
    quote:
      "Une formulation pointue et parfaitement dosée pour une prise long-terme. Je recommande cette synergie d'actifs à mes patients.",
    image: "/images/onday/Clarisse_Sousa.png",
  },
  {
    name: "Fred Fugen",
    role: "Champion du Monde de Parachutisme",
    quote:
      "En vol, la moindre erreur ne pardonne pas. Onday m'aide à garder concentration extrême et condition physique irréprochable.",
    image: "/images/onday/Fred_Fugen.png",
  },
  {
    name: "Hannah Romao",
    role: "CEO de TheLyfe & Créatrice de contenus",
    quote:
      "Ma journée file à 100 à l'heure. Ce geste simple est devenu mon pilier bien-être et longévité pour rester au top de ma forme.",
    image: "/images/onday/Hannah_Romao.png",
  },
  {
    name: "Louis Margot",
    role: "Athlète & Aventurier",
    quote:
      "Lors de mes expéditions, chaque gramme compte. Avoir 43 nutriments essentiels dans une seule boisson est un atout inestimable.",
    image: "/images/onday/Louis_Margot.png",
  },
  {
    name: "Antoine Soave",
    role: "Rugbyman Professionnel",
    quote:
      "Concilier rugby pro et vie de papa demande une énergie folle. Onday est mon allié pour assurer sur le terrain comme à la maison.",
  },
  {
    name: "Laurence Fugen",
    role: "Championne du Monde de Parachutisme",
    quote:
      "Les sports extrêmes pompent beaucoup d'énergie. J'ai enfin trouvé le complément idéal pour soutenir mon corps au fil des sauts.",
    image: "/images/onday/Laurence_Fugen.png",
  },
  {
    name: "Patrick Legrand",
    role: "Médecin en Traumatologie du Sport",
    quote:
      "Un corps bien nourri est un corps qui se blesse moins. Cette formule ultra-complète est un excellent bouclier pour l'organisme.",
    image: "/images/onday/Patrick_Legrand.png",
  },
  {
    name: "François Fontaine",
    role: "Rugbyman Professionnel",
    quote:
      "Sur le terrain ou en coaching, je dois être à 200%. C'est le seul complément que je prends chaque matin pour encaisser les chocs.",
    image: "/images/onday/Francois_fontaine.png",
  },
  {
    name: "Sylvie Gagean-Mauffré",
    role: "Docteure en Pharmacie, DU en Nutrition",
    quote:
      "Je suis très exigeante sur la qualité des compléments. Ici, la biodisponibilité et le choix des 43 actifs sont remarquables.",
    image:
      "/images/onday/Sylvie_Mauffre_e2250266-62a5-4341-97df-ca5f816878ec.png",
  },
  {
    name: "Delphine Grobotek",
    role: "Championne de France d'Haltérophilie",
    quote:
      "En tant qu'athlète et coach, je ne laisse rien au hasard. Les 43 actifs de cette formule optimisent ma force et ma récupération.",
  },
  {
    name: "Christophe Journet",
    role: "Athlète Multidisciplinaire",
    quote:
      "Entre compétitions et marathons, j'ai besoin d'un soutien fiable pour nourrir mon endurance et protéger mon socle métabolique.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AUTOPLAY_INTERVAL_MS = 4000;

export function ExpertsTestimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  // Loop content twice so the scroll can wrap seamlessly.
  const loopedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

  const scrollByOneCard = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    const gap = parseFloat(getComputedStyle(track).columnGap || "0");
    const step = firstCard.getBoundingClientRect().width + gap;

    const maxScroll = track.scrollWidth / 2;

    if (track.scrollLeft + step >= maxScroll) {
      // Snap back to the start of the (duplicated) list to loop infinitely.
      track.scrollTo({
        left: track.scrollLeft - maxScroll,
        behavior: "instant" as ScrollBehavior,
      });
      track.scrollBy({ left: step, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        scrollByOneCard();
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [scrollByOneCard]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    setIsPaused(false);
  }, []);

  return (
    <section
      className="w-full overflow-hidden bg-[#003D2A] py-16 sm:py-24"
      aria-label="Témoignages d'experts et de sportifs"
    >
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/60 sm:text-sm">
          Approuvé par les plus exigeants
        </p>
        <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl md:text-5xl">
          Ils ont tous choisi <em className="italic">onday</em>
        </h2>
      </div>

      <div
        ref={trackRef}
        className={cn(
          "mt-10 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:mt-14 sm:gap-6 sm:px-[max(1rem,calc((100vw-72rem)/2))]",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        )}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        role="list"
      >
        {loopedTestimonials.map((testimonial, index) => (
          <article
            key={`${testimonial.name}-${index}`}
            role="listitem"
            className="relative aspect-[3/4] w-[78vw] shrink-0 overflow-hidden rounded-2xl bg-[#e1e8ea] sm:w-[280px]"
          >
            {testimonial.image ? (
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                sizes="280px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#e1e8ea]">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-xl font-semibold text-[#003D2A]">
                  {getInitials(testimonial.name)}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-16">
              <p className="text-sm leading-snug text-white">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-1 flex flex-col items-start gap-1.5">
                <span className="text-sm font-semibold text-white">
                  {testimonial.name}
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white">
                  {testimonial.role}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {isPaused
          ? "Carrousel en pause"
          : "Carrousel en défilement automatique"}
      </span>
    </section>
  );
}
