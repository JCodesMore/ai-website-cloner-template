"use client";

const posts = [
  {
    title: "How We Automated a Full Client Onboarding Flow in 3 Days",
    description:
      "From intake form to welcome email to CRM entry — completely automated.",
    date: "Apr 2025",
  },
  {
    title: "The 5 Automation Mistakes That Slow Businesses Down",
    description: "Common patterns we see in manual workflows — and how we fix them.",
    date: "Mar 2025",
  },
  {
    title: "Why Most Zapier Setups Break (And What to Do Instead)",
    description:
      "Single-tool automations often hit walls. Here's how to build systems that last.",
    date: "Mar 2025",
  },
];

export function BlogSection() {
  return (
    <section
      id="blog"
      className="py-16 md:py-24"
      style={{ borderTop: "1px solid oklch(1 0 0 / 0.1)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Automation insights</h2>
            <p className="mt-1 text-sm" style={{ color: "oklch(1 0 0 / 0.6)" }}>
              Practical guides and real workflows from the FLO team.
            </p>
          </div>
          <a
            href="#"
            className="text-sm font-bold transition-colors hover:text-white"
            style={{ color: "oklch(1 0 0 / 0.6)" }}
          >
            All posts →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.title}
              href="#"
              className="group flex flex-col gap-3 rounded-xl p-5 transition-colors"
              style={{
                background: "oklch(0.27 0.008 106)",
                border: "1px solid oklch(1 0 0 / 0.08)",
              }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(1 0 0 / 0.4)" }}
              >
                {post.date}
              </span>
              <h3
                className="text-base font-bold leading-snug text-white transition-colors group-hover:text-[oklch(0.95_0.15_108)]"
              >
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(1 0 0 / 0.6)" }}>
                {post.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
