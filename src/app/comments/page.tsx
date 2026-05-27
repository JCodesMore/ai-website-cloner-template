import { comments, newsItems, discussionItems } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";
import { getPage, paginate, PAGE_SIZE } from "@/lib/filters";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ m?: string; page?: string }>;
}

export default async function CommentsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const mode = sp.m || "";

  let filtered = comments;
  if (mode === "image") {
    filtered = comments.filter((c) => c.images && c.images.length > 0);
  } else if (mode === "hot") {
    filtered = [...comments].sort(() => Math.random() - 0.5);
  }

  const page = getPage(new URLSearchParams(sp.page ? { page: sp.page } : {}));
  const { items, currentPage, totalPages } = paginate(filtered, page, PAGE_SIZE);

  const tabs = [
    { label: "全部", href: "/comments", active: !mode },
    { label: "热门", href: "/comments?m=hot", active: mode === "hot" },
    { label: "有图", href: "/comments?m=image", active: mode === "image" },
  ];

  return (
    <div className="comments-page-wrapper">
    <div className="ley-inner">
      <div className="layui-row layui-col-space16">
        <div className="layui-col-md9">
          <div className="layui-card ley-radius">
            <div className="layui-card-header">
              评论
              <span className="comment-tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    className={tab.active ? "is-active" : ""}
                  >
                    {tab.label}
                  </Link>
                ))}
              </span>
            </div>
            <div className="layui-card-body">
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                共 {filtered.length} 条评论
              </p>
              <div className="comment-square">
                {items.map((comment) => (
                  <div key={comment.id} className="comment-square-item">
                    <div className="avatar">
                      <span className="avatar-image">{comment.initial}</span>
                    </div>
                    <div className="head-main">
                      <div className="user-info">
                        <div className="name">{comment.author}</div>
                        <span className="comment-action-badge">评论</span>
                        {comment.productName && (
                          <a
                            href={comment.productHref || "#"}
                            target="_blank"
                            className="comment-product-link"
                          >
                            {comment.productIcon && (
                              <img
                                src={comment.productIcon}
                                alt={comment.productName}
                                className="comment-product-icon"
                              />
                            )}
                            {comment.productName}
                          </a>
                        )}
                      </div>
                      <div className="content">{comment.content}</div>
                      {comment.images && comment.images.length > 0 && (
                        <div className="comment-images">
                          {comment.images.map((img: string, i: number) => (
                            <img key={i} src={img} alt="" />
                          ))}
                        </div>
                      )}
                      <div className="comment-footer">
                        <div className="time">{comment.date}</div>
                        <div className="comment-actions">
                          <a href="/login" className="action-item">
                            <i className="layui-icon layui-icon-dialogue"></i> 回复
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ marginTop: 24 }}>
                  <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/comments${mode ? `?m=${mode}` : ""}`} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="layui-col-md3">
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
        </div>
      </div>
    </div>
    </div>
  );
}
