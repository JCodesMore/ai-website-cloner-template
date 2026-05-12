import Image from "next/image";
import { BLOG_POSTS } from "@/lib/content";
import { CommentIcon, UserIcon } from "@/components/icons";

export function BlogSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="yo-container">
        <div className="text-center mb-16">
          <span className="yo-subtitle">Our Blog</span>
          <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none w-full sm:w-2/3 lg:w-[55%] xl:w-[45%] mx-auto mt-5">
            Unlock knowledge with <span className="light">every blog post</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.title}
              className="rounded-[10px] bg-white shadow-[0_10px_30px_rgba(223,3,3,0.10)] overflow-hidden group flex flex-col"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image}
                  alt=""
                  width={420}
                  height={300}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative pt-10 pb-7 px-7 xl:px-9 flex-1">
                <div className="absolute -top-7 left-7 w-16 h-16 bg-primary text-white rounded-[10px] flex flex-col items-center justify-center font-extrabold shadow-md">
                  <span className="text-[26px] leading-none">{post.day}</span>
                  <span className="text-xs uppercase mt-0.5 tracking-wide">{post.month}</span>
                </div>
                <span className="block text-primary text-xs font-bold uppercase tracking-wider mb-3">
                  <a href="#">{post.category}</a>
                </span>
                <h3 className="text-xl xl:text-2xl font-extrabold leading-tight">
                  <a href="#" className="hover:text-primary transition-colors">
                    {post.title}
                  </a>
                </h3>
              </div>

              <div className="border-t border-black/[0.08] px-7 xl:px-9 py-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-bold">
                  <UserIcon className="size-4" />
                  <a href="#" className="hover:text-primary transition-colors">
                    {post.author}
                  </a>
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
  );
}
