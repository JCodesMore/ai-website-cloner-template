import Link from "next/link";
import type { NewsItem } from "@/types";
import { Clock } from "lucide-react";

function formatDate(dateStr: string): string {
  return dateStr.split(" ")[0];
}

interface ArticleCardProps {
  article: NewsItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.href} className="group flex gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md cursor-pointer">
      {article.image && (
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-yellow-600 transition-colors duration-200">{article.title}</h3>
          {article.description && <p className="line-clamp-1 text-sm text-slate-500">{article.description}</p>}
        </div>
        {article.date && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {formatDate(article.date)}
          </div>
        )}
      </div>
    </Link>
  );
}
