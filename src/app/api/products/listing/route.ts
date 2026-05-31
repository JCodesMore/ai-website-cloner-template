import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import { paginate, PAGE_SIZE, getPage, filterByIk, filterByAdv, filterByTag } from "@/lib/filters";
import categoryProducts from "@/data/category-products.json";

// Build a Set of product IDs for each category from the target site's actual listing
const categoryIdSets: Record<string, Set<number>> = {};
for (const [cat, data] of Object.entries(categoryProducts.categories)) {
  categoryIdSets[cat] = new Set((data as { total: number; ids: number[] }).ids);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "fast";
  const page = getPage(url.searchParams);
  const ik = url.searchParams.get("ik") || "";
  const tag = url.searchParams.get("tag") || "";
  const adv = url.searchParams.get("adv") || "";

  const [allProducts, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getAllProducts(),
    getSidebarNews(),
    getSidebarDiscussions(),
    getSidebarOpinions(),
    getSidebarFaq(),
  ]);

  // Filter to products that appear on this category's page on the target site
  const catIds = categoryIdSets[category];
  const catProducts = catIds
    ? allProducts.filter((p) => catIds.has(p.id))
    : allProducts;

  // Apply ik/tag/adv filters
  let filtered = catProducts;
  if (ik) filtered = filterByIk(filtered as any, ik);
  if (tag) filtered = filterByTag(filtered as any, tag);
  if (adv) filtered = filterByAdv(filtered as any, adv, category);

  const { items, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  return NextResponse.json(
    {
      items,
      currentPage,
      totalPages,
      total,
      sidebar: { newsItems, discussionItems, opinionItems, faqItems },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
