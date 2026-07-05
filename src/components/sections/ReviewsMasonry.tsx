"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Review {
  title: string
  quote: string
  name: string
  initials: string
}

const REVIEWS: Review[] = [
  {
    title: "TRÈS BON PRODUIT",
    quote:
      "Je prends Onday chaque matin depuis plusieurs semaines. Je m'entraîne de façon intensive et je supporte beaucoup mieux les grosses charges d'entraînement. Le produit est bio, ce qui est un vrai +. Le goût n'est ni bon ni mauvais, mais en tout cas, ce n'est pas difficile à boire.",
    name: "Caro C.",
    initials: "CC",
  },
  {
    title: "BLUFFANT",
    quote:
      "Enfin je ne subis plus mes journées ! C'est la première fois que j'ai un tel résultat sur mon état général. Sans parler de mes ongles qui ne cassent plus!",
    name: "Judith R.",
    initials: "JR",
  },
  {
    title: "DÉJÀ 2 MOIS AVEC ONDAY",
    quote:
      "Déjà plus de deux mois avec Onday ! Courant plus de 100 km par semaine, j'avais besoin d'un complément alimentaire capable de subvenir à mes besoins quotidiens et c'est chose faite. Le produit est top : j'avais peur de retrouver le goût du thé matcha ou de la spiruline, mais au contraire, la boisson a un goût très naturel et agréable. C'est devenu un vrai rituel, hyper simple à prendre chaque matin. Je recommande à tous ceux qui veulent simplifier leur routine de compléments alimentaires !",
    name: "Jérémy S.",
    initials: "JS",
  },
  {
    title: "SIMPLE ET EFFICACE",
    quote:
      "J'aime le site simple et efficace. Dialogue facile si problème ! Bon produit au goût neutre.. facile à prendre. Les résultats se sont fait sentir en un peu moins d'un mois.. je valide ses bienfaits.",
    name: "Annick C.",
    initials: "AC",
  },
  {
    title: "WHOUAAAA",
    quote:
      "Excellente expérience en dose d'essai. Du coup je me suis abonné au pack Doses+ boîte + gourde et je ne le regrette pas du tout...Pour voyager au Népal, cela me sera très utile pour ne manquer de rien niveau nutritionnel....Merciiii",
    name: "Stéphane M.",
    initials: "SM",
  },
  {
    title: "EXCELLENT PRODUIT",
    quote:
      "Excellent produit ! Je suis client depuis 6 mois et Onday a changé mon quotidien ! Il vous apporte un réel confort intestinal ainsi qu'un véritable coup de boost pour votre journée. Un jour sans et la différence est flagrante… Un des gros points positifs est la personnalisation de la commande, si vous partez vous pouvez facilement changer d'adresse ou de formule pour vous adaptez au mieux. Je vous le conseil vivement, ce produit est vraiment top !",
    name: "Malko",
    initials: "M",
  },
  {
    title: "EFFICACE ET BON",
    quote:
      "Ravi de mon expérience avec Onday. Dès la commande, tout est clair, professionnel et soigné. La livraison a été rapide. Au niveau du produit, la formule est top et très pratique au quotidien (j'avais auparavant plein de compléments différents, c'est beaucoup plus pratique de n'avoir plus qu'une seule solution :)) Concernant le goût : très agréable, facile à boire (je vous conseille de le boire très frais). Le packaging, les accessoires (gourde, cuillère doseuse, pot en inox) sont aussi hyper quali.",
    name: "Arthur R.",
    initials: "AR",
  },
  {
    title: "MERCI À ONDAY",
    quote:
      "Merci à Onday : livraison parfaite, packaging nickel. J'utilise quotidiennement Onday depuis 3 semaines et les effets positifs commencent à se faire sentir, notamment sur la régulation de mon sommeil.",
    name: "Laurent B.",
    initials: "LB",
  },
]

const INITIAL_VISIBLE_COUNT = 4

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="#00b67a"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 1.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 17.27l-6.18 3.23L7 13.63l-5-4.87 6.91-1L12 1.5z" />
    </svg>
  )
}

function StarRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label="5 étoiles">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="size-4" />
      ))}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="10" fill="#00b67a" />
      <path
        d="M6 10.2l2.4 2.4L14.4 7"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="mb-5 break-inside-avoid rounded-xl border border-[#dbd8d8] bg-white p-5 shadow-sm">
      <StarRow className="mb-3" />
      <h3
        className="mb-2 text-sm font-bold tracking-wide uppercase"
        style={{ color: "#003D2A" }}
      >
        {review.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed" style={{ color: "#7d7d7d" }}>
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="mb-4 h-px w-full bg-[#dbd8d8]" />
      <div className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: "#e1e8ea", color: "#003D2A" }}
        >
          {review.initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold" style={{ color: "#003D2A" }}>
            {review.name}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "#7d7d7d" }}>
            <CheckIcon className="size-3" />
            Vérifié sur Trustpilot
          </span>
        </div>
      </div>
    </div>
  )
}

export function ReviewsMasonry() {
  const [showAll, setShowAll] = useState(false)
  const visibleReviews = showAll ? REVIEWS : REVIEWS.slice(0, INITIAL_VISIBLE_COUNT)

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            className="font-heading text-3xl font-bold"
            style={{ color: "#003D2A" }}
          >
            Ils ont sauté le pas
          </h2>
          <p className="mt-4 text-base" style={{ color: "#7d7d7d" }}>
            Découvrez ce que nos 5000 clients disent de nous.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#003D2A" }}>
              4,7 Excellent
            </span>
            <StarRow />
          </div>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.name + review.title} review={review} />
          ))}
        </div>

        {!showAll && REVIEWS.length > INITIAL_VISIBLE_COUNT && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full border border-[#dbd8d8] bg-white px-6 py-3 text-sm font-medium transition-colors hover:bg-[#f5f5f5]"
              style={{ color: "#003D2A" }}
            >
              Afficher plus d&apos;avis
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
