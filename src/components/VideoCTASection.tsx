"use client";

import Image from "next/image";

export function VideoCTASection() {
  return (
    <section
      className="px-6"
      style={{
        paddingBlock: "clamp(3rem, 2rem + 4vw, 6rem)",
      }}
    >
      <div className="mx-auto max-w-[1125px]">
        <div
          className="relative isolate flex flex-col items-center overflow-hidden text-center"
          style={{
            backgroundColor: "#360854",
            borderRadius: "clamp(1rem, 0.7359rem + 1.1268vw, 1.75rem)",
            padding:
              "clamp(2.5rem, 1.7298rem + 3.2864vw, 4.6875rem) 1.25rem",
            gap: "1.5rem",
          }}
        >
          {/* Dot pattern overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #8f65ac 1.5px, transparent 0)",
              backgroundSize: "7.5px 7.5px",
              opacity: 0.4,
            }}
          />

          {/* Masked gradient overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, #360854 70%)",
            }}
          />

          {/* Background video */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: -1 }}
            autoPlay
            loop
            muted
            playsInline
            poster="/images/cards-for-ads.jpg"
          >
            <source src="/videos/3d-cards-cta.mp4" type="video/mp4" />
          </video>

          {/* Logomark */}
          <div className="relative z-[2]">
            <Image
              src="/images/logomark.svg"
              alt="LeadingCards"
              width={60}
              height={60}
              className="rounded-full"
              style={{
                width: "3.75rem",
                height: "3.75rem",
                boxShadow:
                  "0 0 40px 10px rgba(138, 43, 226, 0.4), 0 0 80px 20px rgba(138, 43, 226, 0.2)",
              }}
            />
          </div>

          {/* Heading */}
          <h2
            className="relative z-[2] mx-auto max-w-[20ch] font-bold"
            style={{
              fontSize: "clamp(1.75rem, 1.1338rem + 2.6291vw, 3.5rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#ffffff",
            }}
          >
            Ready to power up your media buying? Let&apos;s make it happen!
          </h2>

          {/* CTA Button */}
          <a
            href="https://app.leadingcards.media/auth/login"
            className="relative z-[2] inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #33c19b 0%, #1ea47e 100%)",
              boxShadow:
                "0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            Open Account
          </a>
        </div>
      </div>
    </section>
  );
}
