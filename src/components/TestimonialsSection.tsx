interface Testimonial {
  quote: string;
  name: string;
  business: string;
  avatarColor: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "SimplyBook.me completely transformed how we manage appointments at our salon. Bookings went up 40% in the first month because clients can book 24/7 without calling us.",
    name: "Sarah Mitchell",
    business: "Beauty Salon Owner, New York",
    avatarColor: "#ff6c50",
    initials: "SM",
  },
  {
    quote:
      "The HIPAA compliance and SOAP notes feature made it the obvious choice for our therapy practice. Our clients love the easy booking experience.",
    name: "Dr. James Wilson",
    business: "Licensed Therapist, Chicago",
    avatarColor: "#4a6cf7",
    initials: "JW",
  },
  {
    quote:
      "We manage 3 gym locations and 25 personal trainers through SimplyBook.me. The admin panel is intuitive and the reporting helps us make better business decisions.",
    name: "Marcus Thompson",
    business: "Fitness Studio Owner, Los Angeles",
    avatarColor: "#00b894",
    initials: "MT",
  },
  {
    quote:
      "As a freelance photographer, I used to spend hours on admin. Now clients book their own shoots, pay deposits, and fill out questionnaires automatically. Game changer.",
    name: "Emma Rodriguez",
    business: "Professional Photographer, Miami",
    avatarColor: "#6b5ce7",
    initials: "ER",
  },
  {
    quote:
      "The Reserve with Google integration alone paid for the entire subscription within the first week. New clients found us through Google and booked directly.",
    name: "Chen Wei",
    business: "Acupuncture Clinic, San Francisco",
    avatarColor: "#f9a825",
    initials: "CW",
  },
  {
    quote:
      "Our dog grooming business has grown 60% since using SimplyBook.me. The automated reminders cut no-shows in half and clients love the pet profile feature.",
    name: "Lisa Patel",
    business: "Pet Grooming Salon, Austin",
    avatarColor: "#ff6c50",
    initials: "LP",
  },
];

const platformBadges = [
  { name: "G2", rating: "4.8" },
  { name: "Capterra", rating: "4.8" },
  { name: "GetApp", rating: "4.8" },
  { name: "Trustpilot", rating: "4.8" },
];

function StarRating({ count = 5, size = 16 }: { count?: number; size?: number }) {
  return (
    <div className="flex" style={{ gap: "2px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#f9a825"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section style={{ background: "#f4f7ff", padding: "96px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section header */}
        <div className="text-center">
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#ff6c50",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            TESTIMONIALS
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "#1a1d4f",
              margin: "0 auto 16px",
              lineHeight: 1.15,
            }}
          >
            Loved by 50,000+ businesses
          </h2>

          {/* Rating row */}
          <div
            className="flex items-center justify-center"
            style={{ gap: "10px" }}
          >
            <StarRating count={5} size={18} />
            <span style={{ fontSize: "15px", color: "#626b8a" }}>
              4.8 out of 5 based on 2,000+ reviews
            </span>
          </div>
        </div>

        {/* Testimonials grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "24px", marginTop: "48px" }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "28px",
                border: "1px solid #dde3f0",
                boxShadow: "0 2px 12px rgba(15,19,64,0.06)",
              }}
            >
              {/* Decorative quote mark */}
              <div
                aria-hidden="true"
                style={{
                  fontSize: "64px",
                  color: "#dde3f0",
                  lineHeight: 0.6,
                  fontFamily: "Georgia, serif",
                  userSelect: "none",
                }}
              >
                &ldquo;
              </div>

              {/* Review text */}
              <p
                style={{
                  fontSize: "15px",
                  color: "#1a1d4f",
                  lineHeight: 1.7,
                  marginTop: "16px",
                  marginBottom: 0,
                }}
              >
                {t.quote}
              </p>

              {/* Stars */}
              <div style={{ marginTop: "16px" }}>
                <StarRating count={5} size={16} />
              </div>

              {/* Reviewer */}
              <div
                className="flex items-center"
                style={{ gap: "12px", marginTop: "16px" }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: t.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                  aria-label={t.name}
                >
                  {t.initials}
                </div>

                {/* Name + business */}
                <div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1a1d4f",
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#626b8a",
                      margin: 0,
                    }}
                  >
                    {t.business}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform logos / badge row */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "12px", marginTop: "48px" }}
        >
          {platformBadges.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "white",
                border: "1px solid #dde3f0",
                borderRadius: "999px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1d4f",
              }}
            >
              <span>{p.name}</span>
              <span style={{ color: "#f9a825" }}>★</span>
              <span style={{ color: "#626b8a", fontWeight: 400 }}>
                {p.rating}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
