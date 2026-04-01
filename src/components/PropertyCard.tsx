"use client";

import { useState } from "react";
import type { Property } from "@/types";

function LocationPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function DealGauge({ dealType }: { dealType: Property["dealType"] }) {
  const angles: Record<string, number> = { smart: 20, great: 45, excellent: 75 };
  const angle = dealType ? (angles[dealType] ?? 0) : 0;
  const cx = 60, cy = 60, r = 44;
  const rad = ((180 - angle) * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy - r * Math.sin(rad);
  const arcFill = dealType ? (angles[dealType] / 90) * 163 : 0;

  return (
    <svg width="120" height="68" viewBox="0 0 120 68">
      <path d="M8,60 A52,52 0 0,1 112,60" fill="none" stroke="#e0e0e0" strokeWidth="8" strokeLinecap="round" />
      <path d="M8,60 A52,52 0 0,1 112,60" fill="none" stroke="#d19f46" strokeWidth="8" strokeLinecap="round"
        strokeDasharray="163" strokeDashoffset={163 - arcFill} />
      <line x1="60" y1="60" x2={nx} y2={ny} stroke="#121212" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="5" fill="#121212" />
    </svg>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = property.images;
  const hasPrev = imgIndex > 0;
  const hasNext = imgIndex < images.length - 1;

  const arrowBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.45)",
    border: "none",
    color: "#fff",
    width: 28,
    height: 28,
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    zIndex: 2,
    padding: 0,
    lineHeight: 1,
  };

  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 4, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      {/* Image carousel */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[imgIndex]}
          alt={property.location}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Prev */}
        {hasPrev && (
          <button style={{ ...arrowBtn, left: 8 }} onClick={() => setImgIndex(imgIndex - 1)} aria-label="Previous">
            ‹
          </button>
        )}
        {/* Next */}
        {hasNext && (
          <button style={{ ...arrowBtn, right: 8 }} onClick={() => setImgIndex(imgIndex + 1)} aria-label="Next">
            ›
          </button>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                aria-label={`Image ${i + 1}`}
                style={{
                  width: 6, height: 6, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                  background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}
        {/* Location badge */}
        <div style={{
          position: "absolute", bottom: 8, left: 8,
          background: "rgba(4,90,166,0.35)",
          backdropFilter: "blur(4px)",
          color: "#fff", fontSize: 12, fontWeight: 600,
          padding: "3px 10px", borderRadius: 20,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <LocationPinIcon />
          {property.location}
        </div>
        {/* Deal badge */}
        {property.dealBadgeImage && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={property.dealBadgeImage} alt="deal badge" style={{ width: 72, height: "auto" }} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 0", fontSize: 13 }}>
          {[
            { label: "Dormitorios", value: property.beds },
            { label: "Baños", value: property.baths },
            { label: "Pie cuadrado", value: property.sqft.toLocaleString() },
            { label: "Precio de lista:", value: property.price },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ color: "#888", fontSize: 11, fontWeight: 500 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gauge */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 8px" }}>
        <DealGauge dealType={property.dealType} />
      </div>
    </div>
  );
}
