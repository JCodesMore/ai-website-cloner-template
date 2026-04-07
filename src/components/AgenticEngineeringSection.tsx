const modes = [
  { name: "Lead Mode", description: "Capture, qualify, route, and follow up with leads automatically" },
  { name: "Ops Mode", description: "Handle internal operations, task routing, and team notifications" },
  { name: "Data Sync Mode", description: "Keep your CRM, spreadsheets, and tools in sync without manual entry" },
];

export function AgenticEngineeringSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "oklch(0.95 0.15 108)",
            marginBottom: "12px",
          }}
        >
          One system, multiple workflows
        </p>

        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 800,
            color: "oklch(1 0 0 / 0.9)",
            lineHeight: 1.1,
          }}
        >
          Built for real business operations
        </h2>

        <p
          style={{
            fontSize: "18px",
            color: "oklch(1 0 0 / 0.6)",
            marginTop: "16px",
            lineHeight: 1.6,
            maxWidth: "600px",
          }}
        >
          Every FLO system handles multiple workflows simultaneously, adapting
          to your business logic.
        </p>

        <div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {modes.map((mode) => (
            <div
              key={mode.name}
              className="p-4 rounded-lg"
              style={{
                backgroundColor: "oklch(0.27 0.008 106)",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "oklch(1 0 0 / 0.9)",
                  marginBottom: "4px",
                }}
              >
                {mode.name}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "oklch(1 0 0 / 0.6)",
                }}
              >
                {mode.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a
            href="/start"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "oklch(0.567 0.15 248)",
              color: "white",
              fontSize: "16px",
              fontWeight: 700,
              padding: "0 28px",
              height: "48px",
              borderRadius: 0,
              textDecoration: "none",
            }}
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
