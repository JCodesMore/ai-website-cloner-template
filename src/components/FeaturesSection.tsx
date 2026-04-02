"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LargeCardData {
  icon: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  videoPoster: string;
  videoSrc: string;
}

interface SmallCardData {
  icon: string;
  title: string;
  videoPoster: string;
  videoSrc: string;
}

const largeCards: [LargeCardData, LargeCardData] = [
  {
    icon: "/images/features/bins-icon.svg",
    title: "Wide choice of BINs",
    description:
      "More than 50 reliable BINs minimize the risks associated with payments and ad account blocking.",
    ctaText: "Open Account",
    ctaHref: "https://app.leadingcards.media/auth/login",
    videoPoster: "/images/video-poster-1.jpg",
    videoSrc: "/videos/card-01.mp4",
  },
  {
    icon: "/images/features/instant-issuance.svg",
    title: "Instant Issuance",
    description:
      "Generate cards instantly and run your advertising campaigns without delays or hassles.",
    ctaText: "Open Account",
    ctaHref: "https://app.leadingcards.media/auth/login",
    videoPoster: "/images/video-poster-6.png",
    videoSrc: "/videos/card-06.mp4",
  },
];

const smallCards: SmallCardData[] = [
  {
    icon: "/images/features/analytics-reports.svg",
    title: "Analytics & Reports",
    videoPoster: "/images/video-poster-3.png",
    videoSrc: "/videos/card-02.mp4",
  },
  {
    icon: "/images/features/24-support.svg",
    title: "3DS support",
    videoPoster: "/images/video-poster-2.png",
    videoSrc: "/videos/card-03.mp4",
  },
  {
    icon: "/images/features/online-support.svg",
    title: "Dedicated support team",
    videoPoster: "/images/video-poster-4.png",
    videoSrc: "/videos/card-04.mp4",
  },
  {
    icon: "/images/features/customization.svg",
    title: "Convenient customization",
    videoPoster: "/images/video-poster-5.png",
    videoSrc: "/videos/card-05.mp4",
  },
];

function LargeCard({ card }: { card: LargeCardData }) {
  return (
    <div
      className={cn(
        "rounded-[1rem] border border-[#dfe4ec] p-4",
        "md:rounded-[1.75rem] md:p-6"
      )}
    >
      <div
        className="relative overflow-hidden rounded-[1rem] bg-[#360854] md:rounded-[1.75rem]"
        style={{ paddingTop: "44.6611%" }}
      >
        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={card.videoPoster}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={card.videoSrc} type="video/mp4" />
        </video>

        {/* Content overlay */}
        <div
          className={cn(
            "absolute inset-x-4 top-6 bottom-4 z-10 flex flex-col gap-3",
            "md:top-[4.25rem] md:bottom-12 md:left-[3.375rem] md:right-auto md:gap-4"
          )}
        >
          {/* Icon */}
          <Image
            src={card.icon}
            alt=""
            width={48}
            height={48}
            className="hidden h-10 w-10 md:block md:h-12 md:w-12"
          />

          <h3
            className="max-w-[13ch] font-bold text-white"
            style={{
              fontSize: "clamp(1.75rem, 1.3099rem + 1.8779vw, 3rem)",
              lineHeight: 1.16,
            }}
          >
            {card.title}
          </h3>

          <p
            className="max-w-[30ch] text-[#bfc8d9]"
            style={{
              fontSize: "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
            }}
          >
            {card.description}
          </p>

          <a
            href={card.ctaHref}
            className={cn(
              "mt-auto inline-flex w-fit items-center justify-center",
              "rounded-lg px-5 py-2.5 text-sm font-medium text-white",
              "border border-[#7ad7ca]",
              "transition-opacity hover:opacity-90"
            )}
            style={{
              background: "linear-gradient(#39beabb8, #39beab)",
            }}
          >
            {card.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}

function SmallCard({ card }: { card: SmallCardData }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1rem] border border-[#dfe4ec] p-4",
        "md:rounded-[1.75rem] md:p-6"
      )}
    >
      <div className="relative overflow-hidden rounded-[1rem] bg-[#360854] md:rounded-[1.75rem]">
        {/* Aspect ratio wrapper */}
        <div style={{ paddingTop: "100%" }} />

        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster={card.videoPoster}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={card.videoSrc} type="video/mp4" />
        </video>

        {/* Content overlay */}
        <div
          className={cn(
            "absolute inset-x-4 top-4 z-10 flex flex-col gap-3",
            "md:inset-x-6 md:top-6 md:gap-4"
          )}
        >
          {/* Icon */}
          <Image
            src={card.icon}
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 md:h-12 md:w-12"
          />

          <h3
            className="font-medium text-white"
            style={{
              fontSize: "clamp(1.25rem, 1.0739rem + 0.7512vw, 1.75rem)",
            }}
          >
            {card.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="px-6">
      <div className="mx-auto max-w-[1280px]">
        {/* Section header */}
        <div className="text-center">
          <h2
            className="font-bold tracking-[-0.01em] text-[#151c28]"
            style={{
              fontSize:
                "clamp(2.25rem, 1.4577rem + 3.3803vw, 4.5rem)",
              lineHeight: 1.16,
            }}
          >
            Everything to Ensure the Best Experience
          </h2>
          <p
            className="mt-2 text-[#4d5e80]"
            style={{
              fontSize: "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
            }}
          >
            Bringing you everything you need for a flawless experience.
          </p>
        </div>

        {/* Large Card 1 — BINs */}
        <div className="mt-10 md:mt-14">
          <LargeCard card={largeCards[0]} />
        </div>

        {/* 2x2 Small Card Grid */}
        <div
          className={cn(
            "mt-6 grid grid-cols-1 gap-6",
            "md:grid-cols-2 md:gap-x-[2.0625rem] md:gap-y-6"
          )}
        >
          {smallCards.map((card) => (
            <SmallCard key={card.title} card={card} />
          ))}
        </div>

        {/* Large Card 2 — Instant Issuance */}
        <div className="mt-6">
          <LargeCard card={largeCards[1]} />
        </div>
      </div>
    </section>
  );
}
