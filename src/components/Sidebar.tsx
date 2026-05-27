import Link from "next/link";
import type { NewsItem } from "@/types";

interface SidebarProps {
  newsItems: NewsItem[];
  discussionItems: NewsItem[];
}

export default function Sidebar({ newsItems, discussionItems }: SidebarProps) {
  return (
    <div>
      {/* Loan application form */}
      <form
        className="layui-form ley-radius"
        style={{
          backgroundColor: "#fff",
          padding: "24px 20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          border: "1px solid #f0f2f5",
          marginBottom: 24,
        }}
      >
        <div className="ley-form-container" style={{ padding: 0 }}>
          <div
            className="form-header"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#333",
              textAlign: "center",
              marginBottom: 20,
              position: "relative",
              padding: 0,
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 1,
                padding: "0 16px",
                background: "#fff",
              }}
            >
              我要贷款
            </span>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 1,
                background: "#eee",
                zIndex: 0,
              }}
            />
          </div>
          <div
            className="layui-form-item"
            style={{
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              className="layui-form-label"
              style={{
                padding: 0,
                width: "auto",
                textAlign: "left",
                fontSize: 14,
                color: "#555",
                lineHeight: 1,
              }}
            >
              贷款类型
            </label>
            <div
              className="layui-input-block"
              style={{
                marginLeft: 0,
                display: "flex",
                alignItems: "center",
                minHeight: "auto",
                gap: 12,
              }}
            >
              <label style={{ fontSize: 14, color: "#555", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <input type="radio" name="kind" value="company" /> 企业
              </label>
              <label style={{ fontSize: 14, color: "#555", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <input type="radio" name="kind" value="person" defaultChecked /> 个人
              </label>
            </div>
          </div>
          <div className="layui-form-item" style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="phone"
              required
              placeholder="请输入手机号"
              autoComplete="off"
              className="layui-input"
              style={{
                height: 44,
                borderRadius: 6,
                borderColor: "#e5e7eb",
                width: "100%",
                padding: "0 12px",
                fontSize: 14,
                border: "1px solid #e5e7eb",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div className="layui-form-item" style={{ marginBottom: 0 }}>
            <button
              type="submit"
              className="layui-btn layui-btn-fluid"
              style={{
                height: 44,
                lineHeight: "44px",
                borderRadius: 6,
                fontSize: 16,
                fontWeight: 500,
                background: "linear-gradient(135deg, #ff8c42, #ff5f16)",
                border: "none",
                color: "#fff",
                width: "100%",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              免费申请
            </button>
          </div>
        </div>
      </form>

      {/* Industry news */}
      <div className="layui-card" style={{ marginBottom: 24 }}>
        <div className="layui-card-header">
          <div className="title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 3, height: 16, background: "#ff5f16", borderRadius: 2 }} />
            行业资讯
          </div>
          <Link href="/cates/91/articles" className="more" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>
            更多 <span style={{ fontSize: 12 }}>&gt;</span>
          </Link>
        </div>
        <div className="layui-card-body">
          <ul className="news" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {newsItems.map((item) => (
              <li key={item.id} className="item ellipsis" style={{ position: "relative", paddingLeft: 12 }}>
                <span style={{ position: "absolute", left: 0, top: 10, width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
                <Link
                  href={item.href}
                  target="_blank"
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    textDecoration: "none",
                    display: "block",
                    lineHeight: 1.6,
                    transition: "all 0.2s ease",
                  }}
                  className="sidebar-news-link"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Discussion */}
      <div className="layui-card" style={{ marginBottom: 24 }}>
        <div className="layui-card-header">
          <div className="title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 3, height: 16, background: "#ff5f16", borderRadius: 2 }} />
            贷款交流
          </div>
          <Link href="/cates/14/articles" className="more" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>
            更多 <span style={{ fontSize: 12 }}>&gt;</span>
          </Link>
        </div>
        <div className="layui-card-body">
          <ul className="news" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {discussionItems.map((item) => (
              <li key={item.id} className="item ellipsis" style={{ position: "relative", paddingLeft: 12 }}>
                <span style={{ position: "absolute", left: 0, top: 10, width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
                <Link
                  href={item.href}
                  target="_blank"
                  style={{
                    fontSize: 14,
                    color: "#4b5563",
                    textDecoration: "none",
                    display: "block",
                    lineHeight: 1.6,
                    transition: "all 0.2s ease",
                  }}
                  className="sidebar-news-link"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
