"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Quel est le goût de Onday ?",
    answer:
      "Onday, c'est un goût naturel de végétaux combiné à des notes fruitées pour une sensation douce et agréable. Notre équipe R&D a passé plusieurs mois à élaborer la formule la plus naturelle possible, sans arôme artificiel ni conservateurs. C'est bon pour le corps, et pour les papilles !",
  },
  {
    question:
      "Et si je n'aime pas le goût ? Avec quoi puis-je mélanger Onday ?",
    answer:
      "Pas d'inquiétude ! Onday a un goût volontairement léger, et peut se mélanger à presque tout (sauf les liquides très chauds, pour préserver les probiotiques). Voici nos astuces préférées :\n· Ajouter quelques gouttes de citron\n· Avec de l'eau bien fraîche et quelques glaçons\n· Avec du lait végétal (amande, avoine...)\n· Dans un yaourt ou du fromage blanc\n· Mélangé à votre jus de fruit préféré\n· Dans votre shaker de protéines\n\nLe principal, c'est de faire comme vous le préférez : à chacun sa routine !",
  },
  {
    question: "Est-ce que Onday est fait pour moi ?",
    answer:
      "Onday accompagne toutes celles et ceux qui veulent prendre soin d'eux au quotidien : que vous cherchiez à combler des carences en nutriments, que vous ayez une pratique sportive intense, ou que vous vouliez simplement vous sentir bien. onday rassemble toutes les vitamines et minéraux dont vous avez besoin dans une formule unique et fabriquée en France pour vous offrir une base fondamentale de nutrition quotidienne. À noter qu'Onday ne remplace en aucun cas une alimentation variée et équilibrée, et doit se prendre dans le cadre d'un mode de vie sain.",
  },
  {
    question: "Comment se prend Onday ?",
    answer:
      "Versez 2 cuillères de Onday dans 250mL d'eau, secouez, buvez ! C'est tout. La simplicité est notre maître-mot : un seul geste facile qui vous donne le sourire tous les matins. Et quoi de mieux pour vous accompagner au quotidien que notre gourde Onday en Tritan™ ? Vous aussi vous en aviez marre d'avaler plusieurs gélules et comprimés chaque matin ?",
  },
  {
    question: "Quels bienfaits ? Et au bout de combien de temps ?",
    answer:
      "Les bienfaits les plus ressentis par nos clients : énergie au quotidien (en partie liée à un sommeil plus réparateur), meilleure immunité, digestion apaisée, moins de stress, une peau plus nette, des cheveux et ongles renforcés… et un vrai mieux-être général. Certains effets peuvent se faire sentir en quelques jours, d'autres prennent 4 à 6 semaines. Chaque corps est unique, et les bénéfices s'installent avec la régularité.",
  },
  {
    question: "Pourquoi Onday n'est pas un complément comme les autres ?",
    answer:
      "Parce qu'on a voulu faire simple, complet et ultra qualitatif, et sans le moindre compromis ! Ce qui fait la différence :\n· Une fabrication 100% française, avec des partenaires experts et des standards exigeants.\n· Des ingrédients hautement biodisponibles et validés par la science.\n· Une expérience premium et durable : pot en inox avec couvercle en chêne, cuillère en acier, gourde en Tritan™.\n· Une formule pensée avec justesse, des dosages 100% physiologiques.\n· Un accompagnement quotidien : conseils bien-être, recettes, astuces...",
  },
  {
    question: "Comment a été construit le prix de Onday ?",
    answer:
      "Avec Onday, vous bénéficiez d'un concentré de qualité, fabriqué en France, pour 2,50€ par jour. 40+ nutriments essentiels hautement assimilables et sélectionnés avec rigueur. Achetés séparément, ces nutriments reviendraient en moyenne à 185€ par mois. Et nous ne sommes pas prêts à faire des compromis de qualité ou de production pour réduire le prix !",
  },
  {
    question: "Est-ce que Onday est vegan et sans gluten ?",
    answer:
      "Oui ! Onday est 100% vegan et sans gluten. Aucun ingrédient d'origine animale, et aucun allergène majeur. (Pour l'anecdote, la plupart des vitamines D disponibles sur le marché sont issues de laine de mouton et ne sont donc pas vegan. C'est pourquoi nous avons sélectionné une vitamine D issue de lichen boréal, 100% vegan et tout aussi efficace).",
  },
];

function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const paragraphs = item.answer.split("\n");

  return (
    <div className="border-b border-[#dbd8d8]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-heading text-base font-medium text-[#003D2A] sm:text-[17px]">
          {item.question}
        </span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full bg-[#003D2A] transition-transform duration-300 ease-out",
            isOpen && "rotate-45"
          )}
          aria-hidden
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-[250ms] ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0">
          <div className="max-w-[640px] space-y-3 pb-6 text-[15px] leading-relaxed whitespace-pre-line text-[#7d7d7d]">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white px-6 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-10 font-heading text-3xl text-[#003D2A] sm:text-4xl md:mb-14">
          FAQ
        </h2>

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
          <div className="hidden md:sticky md:top-24 md:block md:w-[35%] md:shrink-0">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/onday/vf-onday-2.jpg"
                alt="Gourde Onday tenue en main, fond ciel bleu"
                fill
                sizes="(min-width: 768px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-[60%]">
            {FAQ_ITEMS.map((item, index) => (
              <FAQRow
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
