import Image from "next/image";

import { WHY_CHOOSE_LEFT, WHY_CHOOSE_RIGHT } from "@/lib/content";
import type { WhyChooseFeature } from "@/types/content";

type Side = "left" | "right";

interface FeatureItemProps {
  feature: WhyChooseFeature;
  side: Side;
}

function FeatureItem({ feature, side }: FeatureItemProps) {
  const isLeft = side === "left";

  // LEFT side (at lg+): text on the LEFT, icon on the RIGHT, right-aligned text.
  // RIGHT side (at lg+): icon on the LEFT, text on the RIGHT, left-aligned text.
  const rowClass = isLeft
    ? "flex items-start gap-5 lg:flex-row-reverse lg:text-right"
    : "flex items-start gap-5";

  // Halo positioning: on the LEFT column, halo sits behind icon at bottom-right.
  // On the RIGHT column, halo sits behind icon at bottom-left.
  const haloClass = isLeft
    ? "absolute -right-3 -bottom-2 size-10 rounded-full bg-primary/10 -z-10"
    : "absolute -left-3 -bottom-2 size-10 rounded-full bg-primary/10 -z-10";

  return (
    <div className={rowClass}>
      <div className="relative shrink-0">
        <div className="relative flex size-[60px] items-center justify-center">
          <span aria-hidden className={haloClass} />
          <Image
            src={feature.icon}
            width={50}
            height={50}
            alt=""
            className="relative z-10"
          />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-[20px] font-extrabold leading-6 text-heading">
          <a href={feature.href} className="hover:text-primary">
            {feature.title}
          </a>
        </h3>
        <p className="text-body">{feature.description}</p>
      </div>
    </div>
  );
}

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Centered heading */}
      <div className="yo-container relative z-10 mb-16 text-center">
        <span className="yo-subtitle">Why Choose Us</span>
        <h2 className="yo-headline-split mx-auto mt-5 max-w-3xl text-[40px] leading-none md:max-w-2xl md:text-[48px]">
          Best internet facilities{" "}
          <span className="light">provider in town</span>
        </h2>
      </div>

      <div className="yo-container relative z-10">
        <div className="grid items-center gap-y-12 lg:grid-cols-12">
          {/* LEFT features */}
          <div className="space-y-12 lg:col-span-4">
            {WHY_CHOOSE_LEFT.map((feature) => (
              <FeatureItem key={feature.title} feature={feature} side="left" />
            ))}
          </div>

          {/* CENTER illustration */}
          <div className="hidden lg:col-span-4 lg:block">
            <Image
              src="/img/content/why-choose-us-01.png"
              width={500}
              height={620}
              alt=""
              className="relative z-10 mx-auto"
            />
          </div>

          {/* RIGHT features */}
          <div className="space-y-12 lg:col-span-4">
            {WHY_CHOOSE_RIGHT.map((feature) => (
              <FeatureItem key={feature.title} feature={feature} side="right" />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative wedge (right-side, skewed light background) */}
      <span
        aria-hidden
        className="absolute right-0 top-[40%] -z-10 hidden h-[400px] w-[300px] -skew-y-12 bg-[#f8f9fa] lg:block"
      />

      {/* Decorative line-02 squiggle, bottom-left */}
      <Image
        src="/img/content/line-02.png"
        width={120}
        height={200}
        alt=""
        aria-hidden
        className="yo-anim-y absolute bottom-10 left-[5%] hidden sm:block"
      />
    </section>
  );
}
