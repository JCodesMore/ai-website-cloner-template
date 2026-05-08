import { DocCallout, DocInlineLink } from "@/components/proton/DocBlocks";
import { docMetadata } from "@/lib/page-meta";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { ROUTES } from "@/lib/site-routes";
import { syne } from "@/lib/proton-fonts";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = docMetadata(
  "Blog",
  "/blog",
  "Security guides, audits, and product deep dives.",
);

export default function BlogIndexPage() {
  const entries = Object.entries(BLOG_POSTS);
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20 xl:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgb(16_185_129/_0.06),transparent_75%)]"
      />

      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link
          href={ROUTES.home}
          className="group/back inline-flex items-center gap-1.5 font-medium text-zinc-400 transition-colors hover:text-emerald-300"
        >
          <ArrowLeft
            className="size-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5"
            strokeWidth={2.2}
          />
          Home
        </Link>
      </nav>

      <h1
        className={cn(
          syne.className,
          "text-4xl font-semibold tracking-tight text-zinc-50 sm:text-[40px]",
        )}
      >
        Blog
      </h1>
      <p className="mt-6 text-[17px] leading-relaxed text-zinc-400">
        Longer articles live on their own URLs inside this demo. Topics cover
        audits, open source, browser extensions, mobile privacy, and kill
        switch behaviour — all scoped to the VPN product line.
      </p>

      <DocCallout title="Editorial note">
        <p className="text-sm leading-relaxed">
          Replace or extend posts in{" "}
          <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-xs text-zinc-300">
            src/lib/blog-posts.ts
          </code>
          . For MDX later, swap the dynamic route to read from the filesystem.
        </p>
      </DocCallout>

      <ul className="mt-10 space-y-4">
        {entries.map(([slug, post]) => (
          <li key={slug}>
            <Link
              href={`${ROUTES.blog}/${slug}`}
              className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-white/[0.04]"
            >
              <h2 className="text-[17px] font-semibold text-zinc-50 transition-colors group-hover:text-emerald-300">
                {post.title}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
                {post.excerpt}
              </p>
              <span className="mt-3 inline-block text-[13px] font-medium text-emerald-400">
                Read article →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-zinc-500">
        More to explore:{" "}
        <DocInlineLink href={ROUTES.support}>Support</DocInlineLink>
        {" · "}
        <DocInlineLink href={ROUTES.features}>Features</DocInlineLink>
      </p>
    </div>
  );
}
