import Link from "next/link";
import type { NewsItem } from "@/types";
import { ChevronRight } from "lucide-react";
import LoanForm from "./LoanForm";

interface SidebarProps {
  newsItems: NewsItem[];
  discussionItems: NewsItem[];
  opinionItems: NewsItem[];
  faqItems: NewsItem[];
}

function SideCard({
  title,
  moreHref,
  color,
  items,
}: {
  title: string;
  moreHref: string;
  color: "blue" | "emerald";
  items: NewsItem[];
}) {
  const accent = color === "blue" ? "bg-slate-900" : "bg-emerald-600";
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className={`block h-4 w-1 rounded-full ${accent}`} />
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>
        <Link
          href={moreHref}
          className="flex items-center gap-0.5 text-xs text-slate-400 transition-colors duration-200 hover:text-blue-600"
        >
          更多 <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="px-5 py-3">
        <ul className="space-y-3.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
              <Link
                href={item.href}
                target="_blank"
                className="text-sm leading-relaxed text-slate-600 transition-colors duration-200 hover:text-blue-600"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Sidebar({ newsItems, discussionItems, opinionItems, faqItems }: SidebarProps) {
  return (
    <aside className="space-y-5">
      <LoanForm />

      {/* Industry News */}
      <SideCard title="行业资讯" moreHref="/cates/91/articles" color="blue" items={newsItems} />

      {/* Discussion */}
      <SideCard title="贷款交流" moreHref="/cates/14/articles" color="emerald" items={discussionItems} />

      {/* Public Opinion */}
      <SideCard title="贷款舆情" moreHref="/cates/80/articles" color="blue" items={opinionItems} />

      {/* FAQ */}
      <SideCard title="常见问题" moreHref="/cates/1/articles" color="emerald" items={faqItems} />
    </aside>
  );
}
