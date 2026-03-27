"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function CtaSection() {
  const [email, setEmail] = useState("");

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #0f1340 0%, #1a1d65 50%, #2a1f7a 100%)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blob */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-100px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          background: "rgba(0,200,212,0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255,108,80,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle size={32} style={{ color: "#ff6c50" }} />
        </div>

        {/* Heading */}
        <h2
          style={{
            fontSize: "clamp(30px, 4vw, 48px)",
            fontWeight: 800,
            color: "white",
            marginTop: "24px",
            marginBottom: 0,
            lineHeight: 1.15,
          }}
        >
          Start your free 14-day trial today
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.72)",
            marginTop: "16px",
            marginBottom: 0,
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          Join 50,000+ businesses using SimplyBook.me. No credit card required.
          Cancel anytime.
        </p>

        {/* Email + CTA row */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "12px", marginTop: "40px" }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your work email"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "8px",
              padding: "16px 20px",
              width: "280px",
              color: "white",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <button
            type="button"
            style={{
              background: "#ff6c50",
              color: "white",
              borderRadius: "8px",
              padding: "16px 28px",
              fontWeight: 700,
              fontSize: "15px",
              whiteSpace: "nowrap",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#e85a3e";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#ff6c50";
            }}
          >
            Create free account
          </button>
        </div>

        {/* Trust points */}
        <div
          className="flex flex-wrap justify-center"
          style={{
            gap: "24px",
            marginTop: "20px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>✓ Free forever plan available</span>
          <span>✓ 50,000+ businesses trust us</span>
          <span>✓ Setup in minutes</span>
        </div>
      </div>
    </section>
  );
}
