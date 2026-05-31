import Link from "next/link";
import type { NewsItem } from "@/types";

interface ArticleCardProps {
  article: NewsItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.href} className="article-row">
      {article.image && (
        <div className="article-thumb">
          <img src={article.image} alt={article.title} />
        </div>
      )}
      <div className="article-info">
        <div>
          <h3>{article.title}</h3>
          {article.description && (
            <p className="article-desc">{article.description}</p>
          )}
        </div>
        <div className="article-meta">
          {article.date && (
            <div className="article-date">
              <i className="layui-icon layui-icon-time" />
              {article.date}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
