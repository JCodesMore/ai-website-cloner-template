export function ProductsSection() {
  return (
    <section
      id="products"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24"
    >
      <div className="flex flex-col gap-16 md:gap-24">
        {/* FlowStack */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Left: text */}
          <div className="flex flex-col gap-3">
            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                color: "oklch(0.95 0.15 108)",
                fontWeight: 700,
              }}
            >
              FlowStack
            </h2>
            <p
              className="font-bold text-white"
              style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700 }}
            >
              Automation systems in days, not months
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "oklch(1 0 0 / 0.6)",
              }}
            >
              Built using proven tools and clean architecture — no hacks, no fragile setups.
            </p>
          </div>

          {/* Right: feature card */}
          <div
            className="rounded-xl p-6 md:p-8"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.15 108 / 0.05), oklch(0.27 0.008 106))",
              border: "1px solid oklch(0.95 0.15 108 / 0.3)",
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span style={{ fontSize: "24px" }}>⚙️</span>
              <span
                className="font-bold text-white"
                style={{ fontSize: "16px", fontWeight: 700 }}
              >
                Your dedicated automation system
              </span>
            </div>
            <p
              className="mb-4"
              style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.6)" }}
            >
              We build complete end-to-end automations for your business — from
              lead capture to delivery. No templates, no DIY.
            </p>
            <ul className="mb-6 flex flex-col gap-2">
              {[
                "Runs 24/7 without human input",
                "Connects to your existing tools",
                "Custom-built for your exact workflow",
                "Ongoing support and maintenance",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2"
                  style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.8)" }}
                >
                  <span style={{ color: "oklch(0.95 0.15 108)" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                className="font-bold"
                style={{
                  background: "oklch(0.95 0.15 108)",
                  color: "oklch(0.217 0.0038309 106.715)",
                  paddingInline: "24px",
                  paddingBlock: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Your System
              </button>
              <button
                className="font-bold"
                style={{
                  background: "oklch(0.285 0 0)",
                  color: "oklch(1 0 0 / 0.9)",
                  paddingInline: "24px",
                  paddingBlock: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* FlowOps */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Feature card — left on desktop */}
          <div
            className="rounded-xl p-6 md:order-first md:p-8"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.567 0.15 248 / 0.05), oklch(0.27 0.008 106))",
              border: "1px solid oklch(0.567 0.15 248 / 0.3)",
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span style={{ fontSize: "24px" }}>🔄</span>
              <span
                className="font-bold text-white"
                style={{ fontSize: "16px", fontWeight: 700 }}
              >
                Workflow intelligence, not just triggers
              </span>
            </div>
            <p
              className="mb-4"
              style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.6)" }}
            >
              FlowOps handles multi-step processes that require logic, conditions,
              and sequencing — not just simple Zaps.
            </p>
            <ul className="mb-6 flex flex-col gap-2">
              {[
                "Multi-step logic and branching",
                "Error handling and fallbacks",
                "Real-time monitoring and alerts",
                "CRM, email, and data sync",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2"
                  style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.8)" }}
                >
                  <span style={{ color: "oklch(0.567 0.15 248)" }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <button
                className="font-bold"
                style={{
                  background: "oklch(0.567 0.15 248)",
                  color: "oklch(1 0 0 / 0.9)",
                  paddingInline: "24px",
                  paddingBlock: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View Examples
              </button>
              <button
                className="font-bold"
                style={{
                  background: "oklch(0.285 0 0)",
                  color: "oklch(1 0 0 / 0.9)",
                  paddingInline: "24px",
                  paddingBlock: "12px",
                  fontSize: "16px",
                  fontWeight: 700,
                  borderRadius: 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                All Capabilities
              </button>
            </div>
          </div>

          {/* Right: text */}
          <div className="flex flex-col gap-3">
            <h2
              className="font-bold"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                color: "oklch(0.567 0.15 248)",
                fontWeight: 700,
              }}
            >
              FlowOps
            </h2>
            <p
              className="font-bold text-white"
              style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700 }}
            >
              Operations that run themselves
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "oklch(1 0 0 / 0.6)",
              }}
            >
              We map your processes and rebuild them as automated systems that scale with you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
