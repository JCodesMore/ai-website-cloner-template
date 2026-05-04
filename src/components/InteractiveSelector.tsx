"use client";

import React, { useState, useEffect } from "react";
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
    icon: <Fish size={24} className="text-warm-white" />,
  },
  {
    title: "Sperm Whales",
    description: "Rare sightings of cachalote pods",
    image: "/images/extracted/four-sperm-whales-formation.jpg",
    icon: <Waves size={24} className="text-warm-white" />,
  },
  {
    title: "Humpback Up Close",
    description: "Surfacing alongside the expedition boat",
    image: "/images/extracted/humpback-boat-tourists.jpg",
    icon: <Binoculars size={24} className="text-warm-white" />,
  },
  {
    title: "Sea of Cortez",
    description: "Heading out to Cerralvo Island",
    image: "/images/extracted/open-horizon.jpg",
    icon: <Sailboat size={24} className="text-warm-white" />,
  },
  {
    title: "On the Water",
    description: "Wildlife-first, safety-always expeditions",
    image: "/images/extracted/boat-orca-breach.jpg",
    icon: <Anchor size={24} className="text-warm-white" />,
  },
];

export function InteractiveSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full bg-deep font-body text-warm-white py-16 md:py-24 px-6">
      {/* Options container */}
      <div className="options flex w-full max-w-[1100px] md:min-w-[600px] h-[360px] md:h-[460px] mx-auto items-stretch overflow-hidden relative">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out ${
              activeIndex === index ? "active" : ""
            }`}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? "auto 100%" : "auto 120%",
              backgroundPosition: "center",
              backfaceVisibility: "hidden",
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? "translateX(0)" : "translateX(-60px)",
              minWidth: "60px",
              minHeight: "100px",
              margin: 0,
              borderRadius: 0,
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: activeIndex === index ? "#36859A" : "#0F2832",
              cursor: "pointer",
              backgroundColor: "#0A1C24",
              boxShadow:
                activeIndex === index
                  ? "0 20px 60px rgba(0,0,0,0.50), 0 0 0 1px rgba(74,157,178,0.25)"
                  : "0 10px 30px rgba(0,0,0,0.30)",
              flex: activeIndex === index ? "7 1 0%" : "1 1 0%",
              zIndex: activeIndex === index ? 10 : 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "relative",
              overflow: "hidden",
              willChange: "flex-grow, box-shadow, background-size, background-position",
            }}
            onClick={() => handleOptionClick(index)}
          >
            {/* Shadow overlay */}
            <div
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? "0" : "-40px",
                height: "120px",
                boxShadow:
                  activeIndex === index
                    ? "inset 0 -120px 120px -120px #0A1C24, inset 0 -120px 120px -80px #0A1C24"
                    : "inset 0 -120px 0px -120px #0A1C24, inset 0 -120px 0px -80px #0A1C24",
              }}
            ></div>

            {/* Label with icon + info */}
            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-[2] pointer-events-none px-4 gap-3 w-full">
              <div className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[rgba(10,28,36,0.85)] backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.35)] border-2 border-teal/40 flex-shrink-0 flex-grow-0 transition-all duration-200">
                {option.icon}
              </div>
              <div className="info text-warm-white whitespace-pre relative">
                <div
                  className="main font-body font-semibold text-lg tracking-wide transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? "translateX(0)" : "translateX(25px)",
                  }}
                >
                  {option.title}
                </div>
                <div
                  className="sub text-sm text-warm-white/70 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? "translateX(0)" : "translateX(25px)",
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}

export default InteractiveSelector;
