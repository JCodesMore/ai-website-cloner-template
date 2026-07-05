"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface WhyOndayItem {
  number: string;
  title: string;
  body: string;
}

const ITEMS: WhyOndayItem[] = [
  {
    number: "01",
    title: "Vous n'êtes pas qu'une identité figée",
    body: "Travail, sport, famille, vie sociale… vous menez tout de front. Vous avez besoin d'un allié santé complet qui accompagne enfin votre rythme.",
  },
  {
    number: "02",
    title: "Votre corps a besoin d'une base nutritionnelle solide",
    body: "Le stress, la fatigue et la pollution vident vos réserves. Vous voulez des actifs intelligemment choisis pour combler vos carences et renforcer votre santé.",
  },
  {
    number: "03",
    title: "Vous n'avez pas envie d'accumuler 10 cures différentes",
    body: "Vous cherchez la simplicité sans sacrifier l'efficacité. Vous rêvez d'une formule unique, complète et agréable à boire qui s'intègre facilement à votre routine matinale.",
  },
  {
    number: "04",
    title: "Vous êtes intransigeant sur la qualité",
    body: "Vous êtes lassés des compositions floues et des provenances obscures. Vous exigez une formule clean, sans sucre, et fabriquée en France.",
  },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

function NumberedItem({ item, index }: { item: WhyOndayItem; index: number }) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-5 transition-all duration-700 ease-out sm:gap-6",
        isInView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <span
        className="shrink-0 font-heading text-4xl leading-none text-[#a8c9b8]/60 sm:text-6xl"
        aria-hidden
      >
        {item.number}
      </span>
      <div className="pt-1 sm:pt-2">
        <h3 className="font-heading text-lg text-[#003D2A] sm:text-xl">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#7d7d7d] sm:text-[15px]">
          {item.body}
        </p>
      </div>
    </div>
  );
}

export function WhyOnday() {
  return (
    <section className="bg-[#FCFAF0] px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center font-heading text-3xl text-[#003D2A] sm:text-4xl">
          onday, c&apos;est pour vous ?
        </h2>

        <div className="mt-10 flex flex-col gap-10 md:mt-16 md:flex-row md:items-start md:gap-14">
          <div className="md:sticky md:top-24 md:w-[45%] md:shrink-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:aspect-[3/4]">
              <Image
                src="/images/onday/2_77fd8d05-3b82-4b1b-a4e8-8a42b4d2cc7a.png"
                alt="Coureurs en mouvement, photo floutée illustrant le dynamisme du quotidien"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-9 md:w-[55%] md:gap-10">
            {ITEMS.map((item, index) => (
              <NumberedItem key={item.number} item={item} index={index} />
            ))}

            <a
              href="#routine"
              className="mt-2 inline-flex w-fit items-center gap-3 rounded-full bg-[#003D2A] py-3 pr-3 pl-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Découvrir la routine
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e0ff0c]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="#003D2A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
