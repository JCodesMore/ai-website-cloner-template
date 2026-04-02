"use client";

import Image from "next/image";
import Link from "next/link";

const cards = [
  { src: "/images/banking-card-1.svg", alt: "Banking Card 1" },
  { src: "/images/banking-card-2.svg", alt: "Banking Card 2" },
  { src: "/images/banking-card-3.svg", alt: "Banking Card 3" },
  { src: "/images/banking-card-4.svg", alt: "Banking Card 4" },
];

export function HeroSection() {
  return (
    <header className="relative">
      <div
        className="relative overflow-hidden isolate"
        style={{ borderRadius: "28px" }}
      >
        {/* Background */}
        <div className="absolute inset-0 select-none -z-10">
          <div
            className="absolute inset-0 select-none -z-10"
            style={{
              backgroundColor: "#180425",
              clipPath:
                "polygon(0% 0%, calc(50% - 217px) 0%, calc(50% - 149.5px) 56px, calc(50% + 149.5px) 56px, calc(50% + 217px) 0%, 100% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative"
          style={{
            paddingTop: "clamp(4.125rem, 8.8346vw + 2.0544rem, 10rem)",
            paddingBottom: "clamp(1.5rem, 1.0819rem + 1.784vw, 2.6875rem)",
          }}
        >
          {/* Heading Area */}
          <div className="grid justify-items-center text-center px-6 relative">
            {/* Decorative lines */}
            <Image
              src="/images/line-left.svg"
              alt=""
              width={200}
              height={400}
              className="absolute top-0 left-0 select-none pointer-events-none hidden xl:block"
            />
            <Image
              src="/images/line-right.svg"
              alt=""
              width={200}
              height={400}
              className="absolute top-0 right-0 select-none pointer-events-none hidden xl:block"
            />

            <h1
              className="font-bold text-white"
              style={{
                fontSize: "clamp(2.5rem, 1.6197rem + 3.7559vw, 5rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                maxWidth: "14ch",
              }}
            >
              Trusted{" "}
              <span style={{ color: "#33b3ff" }}>cards</span> for advertising
            </h1>

            <p
              style={{
                color: "#bfc8d9",
                maxWidth: "42ch",
                marginTop: "1rem",
                marginBottom: "1.25rem",
                fontSize: "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
              }}
            >
              Our cards work flawlessly with major advertising platforms,
              ensuring uninterrupted ad spend
            </p>

            <Link
              href="https://app.leadingcards.media/auth/login"
              className="button-primary"
            >
              Open Account
            </Link>
          </div>

          {/* Social Proof */}
          <div
            className="grid gap-3 mt-6"
            style={{ marginTop: "1.5625rem" }}
          >
            <div className="flex items-center justify-center gap-4 overflow-auto hide-scrollbar">
              <Image
                src="/images/socialist-logo.svg"
                alt="Trusted"
                width={100}
                height={24}
                className="flex-shrink-0"
              />
              <Image
                src="/images/line-separator.svg"
                alt=""
                width={1}
                height={24}
                className="flex-shrink-0 opacity-40"
              />
              <span
                className="whitespace-nowrap text-sm"
                style={{ color: "#bfc8d9" }}
              >
                100+ businesses
              </span>
            </div>
          </div>

          {/* Card Slider */}
          <div
            className="overflow-hidden mt-6"
            style={{
              marginTop: "clamp(1.4375rem, 1.3275rem + 0.4695vw, 1.75rem)",
            }}
          >
            <div className="flex animate-hero-scroll">
              {[...cards, ...cards, ...cards].map((card, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 overflow-hidden"
                  style={{
                    borderRadius:
                      "clamp(0.75rem, 0.662rem + 0.3756vw, 1rem)",
                    width:
                      "clamp(16.625rem, 14.1162rem + 10.7042vw, 23.75rem)",
                    paddingLeft:
                      "clamp(0.8125rem, 0.7025rem + 0.4695vw, 1.125rem)",
                    paddingRight:
                      "clamp(0.8125rem, 0.7025rem + 0.4695vw, 1.125rem)",
                  }}
                >
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={380}
                    height={240}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Pattern */}
        <Image
          src="/images/home-banner-pattern.png"
          alt=""
          width={1440}
          height={200}
          className="absolute bottom-0 left-0 w-full select-none pointer-events-none"
        />
      </div>

    </header>
  );
}
