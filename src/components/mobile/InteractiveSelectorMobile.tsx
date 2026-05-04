"use client";

import React, { useState } from "react";
import { Sailboat, Fish, Waves, Anchor, Binoculars } from "lucide-react";

type Option = {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
};

const options: Option[] = [
  {
    title: "Orca Encounters",
    description: "Swim beside pods in the Sea of Cortez",
    image: "/images/extracted/boat-surrounded-orcas.jpg",
    icon: <Fish size={20} className="text-warm-white" />,
  },
  {
    title: "Sperm Whales",
    description: "Rare sightings of cachalote pods",
    image: "/images/extracted/four-sperm-whales-formation.jpg",
    icon: <Waves size={20} className="text-warm-white" />,
  },
  {
    title: "Humpback Up Close",
    description: "Surfacing alongside the expedition boat",
    image: "/images/extracted/humpback-boat-tourists.jpg",
    icon: <Binoculars size={20} className="text-warm-white" />,
  },
  {
    title: "Sea of Cortez",
    description: "Heading out to Cerralvo Island",
    image: "/images/extracted/open-horizon.jpg",
    icon: <Sailboat size={20} className="text-warm-white" />,
  },
  {
    title: "On the Water",
    description: "Wildlife-first, safety-always expeditions",
    image: "/images/extracted/boat-orca-breach.jpg",
    icon: <Anchor size={20} className="text-warm-white" />,
  },
];

export function InteractiveSelectorMobile() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="bg-deep py-12 px-4">
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {options.map((option, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={option.title}
              onClick={() => setActiveIndex(isActive ? -1 : index)}
              aria-expanded={isActive}
              className={`relative w-full overflow-hidden rounded-md text-left transition-all duration-500 ease-out border-2 ${
                isActive ? "border-teal h-[220px]" : "border-deep-light h-[88px]"
              }`}
              style={{
                backgroundImage: `url('${option.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: isActive
                  ? "0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,157,178,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.30)",
              }}
            >
              {/* Gradient overlay for legibility */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(10,28,36,0.95) 0%, rgba(10,28,36,0.55) 50%, rgba(10,28,36,0.25) 100%)"
                    : "linear-gradient(to right, rgba(10,28,36,0.85) 0%, rgba(10,28,36,0.55) 60%, rgba(10,28,36,0.25) 100%)",
                }}
              />

              {/* Label */}
              <div className="relative z-10 h-full flex items-end p-4 gap-3">
                <div className="min-w-[40px] h-[40px] flex items-center justify-center rounded-full bg-deep/85 backdrop-blur-sm border border-teal/40 flex-shrink-0">
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-warm-white font-body font-semibold text-base tracking-wide leading-tight">
                    {option.title}
                  </div>
                  <div
                    className={`text-warm-white/75 text-xs font-body mt-0.5 leading-snug transition-all duration-300 ${
                      isActive ? "opacity-100 max-h-10" : "opacity-0 max-h-0"
                    }`}
                  >
                    {option.description}
                  </div>
                </div>
                <span
                  className={`text-warm-white/50 text-lg flex-shrink-0 transition-transform duration-300 ${
                    isActive ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
