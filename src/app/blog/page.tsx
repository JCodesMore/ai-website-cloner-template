import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/lib/posts";

const CATEGORY_COLORS: Record<string, string> = {
  "Case Study": "oklch(0.95 0.15 108)",
  Guide: "oklch(0.567 0.15 248)",
  "Deep Dive": "oklch(0.75 0.12 280)",
  Beginner: "oklch(0.7 0.12 160)",
  Comparison: "oklch(0.75 0.15 60)",
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main className="flex grow flex-col">
        <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          {/* Header */}
          <div className="mb-14">
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
              Automation insights
            </p>
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                fontWeight: 800,
                color: "oklch(1 0 0 / 0.9)",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              The FLO Blog
            </h1>
            <p style={{ fontSize: "17px", color: "oklch(1 0 0 / 0.55)", lineHeight: 1.6 }}>
              Practical guides, real workflows, and honest takes on business automation.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-12 flex flex-col gap-5 rounded-xl p-8 md:flex-row md:items-start md:gap-10"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.15 108 / 0.05), oklch(0.27 0.008 106))",
              border: "1px solid oklch(0.95 0.15 108 / 0.25)",
              textDecoration: "none",
              display: "flex",
            }}
          >
            <div className="flex flex-col gap-3" style={{ flex: 1 }}>
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    padding: "3px 10px",
                    background: "oklch(0.95 0.15 108 / 0.15)",
                    color: "oklch(0.95 0.15 108)",
                  }}
                >
                  Featured
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: CATEGORY_COLORS[featured.category] ?? "oklch(1 0 0 / 0.4)",
                  }}
                >
                  {featured.category}
                </span>
              </div>
              <h2
                className="group-hover:text-[oklch(0.95_0.15_108)] transition-colors"
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  fontWeight: 800,
                  color: "oklch(1 0 0 / 0.9)",
                  lineHeight: 1.25,
                }}
              >
                {featured.title}
              </h2>
              <p style={{ fontSize: "15px", color: "oklch(1 0 0 / 0.6)", lineHeight: 1.65 }}>
                {featured.description}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.4)" }}>
                  {featured.date}
                </span>
                <span style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.4)" }}>·</span>
                <span style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.4)" }}>
                  {featured.readTime}
                </span>
              </div>
            </div>
            <div
              className="shrink-0 flex items-center justify-center rounded-lg"
              style={{
                width: "180px",
                height: "120px",
                background: "oklch(0.95 0.15 108 / 0.08)",
                border: "1px solid oklch(0.95 0.15 108 / 0.15)",
                fontSize: "48px",
              }}
            >
              ⚙️
            </div>
          </Link>

          {/* Post grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 rounded-xl p-6 transition-colors"
                style={{
                  background: "oklch(0.27 0.008 106)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                  textDecoration: "none",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: CATEGORY_COLORS[post.category] ?? "oklch(1 0 0 / 0.4)",
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <h3
                  className="group-hover:text-[oklch(0.95_0.15_108)] transition-colors"
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "oklch(1 0 0 / 0.9)",
                    lineHeight: 1.4,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "oklch(1 0 0 / 0.55)",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {post.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.35)" }}>
                    {post.date}
                  </span>
                  <span style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.25)" }}>·</span>
                  <span style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.35)" }}>
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div
            className="mt-16 rounded-xl p-8 text-center"
            style={{
              background: "oklch(0.27 0.008 106)",
              border: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "oklch(1 0 0 / 0.9)",
                marginBottom: "8px",
              }}
            >
              Ready to automate your business?
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "oklch(1 0 0 / 0.55)",
                marginBottom: "20px",
              }}
            >
              Book a free scoping call and we&apos;ll map out your first automation.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "oklch(0.95 0.15 108)",
                color: "oklch(0.217 0.0038309 106.715)",
                fontSize: "15px",
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              Book a Call →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
