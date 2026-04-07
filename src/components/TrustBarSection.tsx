const STATS = [
  { value: "80%+", label: "manual work eliminated" },
  { value: "10x", label: "faster response time" },
  { value: "0 missed", label: "leads or handoffs" },
];

export function TrustBarSection() {
  return (
    <section
      id="trust-bar"
      className="py-12"
      style={{
        borderTop: "1px solid oklch(1 0 0 / 0.1)",
        borderBottom: "1px solid oklch(1 0 0 / 0.1)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-6 sm:flex-row sm:gap-0">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-1 flex-col items-center gap-1 text-center"
            style={
              i < STATS.length - 1
                ? {
                    borderRight: "1px solid oklch(1 0 0 / 0.1)",
                  }
                : undefined
            }
          >
            <span
              className="font-extrabold"
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "oklch(0.95 0.15 108)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span
              className="uppercase tracking-wider"
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
