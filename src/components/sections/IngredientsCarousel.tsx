"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface IngredientCard {
  id: string;
  number: string;
  numberSuffix?: string;
  category: string;
  image: string;
  short: string;
  expanded: string;
  /** Tailwind classes for the dark "flipped" surface, matching the image hue family. */
  darkSurfaceClassName: string;
}

const CARDS: IngredientCard[] = [
  {
    id: "vitamines",
    number: "11",
    category: "Vitamines",
    image: "/images/onday/Vitamines_4e66a815-3f24-4693-a6bb-f712aa41f35f.png",
    short:
      "Soutiennent vos fonctions vitales et activent la production d'énergie.",
    expanded:
      "Toutes les vitamines du groupe B (avec des formes actives rares comme la B9 5-MTHF et la B6 P-5-P) pour soutenir votre métabolisme, apaiser votre système nerveux et garantir une énergie constante. S'y ajoutent la Vitamine C extraite d'Acérola du Brésil, et un duo de choc 100% naturel pour l'immunité et les os : la Vitamine D3 vegan issue du Lichen boréal couplée à la K2 MK-7.",
    darkSurfaceClassName: "bg-[#3a2e1f]",
  },
  {
    id: "mineraux",
    number: "5",
    category: "Minéraux",
    image: "/images/onday/Mineraux_2_ba639596-ac3b-4f3e-a56e-86c5492990e8.png",
    short:
      "Régulent l'équilibre nerveux et assurent une fonction musculaire optimale.",
    expanded:
      "Le duo Magnésium et Zinc sous forme Bisglycinate (ultra-assimilable et très doux pour l'estomac) régule le système nerveux, combat la fatigue et renforce l'immunité. S'y ajoutent le Potassium Citrate pour l'équilibre musculaire, le Sélénium organique sur levure (puissant antioxydant) et le Chrome Picolinate pour réguler le sucre sanguin.",
    darkSurfaceClassName: "bg-[#2b2b33]",
  },
  {
    id: "probiotiques",
    number: "10",
    numberSuffix: "Md",
    category: "Probiotiques",
    image:
      "/images/onday/Probiotiques_dd142cfc-ec64-4cc2-b810-9fd19634d538.png",
    short:
      "Renforcent la barrière intestinale pour une immunité et une digestion solides.",
    expanded:
      "L'équilibre parfait : 5 milliards de Lactobacillus acidophilus et 5 milliards de Bifidobacterium bifidum travaillent ensemble pour repeupler votre flore, restaurer votre confort digestif et booster votre immunité. Pour décupler leur survie et leur efficacité, nous les avons couplés à des fibres prébiotiques (inuline de chicorée) qui les nourrissent directement dans l'intestin.",
    darkSurfaceClassName: "bg-[#2a2f27]",
  },
  {
    id: "acides-amines",
    number: "3",
    category: "Acides Aminés",
    image: "/images/onday/Acide_amine_ac75b57c-b34d-4146-9bd1-57702ed87d15.png",
    short: "Optimisent la récupération et la synthèse des protéines essentielles.",
    expanded:
      "La Glycine, indispensable à la synthèse du collagène, protège vos articulations et favorise un sommeil réellement réparateur. La L-Glutamine, véritable carburant des cellules intestinales, renforce votre barrière digestive et accélère la récupération musculaire. Enfin, la Taurine assure l'équilibre des électrolytes et soutient la vitalité cardiaque.",
    darkSurfaceClassName: "bg-[#2f2a2e]",
  },
  {
    id: "super-aliments",
    number: "14",
    category: "Super Aliments",
    image: "/images/onday/Plante_2_20bcbe1b-6293-4f7a-8dd4-ee809bee2c81.png",
    short: "Purifient votre organisme grâce aux bienfaits naturels des plantes bio.",
    expanded:
      "Ce cocktail Bio est un véritable bouclier pour votre organisme : Les plantes adaptogènes (ginseng, ashwagandha..) régulent le stress et soutiennent l'énergie, tandis que les fibres et prébiotiques (chicorée, gingembre..) apaisent la digestion. Et notre concentré de super-aliments (spiruline, chardon-marie..) inonde vos cellules d'antioxydants et de bons nutriments.",
    darkSurfaceClassName: "bg-[#20301f]",
  },
  {
    id: "antioxydants",
    number: "4",
    category: "Antioxydants",
    image:
      "/images/onday/Antioxydants_130f16c6-d5c6-4dd2-8115-06b9f2420d0e.png",
    short:
      "Protègent votre corps contre le stress oxydatif et le vieillissement cellulaire.",
    expanded:
      "Le Coenzyme Q10 booste votre énergie cellulaire et protège votre cœur, tandis que l'Acide Hyaluronique assure une hydratation profonde de la peau et des articulations. Pour compléter ce bouclier, nous avons intégré de la Lutéine (issue de Rose d'Inde) pour la santé oculaire et de la Quercétine (issue de Sophora du Japon) pour renforcer votre réponse immunitaire.",
    darkSurfaceClassName: "bg-[#33231d]",
  },
];

function IngredientCardItem({ card }: { card: IngredientCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative h-[380px] w-[85vw] shrink-0 snap-start overflow-hidden rounded-2xl",
        "sm:w-[280px]"
      )}
    >
      {expanded ? (
        <div
          className={cn(
            "absolute inset-0 flex flex-col p-5 text-white",
            card.darkSurfaceClassName
          )}
        >
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Fermer le détail"
            className="absolute top-4 right-4 flex items-center justify-center rounded-full bg-white/15 p-2 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-4 w-4" />
          </button>

          <h3 className="font-heading pr-10 text-xl leading-tight text-white">
            {card.number}
            {card.numberSuffix && (
              <sup className="text-xs">{card.numberSuffix}</sup>
            )}{" "}
            {card.category}
          </h3>

          <div className="mt-4 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-white/85">
            <p>{card.expanded}</p>
          </div>
        </div>
      ) : (
        <>
          <Image
            src={card.image}
            alt={card.category}
            fill
            sizes="(max-width: 640px) 85vw, 280px"
            className="object-cover"
          />

          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/55"
          >
            en savoir plus
            <RotateCw className="h-3 w-3" />
          </button>

          <span className="font-heading pointer-events-none absolute top-2 left-3 text-[96px] leading-none text-[#e0ff0c] drop-shadow-sm">
            {card.number}
            {card.numberSuffix && (
              <sup className="text-2xl align-super">{card.numberSuffix}</sup>
            )}
          </span>

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-4 pt-10">
            <h3 className="font-heading text-lg text-white">
              {card.category}
            </h3>
            <p className="mt-1 text-sm leading-snug text-white/85">
              {card.short}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export function IngredientsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.clientWidth ?? 280;
    const delta = cardWidth + 24; // card width + gap-6
    el.scrollBy({
      left: direction === "next" ? delta : -delta,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-start justify-between gap-6">
          <h2 className="font-heading mx-auto max-w-3xl flex-1 text-center text-3xl leading-tight text-[#003D2A] sm:text-4xl">
            On a réuni tous vos nutriments essentiels dans{" "}
            <em className="italic">un seul verre</em>
          </h2>
        </div>

        <div className="mt-4 flex justify-end gap-2 sm:-mt-14">
          <button
            type="button"
            onClick={() => scrollByCards("prev")}
            aria-label="Ingrédient précédent"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#003D2A]/15 text-[#003D2A] transition-colors hover:bg-[#003D2A]/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards("next")}
            aria-label="Ingrédient suivant"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#003D2A]/15 text-[#003D2A] transition-colors hover:bg-[#003D2A]/5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CARDS.map((card) => (
            <IngredientCardItem key={card.id} card={card} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Dialog>
            <DialogTrigger className="inline-flex items-center gap-2 rounded-full bg-[#003D2A] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
              <RotateCw className="h-4 w-4 text-[#e0ff0c]" />
              Valeurs nutritionnelles
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Valeurs nutritionnelles</DialogTitle>
                <DialogDescription>
                  Tableau nutritionnel complet disponible sur demande
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
