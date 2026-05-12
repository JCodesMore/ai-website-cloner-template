import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentIcon, UserIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { BLOG_LIST } from "@/lib/pages-content";

export function generateStaticParams() {
  return BLOG_LIST.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_LIST.find((p) => p.slug === slug);
  return { title: post ? `${post.title} — VertexLink Blog` : "Blog — VertexLink" };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_LIST.find((p) => p.slug === slug);
  if (!post) notFound();
  const recent = BLOG_LIST.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero
        title="Blog Details"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title.slice(0, 32) + (post.title.length > 32 ? "…" : "") },
        ]}
      />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="grid lg:grid-cols-12 gap-12">
            <article className="lg:col-span-8">
              <Image
                src={post.image}
                alt=""
                width={1200}
                height={700}
                className="w-full rounded-[10px] mb-8"
              />
              <div className="flex flex-wrap items-center gap-5 mb-4 text-sm">
                <span className="text-primary font-bold uppercase tracking-wider">{post.category}</span>
                <span className="flex items-center gap-2 text-body font-bold">
                  <UserIcon className="size-4" /> {post.author}
                </span>
                <span className="flex items-center gap-2 text-body">
                  <CommentIcon className="size-4" /> {post.comments} comments
                </span>
                <span className="text-body">{post.day} {post.month}, 2025</span>
              </div>
              <h1 className="yo-headline-split text-[32px] md:text-[40px] leading-tight mb-6">
                {post.title}
              </h1>
              <p className="text-body mb-5 leading-[1.8]">{post.excerpt}</p>
              <p className="text-body mb-5 leading-[1.8]">
                The VertexLink engineering team spent the last quarter tightening up the parts of the
                stack that most affect this. We measured, we tuned, we pushed updates over the air
                — and customers tell us the difference is immediate.
              </p>
              <blockquote className="my-8 p-6 bg-light rounded-[10px] border-l-4 border-primary italic text-foreground">
                &ldquo;Reliable internet should feel invisible. Our job is to keep it that way — no
                matter what the rest of the world throws at the pipe.&rdquo;
              </blockquote>
              <p className="text-body mb-5 leading-[1.8]">
                If you have feedback or a story to share, drop us a line via{" "}
                <Link href="/contact" className="text-primary font-bold hover:underline">
                  the contact page
                </Link>{" "}
                — we read everything.
              </p>
            </article>

            <aside className="lg:col-span-4">
              <div className="bg-light rounded-[10px] p-6 mb-8">
                <h4 className="text-xl font-extrabold mb-5 flex items-center gap-2">
                  <span className="text-primary">|</span>Recent Posts
                </h4>
                <ul className="space-y-5">
                  {recent.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/blog/${p.slug}`} className="flex gap-3 group">
                        <Image
                          src={p.image}
                          alt=""
                          width={80}
                          height={80}
                          className="size-20 rounded-md object-cover shrink-0"
                        />
                        <div>
                          <span className="text-xs text-primary font-bold uppercase tracking-wider">
                            {p.day} {p.month}
                          </span>
                          <h5 className="font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {p.title}
                          </h5>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-secondary text-white rounded-[10px] p-8 text-center">
                <h4 className="text-xl font-extrabold mb-2">Need internet that just works?</h4>
                <p className="text-white/80 text-sm mb-5">
                  Check coverage for your address in 30 seconds.
                </p>
                <Link href="/contact" className="yo-btn yo-btn-primary">
                  Get a quote
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
