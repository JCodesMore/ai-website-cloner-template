"use client";

import { useState } from "react";
import {
  Sparkles,
  Dumbbell,
  Stethoscope,
  GraduationCap,
  Camera,
  Briefcase,
  PawPrint,
  CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Industry {
  id: string;
  label: string;
  icon: LucideIcon;
  badgeColor: string;
  title: string;
  description: string;
  features: string[];
}

const INDUSTRIES: Industry[] = [
  {
    id: "beauty",
    label: "Beauty & Wellness",
    icon: Sparkles,
    badgeColor: "#ff6c50",
    title: "The #1 booking system for beauty professionals",
    description:
      "From solo estheticians to multi-location spas, SimplyBook.me handles your bookings, reminders, and payments.",
    features: [
      "Online booking with service menus",
      "Before/after photo gallery",
      "Loyalty programs & memberships",
      "Staff schedule management",
    ],
  },
  {
    id: "fitness",
    label: "Fitness & Sports",
    icon: Dumbbell,
    badgeColor: "#00c8d4",
    title: "Book more classes and personal training sessions",
    description:
      "Manage gym memberships, class schedules, and personal trainer bookings all in one platform.",
    features: [
      "Class and group session booking",
      "Membership management",
      "Waitlist for full classes",
      "Package deals and prepaid sessions",
    ],
  },
  {
    id: "medical",
    label: "Medical & Health",
    icon: Stethoscope,
    badgeColor: "#4f9cf9",
    title: "HIPAA-compliant appointment scheduling",
    description:
      "Trusted by clinics, therapists, and healthcare providers who need secure and compliant booking.",
    features: [
      "HIPAA compliance & encrypted SOAP notes",
      "Intake forms and medical history",
      "Telemedicine/video appointments",
      "Insurance information collection",
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    badgeColor: "#7c3aed",
    title: "Schedule tutoring, classes, and campus appointments",
    description:
      "From tutoring centers to universities, streamline student scheduling and parent bookings.",
    features: [
      "Student self-booking portal",
      "Multi-location room scheduling",
      "Parent/guardian booking on behalf of students",
      "Integration with Google Meet",
    ],
  },
  {
    id: "photography",
    label: "Photography",
    icon: Camera,
    badgeColor: "#e879f9",
    title: "Simplify your photography business bookings",
    description:
      "Let clients book shoots, view packages, and pay deposits — all from your booking page.",
    features: [
      "Package selection at booking",
      "Deposit and payment collection",
      "Client gallery integration",
      "Booking questionnaire/intake",
    ],
  },
  {
    id: "consulting",
    label: "Consulting",
    icon: Briefcase,
    badgeColor: "#0f1340",
    title: "Professional scheduling for consultants",
    description:
      "Share your availability and let clients book 1:1 sessions, video calls, or strategy sessions.",
    features: [
      "Buffer time between meetings",
      "Video call integration (Zoom, Meet)",
      "Custom intake questionnaire",
      "CRM-style client notes",
    ],
  },
  {
    id: "pet",
    label: "Pet Services",
    icon: PawPrint,
    badgeColor: "#f59e0b",
    title: "Book grooming, vet, and training appointments",
    description:
      "Purpose-built features for pet groomers, veterinary clinics, and dog trainers.",
    features: [
      "Pet profile with breed and age info",
      "Photo upload for before/after",
      "Multi-pet household management",
      "SMS reminders for pet owners",
    ],
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
    badgeColor: "#10b981",
    title: "Sell event tickets and manage RSVPs",
    description:
      "From workshops to corporate events, manage seats, sell tickets, and send automatic reminders.",
    features: [
      "Event capacity management",
      "Ticket tiers and pricing",
      "QR code ticket scanning",
      "Waitlist and overflow management",
    ],
  },
];

function TealCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="9" cy="9" r="9" fill="#00c8d4" fillOpacity="0.12" />
      <path
        d="M5.5 9.5L7.8 11.8L12.5 7"
        stroke="#00c8d4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface MockupCardProps {
  industry: Industry;
}

function MockupCard({ industry }: MockupCardProps) {
  const Icon = industry.icon;
  // Fake calendar days
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = [
    { day: 0, time: "9:00 AM", booked: false },
    { day: 1, time: "10:30 AM", booked: true },
    { day: 2, time: "2:00 PM", booked: false },
    { day: 3, time: "11:00 AM", booked: false },
    { day: 4, time: "3:30 PM", booked: true },
  ];

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 8px 40px rgba(15,19,64,0.12)",
        width: "100%",
        maxWidth: 460,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #dde3f0",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#00c8d4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color="white" />
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1a1d4f",
            }}
          >
            {industry.label} Booking
          </div>
          <div style={{ fontSize: 12, color: "#626b8a" }}>
            simplybook.me/book
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "#00c8d4",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 100,
            padding: "3px 10px",
          }}
        >
          LIVE
        </div>
      </div>

      {/* Week view */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#626b8a",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          This Week
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
          }}
        >
          {days.map((day, idx) => {
            const slot = slots.find((s) => s.day === idx);
            const isBooked = slot?.booked ?? false;
            return (
              <div
                key={day}
                style={{
                  textAlign: "center",
                  borderRadius: 8,
                  padding: "8px 4px",
                  background: isBooked ? "#0f1340" : "#f4f7ff",
                  border: `1px solid ${isBooked ? "#0f1340" : "#dde3f0"}`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isBooked ? "rgba(255,255,255,0.7)" : "#626b8a",
                    marginBottom: 4,
                  }}
                >
                  {day}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: isBooked ? "white" : "#1a1d4f",
                  }}
                >
                  {isBooked ? "Booked" : slot?.time ?? "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next available */}
      <div
        style={{
          background: "#f4f7ff",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#626b8a", marginBottom: 2 }}>
            Next available
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1d4f" }}>
            Tomorrow, 9:00 AM
          </div>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#00c8d4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 7h8M8 4l3 3-3 3"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Book Now CTA */}
      <button
        type="button"
        style={{
          width: "100%",
          background: "#ff6c50",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "13px 20px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.01em",
        }}
      >
        Book Now
      </button>
    </div>
  );
}

export function IndustriesSection() {
  const [activeId, setActiveId] = useState<string>(INDUSTRIES[0].id);

  const active = INDUSTRIES.find((i) => i.id === activeId) ?? INDUSTRIES[0];
  const ActiveIcon = active.icon;

  return (
    <section
      style={{
        background: "#f4f7ff",
        padding: "96px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ff6c50",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            INDUSTRIES
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#1a1d4f",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            Built for every service business
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "#626b8a",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Whether you run a beauty salon, medical practice, gym, or consulting
            firm — SimplyBook.me adapts to your industry.
          </p>
        </div>

        {/* Industry tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 40,
          }}
          role="tablist"
          aria-label="Industry tabs"
        >
          {INDUSTRIES.map((industry) => {
            const TabIcon = industry.icon;
            const isActive = industry.id === activeId;
            return (
              <button
                key={industry.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`industry-panel-${industry.id}`}
                onClick={() => setActiveId(industry.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: isActive ? "#0f1340" : "white",
                  border: `1px solid ${isActive ? "#0f1340" : "#dde3f0"}`,
                  borderRadius: 100,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "white" : "#626b8a",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <TabIcon size={16} />
                {industry.label}
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div
          id={`industry-panel-${active.id}`}
          role="tabpanel"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 48,
            marginTop: 56,
            alignItems: "center",
          }}
          className="lg:grid-cols-[5fr_7fr]"
        >
          {/* Left: Text content */}
          <div>
            {/* Industry badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: active.badgeColor + "18",
                color: active.badgeColor,
                borderRadius: 100,
                padding: "5px 14px",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <ActiveIcon size={14} />
              {active.label}
            </span>

            <h3
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#1a1d4f",
                lineHeight: 1.25,
                margin: "0 0 14px",
              }}
            >
              {active.title}
            </h3>

            <p
              style={{
                fontSize: 16,
                color: "#626b8a",
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              {active.description}
            </p>

            {/* Feature list */}
            <ul
              style={{
                listStyle: "none",
                margin: "0 0 28px",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {active.features.map((feature) => (
                <li
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 15,
                    color: "#1a1d4f",
                  }}
                >
                  <TealCheckIcon />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Learn more link */}
            <a
              href="#"
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#00c8d4",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Learn more →
            </a>
          </div>

          {/* Right: Mockup */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MockupCard industry={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
