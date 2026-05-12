import Image from "next/image";

import { PlayIcon } from "@/components/icons";
import {
  STREAMING_BG,
  STREAMING_CARDS,
  STREAMING_VIDEO_HREF,
} from "@/lib/content";

export function Streaming() {
  const marqueeCards = [...STREAMING_CARDS, ...STREAMING_CARDS];

  return (
    <section
      className="relative bg-cover bg-center py-24 lg:py-32"
      style={{ backgroundImage: `url(${STREAMING_BG})` }}
    >
      <style>{`@keyframes yo-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } .yo-marquee-track { animation: yo-marquee 35s linear infinite; width: max-content; }`}</style>

      {/* Dark overlay */}
      <div aria-hidden className="absolute inset-0 bg-secondary/80" />

      {/* Heading */}
      <div className="yo-container relative z-10 mb-16 text-center">
        <span className="yo-subtitle text-white">Now Streaming</span>
        <h2 className="yo-headline-split mx-auto mt-5 w-full text-[48px] leading-none text-white md:w-2/3 xl:w-1/2">
          Watch anything anytime{" "}
          <span className="light">anywhere instantly</span>
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative z-10 overflow-hidden">
        <div className="yo-marquee-track flex gap-6 px-7 lg:px-12 xl:px-16">
          {marqueeCards.map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className="w-[260px] shrink-0"
            >
              <div className="group relative mb-3 overflow-hidden rounded-md">
                <Image
                  src={card.image}
                  width={300}
                  height={400}
                  alt={card.title}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <a
                  href={STREAMING_VIDEO_HREF}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Play ${card.title}`}
                  className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-white hover:text-primary"
                >
                  <PlayIcon className="size-4" />
                </a>
              </div>
              <h4 className="text-xl font-extrabold text-white">
                <a href="#">{card.title}</a>
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative ring */}
      <span
        aria-hidden
        className="absolute bottom-10 right-0 hidden h-40 w-40 rounded-full border border-white/10 md:block"
      />
    </section>
  );
}
