import Image from "next/image";
import Link from "next/link";
import { CommentIcon, UserIcon } from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { BLOG_LIST } from "@/lib/pages-content";

export const metadata = { title: "Blog — VertexLink" };

export default function BlogPage() {
  return (
    <>
      <PageHero title="Our Blog" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {BLOG_LIST.map((post) => (
              <article
                key={post.slug}
                className="rounded-[10px] bg-white shadow-[0_10px_30px_rgba(223,3,3,0.10)] overflow-hidden group flex flex-col"
              >
                <Link href={`/blog/${post.slug}`} className="relative block overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    width={420}
                    height={300}
                    className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="relative pt-10 pb-7 px-7 xl:px-9 flex-1">
                  <div className="absolute -top-7 left-7 w-16 h-16 bg-primary text-white rounded-[10px] flex flex-col items-center justify-center font-extrabold shadow-md">
                    <span className="text-[26px] leading-none">{post.day}</span>
                    <span className="text-xs uppercase mt-0.5 tracking-wide">{post.month}</span>
                  </div>
                  <span className="block text-primary text-xs font-bold uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-extrabold leading-tight mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-body text-sm leading-[1.7]">{post.excerpt}</p>
                </div>

                <div className="border-t border-black/[0.08] px-7 xl:px-9 py-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold">
                    <UserIcon className="size-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2 text-body">
                    <CommentIcon className="size-4" />
                    {String(post.comments).padStart(2, "0")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
