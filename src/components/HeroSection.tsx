"use client";

import { useState } from "react";

// Calendar mockup data
const CALENDAR_DAYS = [
  [null, null, null, null, null, null, 1],
  [2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27, 28, 29],
  [30, 31, null, null, null, null, null],
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const HIGHLIGHTED_DAYS = new Set([5, 12, 18, 25]);
const TODAY = 14;

const SERVICES = [
  { color: "#ff6c50", label: "Haircut & Style" },
  { color: "#00c8d4", label: "Color Treatment" },
  { color: "#6b5ce7", label: "Massage 60min" },
  { color: "#f9a825", label: "Consultation" },
];

function BookingMockup() {
  return (
    <div
      className="animate-float"
      style={{
        maxWidth: 480,
        width: "100%",
        borderRadius: 16,
        boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        overflow: "hidden",
        background: "white",
      }}
    >
      {/* Window chrome top bar */}
      <div
        style={{
          background: "#1a1d65",
          height: 44,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 0,
          flexShrink: 0,
        }}
      >
        {/* Traffic light dots */}
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ff5f57",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#febc2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#28c840",
            }}
          />
        </div>
        {/* URL bar mock */}
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            height: 22,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 4,
          }}
        />
      </div>

      {/* Content area */}
      <div
        style={{
          padding: 16,
          display: "flex",
          gap: 12,
          background: "white",
        }}
      >
        {/* Left sidebar: service list */}
        <div
          style={{
            width: 160,
            flexShrink: 0,
            background: "#f8f9fc",
            borderRadius: 8,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#626b8a",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Services
          </p>
          {SERVICES.map((service) => (
            <div
              key={service.label}
              style={{
                background: "white",
                borderRadius: 6,
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 4px rgba(15,19,64,0.06)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: service.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "#1a1d4f",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {service.label}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Calendar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Month header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <button
              type="button"
              aria-label="Previous month"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
                color: "#626b8a",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ‹
            </button>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1a1d4f",
              }}
            >
              March 2025
            </span>
            <button
              type="button"
              aria-label="Next month"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px 6px",
                color: "#626b8a",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>

          {/* Day header row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
              marginBottom: 4,
            }}
          >
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#626b8a",
                  padding: "2px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 2,
            }}
          >
            {CALENDAR_DAYS.flat().map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }
              const isHighlighted = HIGHLIGHTED_DAYS.has(day);
              const isToday = day === TODAY;
              return (
                <div
                  key={`day-${day}`}
                  style={{
                    textAlign: "center",
                    padding: "4px 2px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: isToday || isHighlighted ? 700 : 400,
                    color: isToday
                      ? "white"
                      : isHighlighted
                        ? "#00c8d4"
                        : "#1a1d4f",
                    background: isToday
                      ? "#00c8d4"
                      : isHighlighted
                        ? "rgba(0,200,212,0.1)"
                        : "transparent",
                    cursor: "default",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Booking slots preview */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { time: "10:00 AM", service: "Haircut & Style", color: "#ff6c50" },
              { time: "2:30 PM", service: "Color Treatment", color: "#00c8d4" },
            ].map((slot) => (
              <div
                key={slot.time}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f8f9fc",
                  borderRadius: 6,
                  padding: "6px 8px",
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 24,
                    borderRadius: 2,
                    background: slot.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#1a1d4f" }}>
                    {slot.time}
                  </div>
                  <div style={{ fontSize: 9, color: "#626b8a" }}>{slot.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const [email, setEmail] = useState("");

  return (
    <section
      className="sb-hero-gradient"
      style={{
        paddingTop: 140,
        paddingBottom: 80,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: 400,
          height: 400,
          background: "rgba(0,200,212,0.08)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "20%",
          right: "-5%",
          width: 500,
          height: 500,
          background: "rgba(42,31,122,0.4)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "30%",
          width: 300,
          height: 300,
          background: "rgba(255,108,80,0.06)",
          borderRadius: "50%",
          filter: "blur(50px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Container */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8"
        >
          {/* Left column — text content */}
          <div
            className="flex-1 text-center lg:text-left"
            style={{ maxWidth: 600 }}
          >
            {/* Label pill */}
            <div
              className="inline-flex items-center"
              style={{
                background: "rgba(0,200,212,0.15)",
                border: "1px solid rgba(0,200,212,0.3)",
                borderRadius: 100,
                padding: "6px 14px",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "#00c8d4",
                  fontWeight: 500,
                }}
              >
                ✓ Trusted by 50,000+ businesses worldwide
              </span>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 58px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "white",
                marginTop: 20,
              }}
            >
              The smarter way to accept{" "}
              <span style={{ color: "#00c8d4" }}>online bookings</span>
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
                maxWidth: 480,
                marginTop: 20,
              }}
              className="mx-auto lg:mx-0"
            >
              SimplyBook.me gives you a powerful booking website, a booking
              widget for your site, and tools to manage your entire business
              — all in one place.
            </p>

            {/* Email + CTA row */}
            <div
              className="flex flex-wrap justify-center lg:justify-start"
              style={{ gap: 12, marginTop: 36 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "14px 18px",
                  width: 260,
                  color: "white",
                  fontSize: 15,
                  outline: "none",
                }}
                className="placeholder-[rgba(255,255,255,0.4)]"
              />
              <button
                type="button"
                style={{
                  background: "#ff6c50",
                  color: "white",
                  borderRadius: 8,
                  padding: "14px 24px",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                }}
                className="hover:!bg-[#e85a3e]"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#e85a3e";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#ff6c50";
                }}
              >
                Get started free
              </button>
            </div>

            {/* Subtext */}
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginTop: 14,
              }}
            >
              ✓ Free 14-day trial &nbsp;·&nbsp; ✓ No credit card required &nbsp;·&nbsp; ✓ Cancel anytime
            </p>
          </div>

          {/* Right column — booking mockup */}
          <div
            className="flex-1 flex justify-center lg:justify-end"
            style={{ minWidth: 0 }}
          >
            <BookingMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
