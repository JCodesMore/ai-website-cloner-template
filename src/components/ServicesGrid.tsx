import Link from "next/link";
import type { ComponentType, ReactElement } from "react";

import {
  BarChartIcon,
  BriefcaseIcon,
  BuildingIcon,
  CreditCardIcon,
  HomeIcon,
  type IconProps,
  RefreshCwIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ServiceCard } from "@/types";

/**
 * `section#services.services-section` from fundup.au — rendered identically on
 * `/` and `/services` (the two documents differ only in where the `01` ghost
 * numeral sits in the DOM, which is visually inert because it is absolutely
 * positioned behind the card body).
 *
 * See `docs/research/components/services-and-about.spec.md` for the full CSS
 * extraction. Two things worth restating here:
 *
 * 1. The 1px grid gap *is* the hairline — cards have no borders, the grid's own
 *    `#ffffff1a` background shows through the gutters and `overflow: hidden`
 *    plus a 16px radius clips the outer corners.
 * 2. The original loads `services_card_hover_effects-1.0.0.js`, which does
 *    nothing but append a `<style>` block. Every hover state is therefore
 *    reproduced here as plain CSS via `group-hover:`.
 */

/** Card 01 is the only linked card on the live site. */
const FIRST_HOME_BUYERS_HREF = "/contact";

export const SERVICES: readonly ServiceCard[] = [
  {
    number: "01",
    title: "First Home Buyers",
    description:
      "We guide first-time buyers through grants, LMI waivers, and lender options — making your first purchase stress-free.",
    icon: "home",
    // FIX: the source points at `/services/first-home-buyers`, which 404s on the
    // live site. Retargeted to the contact page — see FIXES.md.
    href: FIRST_HOME_BUYERS_HREF,
  },
  {
    number: "02",
    title: "Self-Employed Loans",
    description:
      "Specialist lenders who understand non-traditional income. Low-doc and alt-doc options available for ABN holders.",
    icon: "briefcase",
  },
  {
    number: "03",
    title: "Investment Properties",
    description:
      "Grow your portfolio with the right debt structure. We find IO loans and offset features that maximise your returns.",
    icon: "bar-chart",
  },
  {
    number: "04",
    title: "Refinancing",
    description:
      "Switch to a better rate or restructure your debt. We compare your current loan against 40+ lenders to save you money.",
    icon: "refresh-cw",
  },
  {
    number: "05",
    title: "Construction Loans",
    description:
      "Progressive drawdown loans tailored to your build schedule. We liaise with your builder and lender so you don't have to.",
    icon: "building",
  },
  {
    number: "06",
    title: "Commercial Finance",
    description:
      "Business property, equipment finance, and commercial lending structured around your cash flow and growth plans.",
    icon: "credit-card",
  },
];

/**
 * `ServiceCard.icon` is a string so the data stays serialisable across the
 * server/client boundary. Every geometry below is byte-identical to the inline
 * SVG the source ships for that card.
 */
const SERVICE_ICONS: Record<string, ComponentType<IconProps> | undefined> = {
  "home": HomeIcon,
  "briefcase": BriefcaseIcon,
  "bar-chart": BarChartIcon,
  "refresh-cw": RefreshCwIcon,
  "building": BuildingIcon,
  "credit-card": CreditCardIcon,
};

/**
 * `.services-card` — `padding: 40px`, dropping to `32px` at ≤767px.
 *
 * `hover:[transition:background-color_.3s]` is deliberate: the source declares
 * the transition *inside* `:hover`, so the tint eases in over 300ms and snaps
 * back instantly. A base `transition-colors` would fade both ways.
 */
const CARD_CLASS =
  "group relative block cursor-pointer bg-[#0f0f0f] p-8 text-inherit no-underline md:p-10 " +
  "hover:bg-[#ffffff0d] hover:[transition:background-color_.3s]";

/** `.services-card_ghost-number` — behind the body, `transition: color .5s`. */
const GHOST_NUMBER_CLASS =
  "absolute right-6 top-4 z-0 select-none text-[72px] font-bold leading-none " +
  "text-[#ffffff0a] transition-colors duration-500 group-hover:text-[#bc1a1a1a]";

/** `.services-card_icon-wrap` — 44px ring, `transition: all .5s`. */
const ICON_WRAP_CLASS =
  "mb-6 flex size-11 items-center justify-center rounded-full border border-[#bc1a1a4d] " +
  "text-[#bc1a1a] transition-all duration-500 " +
  "group-hover:border-[#bc1a1a] group-hover:bg-[#bc1a1a1a]";

/**
 * `.services-card_title` — 18px/700 on the Webflow `h3` reset's `line-height: 30px`
 * and `margin-top: 20px` (the latter collapses against the icon wrap's 24px
 * bottom margin). No transition is declared, so the hover colour is instant.
 */
const TITLE_CLASS =
  "mb-3 mt-5 font-inter text-lg font-bold leading-[30px] text-white group-hover:text-[#bc1a1a]";

/** `.services-card_text` */
const TEXT_CLASS = "m-0 text-sm leading-[1.65] text-[#ffffff8c]";

interface ServicesGridProps {
  /** Override the six cards; defaults to the copy on the live site. */
  services?: readonly ServiceCard[];
  /** Extra classes for the `<section>` — e.g. per-page vertical rhythm. */
  className?: string;
}

export function ServicesGrid({ services = SERVICES, className }: ServicesGridProps): ReactElement {
  return (
    <section
      id="services"
      className={cn("relative overflow-hidden bg-[#0f0f0f] py-24 font-inter", className)}
    >
      <div className="container-site">
        {/* .services-section_header-1 */}
        <div className="mb-16 text-left">
          {/* Not the `.eyebrow` utility — that one is .9rem/.01em. This is 12px/.15em. */}
          <p className="mb-3 text-xs font-semibold uppercase leading-5 tracking-[.15em] text-[#bc1a1a]">
            What We Do
          </p>
          <h2 className="mb-0 mt-5 font-inter text-[36px] font-bold leading-[1.15] text-white min-[992px]:text-[44px]">
            Lending solutions
            <br />
            <span className="text-[#bc1a1a]">across the board</span>
          </h2>
          <p className="m-0 ml-auto max-w-[448px] text-right text-sm leading-[1.6] text-[#ffffff99]">
            Whether you&apos;re buying your first home, expanding an investment portfolio, or funding
            your business — we&apos;ve got you covered.
          </p>
        </div>

        {/* .services-section_grid — the 1px gutters are the hairlines. */}
        {/* `min-[768px]:` not `md:` — Tailwind emits every arbitrary min-width block
            *before* the named ones, so `md:grid-cols-2` would out-cascade
            `min-[992px]:grid-cols-3` and pin the grid at 2 columns on desktop. */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-[#ffffff1a] min-[768px]:grid-cols-2 min-[992px]:grid-cols-3">
          {services.map((service) => (
            <ServiceGridCard key={service.number} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One `.services-card`. Renders as a `<Link>` when the source gives the card a
 * destination and as a plain `<div>` otherwise — five of the six cards are
 * unlinked on the live site yet still carry `cursor: pointer`.
 */
function ServiceGridCard({ service }: { service: ServiceCard }): ReactElement {
  const Icon = SERVICE_ICONS[service.icon];

  const body = (
    <>
      <span aria-hidden="true" className={GHOST_NUMBER_CLASS}>
        {service.number}
      </span>
      <div className="relative z-10">
        <div className={ICON_WRAP_CLASS}>{Icon ? <Icon className="size-5" /> : null}</div>
        <h3 className={TITLE_CLASS}>{service.title}</h3>
        <p className={TEXT_CLASS}>{service.description}</p>
      </div>
    </>
  );

  if (service.href) {
    return (
      <Link href={service.href} className={CARD_CLASS}>
        {body}
      </Link>
    );
  }

  return <div className={CARD_CLASS}>{body}</div>;
}
