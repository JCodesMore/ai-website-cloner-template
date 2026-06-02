import Link from "next/link";
import { getAllComments } from "@/lib/repository";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import { getPage, paginate, PAGE_SIZE } from "@/lib/filters";

interface Props {
  searchParams: Promise<{ m?: string; page?: string }>;
}

export default async function CommentsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mode = sp.m || "";

  const comments = await getAllComments();
  let filtered = comments;
  if (mode === "image") {
    filtered = comments.filter((c) => c.images && c.images.length > 0);
  } else if (mode === "hot") {
    filtered = [...comments].sort((a, b) => b.id - a.id);
  }

  const page = getPage(new URLSearchParams(sp.page ? { page: sp.page } : {}));
  const { items, currentPage, totalPages } = paginate(filtered, page, PAGE_SIZE);

  const tabs = [
    { label: "全部", href: "/comments", active: !mode },
    { label: "热门", href: "/comments?m=hot", active: mode === "hot" },
    { label: "有图", href: "/comments?m=image", active: mode === "image" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-base font-semibold text-slate-900">评论</h2>
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <Link key={tab.label} href={tab.href}
                    className={`rounded-md px-3 py-1 text-sm transition-colors duration-200 ${tab.active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-5">
              <p className="mb-5 text-sm text-slate-500">共 {filtered.length} 条评论</p>
              <div className="space-y-5">
                {items.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {comment.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-slate-900">{comment.author}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">评论</span>
                        {comment.productName && (
                          <a href={comment.productHref || "#"} target="_blank" className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-600 hover:underline">
                            {comment.productIcon && <img src={comment.productIcon} alt={comment.productName} className="h-3.5 w-3.5 rounded-full" />}
                            {comment.productName}
                          </a>
                        )}
                      </div>
                      <p className="mb-2 text-sm leading-relaxed text-slate-700">{comment.content}</p>
                      {comment.images && comment.images.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {comment.images.map((img: string, i: number) => (
                            <img key={i} src={img} alt="" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>{comment.date}</span>
                        <a href="/login" className="hover:text-emerald-600 transition-colors duration-200">回复</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/comments${mode ? `?m=${mode}` : ""}`} />
                </div>
              )}
            </div>
          </div>
        </div>
        <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
      </div>
    </div>
  );
}
