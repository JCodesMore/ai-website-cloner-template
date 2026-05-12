import Image from "next/image";

import { OFFER } from "@/lib/content";

export function OfferCallout() {
  return (
    <section className="relative py-0">
      <div className="max-w-full px-0 lg:px-0">
        <div className="grid lg:grid-cols-2">
          {/* RIGHT (photo first on mobile) — photo with red triangular shapes */}
          <div
            className="relative min-h-[400px] rounded-[10px] bg-cover bg-center lg:order-2 lg:min-h-full"
            style={{ backgroundImage: `url(${OFFER.image})` }}
            role="img"
            aria-label=""
          >
            {/* offer-shape1 — large red triangle, top-right corner */}
            <span
              aria-hidden
              className="absolute right-0 top-0 h-0 w-0 border-l-[100px] border-t-[100px] border-l-transparent border-t-primary"
            />
            {/* offer-shape2 — smaller red triangle, just below */}
            <span
              aria-hidden
              className="absolute right-0 top-[120px] h-0 w-0 border-l-[60px] border-t-[60px] border-l-transparent border-t-primary/80"
            />
          </div>

          {/* LEFT — dark card with headline / paragraph / icon-row / CTA */}
          <div className="relative rounded-[10px] bg-secondary px-8 py-20 lg:order-1 lg:py-28 xl:px-16 xl:py-36">
            <div className="mx-auto max-w-[480px]">
              <h2 className="yo-headline-split mb-6 text-[44px] leading-none text-white md:text-[48px]">
                {OFFER.title}{" "}
                <span className="light">{OFFER.highlight}</span>
              </h2>
              <p className="mb-7 text-base leading-[1.8] text-white/80">
                {OFFER.paragraph}
              </p>

              <div className="mb-7 flex items-center">
                <Image
                  src={OFFER.icon}
                  width={60}
                  height={60}
                  alt=""
                  className="shrink-0"
                />
                <div className="ml-4">
                  <h5 className="font-extrabold text-white">
                    {OFFER.bullet1}
                  </h5>
                  <span className="text-sm text-white/80">
                    {OFFER.bullet2}
                  </span>
                </div>
              </div>

              <a href="#about" className="yo-btn yo-btn-white">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
