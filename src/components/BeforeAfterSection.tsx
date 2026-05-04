"use client";

import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/ui/image-comparison";
import { ScrollReveal } from "./ScrollReveal";

interface ComparisonItem {
  title: string;
  description: string;
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
}

const comparisons: ComparisonItem[] = [
  {
    title: "TWO WORLDS",
    description: "From the surface, the Sea of Cortez looks empty. Below and around — orcas, sperm whales, mobula rays, sea lions. Our expeditions reveal the wildlife hidden in plain sight.",
    leftImage: "/images/extracted/open-horizon.jpg",
    rightImage: "/images/extracted/boat-surrounded-orcas.jpg",
    leftLabel: "Surface",
    rightLabel: "Wildlife",
  },
];

export function BeforeAfterSection() {
  return (
    <section className="bg-deep py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-teal-light text-xs font-body tracking-[0.4em] uppercase mb-4">
            The Experience
          </p>
          <h2 className="text-display text-warm-white text-4xl md:text-6xl tracking-wide">
            TWO WORLDS
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {comparisons.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.2}>
              <div className="group">
                <ImageComparison
                  className="aspect-[16/10] w-full rounded-sm"
                  enableHover
                  springOptions={{ bounce: 0, duration: 0.3 }}
                >
                  <ImageComparisonImage
                    src={item.leftImage}
                    className="brightness-75 contrast-110"
                    alt={`${item.title} - ${item.leftLabel}`}
                    position="left"
                  />
                  <ImageComparisonImage
                    src={item.rightImage}
                    alt={`${item.title} - ${item.rightLabel}`}
                    position="right"
                  />
                  <ImageComparisonSlider className="w-0.5 bg-warm-white/30 backdrop-blur-sm">
                    <div className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral shadow-lg shadow-coral/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-3 h-3 text-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      </div>
                    </div>
                  </ImageComparisonSlider>
                </ImageComparison>

                {/* Labels */}
                <div className="flex justify-between mt-3 px-1">
                  <span className="text-warm-white/30 text-xs font-body tracking-[0.3em] uppercase">
                    {item.leftLabel}
                  </span>
                  <span className="text-warm-white/30 text-xs font-body tracking-[0.3em] uppercase">
                    {item.rightLabel}
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-display text-warm-white text-xl md:text-2xl tracking-wide mt-4 group-hover:text-teal-light transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-warm-white/40 text-sm font-body leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
