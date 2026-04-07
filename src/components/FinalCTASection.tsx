export function FinalCTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 700,
            color: "oklch(1 0 0 / 0.9)",
            marginBottom: "16px",
          }}
        >
          Ready to automate your business?
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "oklch(1 0 0 / 0.6)",
            marginBottom: "48px",
          }}
        >
          Pick the right starting point for your team.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Automation System Card */}
          <div
            className="rounded-xl p-8 text-center flex flex-col items-center gap-4"
            style={{
              border: "1px solid oklch(0.95 0.15 108 / 0.3)",
            }}
          >
            <span style={{ fontSize: "40px" }}>⚙️</span>
            <div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "oklch(0.95 0.15 108)",
                }}
              >
                Automation System
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(1 0 0 / 0.6)",
                  marginTop: "4px",
                }}
              >
                Custom-built for you
              </p>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
                lineHeight: 1.6,
              }}
            >
              We design, build, and maintain your full automation stack.
            </p>
            <a
              href="/signup"
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "oklch(0.95 0.15 108)",
                color: "oklch(0.217 0.0038309 106.715)",
                fontSize: "16px",
                fontWeight: 700,
                padding: "14px 0",
                borderRadius: 0,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Build My System
            </a>
          </div>

          {/* See Examples Card */}
          <div
            className="rounded-xl p-8 text-center flex flex-col items-center gap-4"
            style={{
              border: "1px solid oklch(0.567 0.15 248 / 0.3)",
            }}
          >
            <span style={{ fontSize: "40px" }}>🔍</span>
            <div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "oklch(0.567 0.15 248)",
                }}
              >
                See Examples
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(1 0 0 / 0.6)",
                  marginTop: "4px",
                }}
              >
                Real automations we&apos;ve built
              </p>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
                lineHeight: 1.6,
              }}
            >
              Browse workflows we&apos;ve built for service businesses like yours.
            </p>
            <a
              href="/start"
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "oklch(0.567 0.15 248)",
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                padding: "14px 0",
                borderRadius: 0,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              View Examples
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
