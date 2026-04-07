import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  "Case Study": "oklch(0.95 0.15 108)",
  Guide: "oklch(0.567 0.15 248)",
  "Deep Dive": "oklch(0.75 0.12 280)",
  Beginner: "oklch(0.7 0.12 160)",
  Comparison: "oklch(0.75 0.15 60)",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const postIndex = POSTS.findIndex((p) => p.slug === slug);
  const prev = POSTS[postIndex + 1] ?? null;
  const next = POSTS[postIndex - 1] ?? null;

  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main className="flex grow flex-col">
        <article className="mx-auto w-full max-w-2xl px-6 py-20 md:py-28">
          {/* Back */}
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "oklch(1 0 0 / 0.45)",
              textDecoration: "none",
              marginBottom: "32px",
            }}
            className="hover:text-white transition-colors"
          >
            ← All posts
          </Link>

          {/* Meta */}
          <div className="mb-4 flex items-center gap-3">
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: CATEGORY_COLORS[post.category] ?? "oklch(1 0 0 / 0.4)",
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: "11px", color: "oklch(1 0 0 / 0.25)" }}>·</span>
            <span style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.4)" }}>{post.date}</span>
            <span style={{ fontSize: "11px", color: "oklch(1 0 0 / 0.25)" }}>·</span>
            <span style={{ fontSize: "12px", color: "oklch(1 0 0 / 0.4)" }}>{post.readTime}</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 800,
              color: "oklch(1 0 0 / 0.9)",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "oklch(1 0 0 / 0.55)",
              lineHeight: 1.65,
              marginBottom: "40px",
              paddingBottom: "40px",
              borderBottom: "1px solid oklch(1 0 0 / 0.08)",
            }}
          >
            {post.description}
          </p>

          {/* Content */}
          <div className="flex flex-col gap-0">
            {post.content.map((block, i) => {
              if (block.type === "body") {
                return (
                  <p
                    key={i}
                    style={{
                      fontSize: "16px",
                      color: "oklch(1 0 0 / 0.7)",
                      lineHeight: 1.8,
                      marginBottom: "20px",
                    }}
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: "oklch(1 0 0 / 0.9)",
                      marginTop: "40px",
                      marginBottom: "14px",
                      paddingBottom: "10px",
                      borderBottom: "1px solid oklch(1 0 0 / 0.07)",
                    }}
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3
                    key={i}
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "oklch(1 0 0 / 0.9)",
                      marginTop: "28px",
                      marginBottom: "10px",
                    }}
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "callout") {
                const s = {
                  tip: { bg: "oklch(0.95 0.15 108 / 0.06)", border: "oklch(0.95 0.15 108)", label: "Tip", color: "oklch(0.95 0.15 108)" },
                  info: { bg: "oklch(0.567 0.15 248 / 0.07)", border: "oklch(0.567 0.15 248)", label: "Note", color: "oklch(0.567 0.15 248)" },
                  warning: { bg: "oklch(0.75 0.15 60 / 0.07)", border: "oklch(0.75 0.15 60)", label: "Warning", color: "oklch(0.75 0.15 60)" },
                }[block.variant];
                return (
                  <div
                    key={i}
                    className="my-5 rounded-lg p-4"
                    style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: s.color,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      {s.label}
                    </span>
                    <p style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.7)", lineHeight: 1.65, margin: 0 }}>
                      {block.text}
                    </p>
                  </div>
                );
              }
              if (block.type === "code") {
                return (
                  <div
                    key={i}
                    className="my-5 rounded-lg"
                    style={{ background: "oklch(0.18 0.004 106)", border: "1px solid oklch(1 0 0 / 0.08)" }}
                  >
                    <pre
                      style={{
                        padding: "16px 20px",
                        fontSize: "13px",
                        color: "oklch(1 0 0 / 0.75)",
                        overflowX: "auto",
                        margin: 0,
                        lineHeight: 1.65,
                      }}
                    >
                      <code>{block.text}</code>
                    </pre>
                  </div>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} style={{ paddingLeft: "20px", marginBottom: "20px" }}>
                    {block.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "15px",
                          color: "oklch(1 0 0 / 0.65)",
                          lineHeight: 1.9,
                          paddingLeft: "4px",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>

          {/* CTA */}
          <div
            className="mt-12 rounded-xl p-7 text-center"
            style={{
              background: "oklch(0.27 0.008 106)",
              border: "1px solid oklch(0.95 0.15 108 / 0.25)",
            }}
          >
            <p style={{ fontSize: "17px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", marginBottom: "6px" }}>
              Want this built for your business?
            </p>
            <p style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.55)", marginBottom: "18px" }}>
              Book a free scoping call and we&apos;ll map out your automation.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "oklch(0.95 0.15 108)",
                color: "oklch(0.217 0.0038309 106.715)",
                fontSize: "14px",
                fontWeight: 700,
                padding: "11px 24px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              Book a Call →
            </Link>
          </div>

          {/* Prev / Next */}
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:justify-between">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                style={{ textDecoration: "none", flex: 1 }}
              >
                <div
                  className="rounded-lg p-5 h-full transition-colors"
                  style={{
                    background: "oklch(0.27 0.008 106)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "oklch(1 0 0 / 0.35)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    ← Older
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "oklch(1 0 0 / 0.75)", lineHeight: 1.4 }}>
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                style={{ textDecoration: "none", flex: 1 }}
              >
                <div
                  className="rounded-lg p-5 h-full transition-colors text-right"
                  style={{
                    background: "oklch(0.27 0.008 106)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <p style={{ fontSize: "11px", color: "oklch(1 0 0 / 0.35)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Newer →
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "oklch(1 0 0 / 0.75)", lineHeight: 1.4 }}>
                    {next.title}
                  </p>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
