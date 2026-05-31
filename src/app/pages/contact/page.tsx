import Link from "next/link";

const sidebarItems = [
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/contact", label: "联系我们", active: true },
  { href: "/pages/about", label: "关于我们" },
];

export default function ContactPage() {
  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>联系我们</cite></a>
          </span>
        </div>
      </div>
      <div className="ley-page ley-page-about-us">
        <div className="ley-inner">
          <div className="page-container">
            <div className="page-sidebar">
              <div className="sidebar-title">相关页面</div>
              <ul className="sidebar-menu">
                {sidebarItems.map((item) => (
                  <li key={item.href} className={`sidebar-menu-item${item.active ? " active" : ""}`}>
                    <Link href={item.href}>
                      <i className="layui-icon layui-icon-right"></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="page-content">
              <div className="content-header">
                <h1>联系我们</h1>
              </div>
              <div className="content-body layui-text">
                <div id="editor-container">
                  <p><strong>联系我们</strong></p>
                  <p><img src="/images/products/064f3bc8e841.png" alt="" style={{ maxWidth: "100%" }} /></p>
                  <p>微信客服：188 01134 188</p>
                  <p>全国热线：010-5621 5857</p>
                  <p>公司邮箱：service@bbxin.com</p>
                  <p>联系地址：北京市朝阳区未来时大厦</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
