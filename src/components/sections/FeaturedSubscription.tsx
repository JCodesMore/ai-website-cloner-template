"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CAROUSEL_IMAGES = [
  { src: "/images/onday/Doypack_2.png", alt: "Onday - doypack de la formule" },
  {
    src: "/images/onday/Slide_Abonnement_dd5c3907-cd59-455a-a2c5-172b005857f9.png",
    alt: "Onday - avantages de l'abonnement",
  },
  {
    src: "/images/onday/Slide_Gamme_1768a2ca-a162-4cc4-b2a9-ab18f7d691a8.png",
    alt: "Onday - la gamme de produits",
  },
  { src: "/images/onday/Slide_Gout_1.png", alt: "Onday - le goût du mélange" },
  {
    src: "/images/onday/Slide_Ingredients_Achat_Unique.png",
    alt: "Onday - liste des ingrédients",
  },
  {
    src: "/images/onday/Slide_Tableau_Ingredients_5.png",
    alt: "Onday - tableau des ingrédients",
  },
  { src: "/images/onday/Slide_Unique.png", alt: "Onday - formule unique" },
  {
    src: "/images/onday/Slide_Confiance_ce611e3a-4e3a-468e-bb0f-15afcf6cb1e8.png",
    alt: "Onday - avis de confiance",
  },
  { src: "/images/onday/Slide_Data_1.png", alt: "Onday - données et résultats" },
  {
    src: "/images/onday/Slide_Bienfaits_Achat_Unique.png",
    alt: "Onday - bienfaits du produit",
  },
];

const SUBSCRIPTION_BULLETS = [
  "1 sachet de 30 doses, livré chaque mois",
  "Pot de stockage & shaker OFFERTS (58€)",
  "-18% sur toutes vos commandes",
  "Livraison gratuite tous les mois",
  "Sans engagement, résiliez à tout moment",
];

const ONE_TIME_BULLETS = [
  "30 doses dans un sachet refermable",
  "Cuillère doseuse inclue dans le sachet",
  "Livraison offerte",
];

const INCLUDED_ITEMS = [
  {
    src: "/images/onday/Gourde_110x110_crop_center.png",
    name: "Gourde en Tritan™",
    description:
      "Une gourde ultra-légère pour faire votre mélange, sans aucun micro-plastiques !",
    price: "15€",
  },
  {
    src: "/images/onday/Pot_110x110_crop_center.png",
    name: "Pot & cuillère doseuse",
    description:
      "En acier inoxydable et en chêne : le moyen le plus écologique de consommer.",
    price: "34€",
  },
];

type PlanId = "subscription" | "one-time";

export function FeaturedSubscription() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("subscription");

  const goToPrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const goToNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-[#003D2A] md:mb-16 md:text-4xl lg:text-5xl">
          Et si on commençait <em className="italic">aujourd&apos;hui</em> ?
        </h2>

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          {/* Left: image carousel */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#e1e8ea]">
              {CAROUSEL_IMAGES.map((image, index) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    index === slideIndex ? "opacity-100" : "opacity-0"
                  )}
                  priority={index === 0}
                />
              ))}

              <button
                type="button"
                onClick={goToPrevSlide}
                aria-label="Image précédente"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#003D2A] shadow-md transition hover:scale-105 md:left-4 md:h-12 md:w-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="Image suivante"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#003D2A] shadow-md transition hover:scale-105 md:right-4 md:h-12 md:w-12"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {CAROUSEL_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setSlideIndex(index)}
                  aria-label={`Aller à l'image ${index + 1}`}
                  aria-current={index === slideIndex}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === slideIndex
                      ? "w-6 bg-[#003D2A]"
                      : "w-2 bg-[#e1e8ea] hover:bg-[#003D2A]/40"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: pricing card */}
          <div className="w-full md:w-[45%]">
            <div className="rounded-2xl border border-[#e1e8ea] p-6">
              {/* Option A: subscription */}
              <button
                type="button"
                onClick={() => setSelectedPlan("subscription")}
                className={cn(
                  "flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition",
                  selectedPlan === "subscription"
                    ? "border-[#003D2A] bg-[#003D2A]/5"
                    : "border-[#e1e8ea] bg-white hover:border-[#003D2A]/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      selectedPlan === "subscription"
                        ? "border-[#003D2A]"
                        : "border-[#e1e8ea]"
                    )}
                  >
                    {selectedPlan === "subscription" && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#003D2A]" />
                    )}
                  </span>
                  <span className="font-semibold text-[#003D2A]">
                    Livraison mensuelle
                  </span>
                </div>

                <div className="flex shrink-0 flex-col items-end text-right">
                  <span className="inline-block rounded-full bg-[#e0ff0c] px-2 py-0.5 text-xs font-bold text-[#003D2A]">
                    -18%
                  </span>
                  <span className="mt-1 text-sm text-gray-400 line-through">
                    89€
                  </span>
                  <span className="font-bold text-[#003D2A]">74€ / mois</span>
                  <span className="text-xs text-gray-500">2,46€ / jour</span>
                </div>
              </button>

              <ul className="mt-4 space-y-2.5">
                {SUBSCRIPTION_BULLETS.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#003D2A]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="group mt-6 flex w-full items-center justify-between rounded-full bg-[#e0ff0c] px-6 py-4 font-semibold text-[#003D2A] transition hover:brightness-95"
              >
                <span>J&apos;en profite maintenant</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003D2A] text-[#e0ff0c]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              {/* Included in subscription */}
              <div className="mt-6 rounded-xl bg-[#e1e8ea] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#003D2A]">
                  <Gift className="h-4 w-4" />
                  <span>Inclus dans votre abonnement :</span>
                </div>

                <div className="space-y-3">
                  {INCLUDED_ITEMS.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#003D2A]">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-gray-400 line-through">
                          {item.price}
                        </p>
                        <p className="text-xs font-semibold text-[#003D2A]">
                          Offert
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option B: one-time purchase */}
              <button
                type="button"
                onClick={() => setSelectedPlan("one-time")}
                className={cn(
                  "mt-4 flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition",
                  selectedPlan === "one-time"
                    ? "border-[#003D2A] bg-[#003D2A]/5"
                    : "border-[#e1e8ea] bg-white hover:border-[#003D2A]/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      selectedPlan === "one-time"
                        ? "border-[#003D2A]"
                        : "border-[#e1e8ea]"
                    )}
                  >
                    {selectedPlan === "one-time" && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[#003D2A]" />
                    )}
                  </span>
                  <span className="font-semibold text-[#003D2A]">
                    Achat unique
                  </span>
                </div>

                <span className="shrink-0 font-bold text-[#003D2A]">89€</span>
              </button>

              {selectedPlan === "one-time" && (
                <ul className="mt-4 space-y-2.5">
                  {ONE_TIME_BULLETS.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#003D2A]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
