import { Star, Award, Trophy } from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  label: string;
}

const BADGES: Badge[] = [
  {
    icon: <Star size={14} style={{ color: "#f9a825", flexShrink: 0 }} strokeWidth={2} />,
    label: "GetApp Top Rated",
  },
  {
    icon: <Award size={14} style={{ color: "#4a6cf7", flexShrink: 0 }} strokeWidth={2} />,
    label: "Capterra Best Value",
  },
  {
    icon: <Trophy size={14} style={{ color: "#ff6c50", flexShrink: 0 }} strokeWidth={2} />,
    label: "Software Advice Frontrunner",
  },
  {
    icon: <Star size={14} style={{ color: "#6b5ce7", flexShrink: 0 }} strokeWidth={2} />,
    label: "G2 High Performer",
  },
  {
    icon: <Award size={14} style={{ color: "#00c8d4", flexShrink: 0 }} strokeWidth={2} />,
    label: "Top Booking Software",
  },
];

export function TrustSection() {
  return (
    <section
      style={{
        background: "white",
        padding: "40px 0",
        borderBottom: "1px solid #dde3f0",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-0"
          style={{ justifyContent: "flex-start" }}
        >
          {/* Left text */}
          <p
            className="text-center md:text-left whitespace-nowrap"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#626b8a",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Trusted by 50,000+ businesses worldwide
          </p>

          {/* Divider */}
          <div
            className="hidden md:block"
            style={{
              width: 1,
              height: 40,
              background: "#dde3f0",
              margin: "0 32px",
              flexShrink: 0,
            }}
          />

          {/* Badge list */}
          <div
            className="flex flex-wrap justify-center md:justify-start"
            style={{ gap: 10 }}
          >
            {BADGES.map((badge) => (
              <div
                key={badge.label}
                style={{
                  border: "1px solid #dde3f0",
                  borderRadius: 100,
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {badge.icon}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a1d4f",
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
