# BlogSection Specification

## Overview
- **Target file:** `src/components/BlogSection.tsx`
- **Interaction model:** static (hover image zoom)
- **Component type:** Server component

## Structure
Centered heading + 3 blog cards in a responsive grid.

```
<section class="relative py-[120px]">
  <div class="yo-container">
    <div class="text-center mb-16">
      <span class="yo-subtitle">Our Blog</span>
      <h2 class="yo-headline-split text-[48px] leading-none w-full sm:w-2/3 lg:w-[55%] xl:w-[45%] mx-auto mt-5">
        Unlock knowledge with <span class="light">every blog post</span>
      </h2>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
      for post in BLOG_POSTS:
        <article class="rounded-[10px] bg-white shadow-[0_8px_30px_rgba(223,3,3,0.10)] overflow-hidden group">
          // image
          <div class="relative overflow-hidden">
            <Image src={post.image} width={420} height={300} alt="" class="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          
          // body
          <div class="relative pt-10 pb-7 px-8 xl:px-10">
            // date pill (overlaps top-left of body)
            <div class="absolute -top-7 left-8 bg-primary text-white rounded-[10px] w-16 h-16 flex flex-col items-center justify-center font-extrabold">
              <span class="text-[26px] leading-none">{post.day}</span>
              <span class="text-xs uppercase mt-0.5">{post.month}</span>
            </div>
            <span class="block text-primary text-[12px] font-bold uppercase tracking-wider mb-3">{post.category}</span>
            <h3 class="text-2xl font-extrabold leading-tight">
              <a href="#" class="hover:text-primary transition-colors">{post.title}</a>
            </h3>
          </div>
          
          // footer
          <div class="border-t border-black/8 px-8 xl:px-10 py-4 flex items-center justify-between text-sm">
            <span class="flex items-center gap-2 font-bold">
              <UserIcon class="size-4" /><a href="#">{post.author}</a>
            </span>
            <span class="flex items-center gap-2 text-body">
              <CommentIcon class="size-4" />{String(post.comments).padStart(2, "0")}
            </span>
          </div>
        </article>
    </div>
  </div>
</section>
```

## Computed styles
- Card border-radius: 10px
- Card shadow: pinkish-primary tint, `0 8px 30px rgba(223,3,3,0.10)`
- Date pill: 64×64, red bg, white, 10px radius, large day number + 12px month label
- Category tag: 12px uppercase red, weight bold
- Title H3: 24px / 800 / line-height tight
- Image: 4:3 aspect, zoom on hover

## Data
Import: `BLOG_POSTS` from `@/lib/content`.
Icons: `UserIcon`, `CommentIcon` from `@/components/icons`.
