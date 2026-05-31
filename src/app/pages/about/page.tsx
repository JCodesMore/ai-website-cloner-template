import Link from "next/link";

const sidebarItems = [
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/about", label: "关于我们", active: true },
];

export default function AboutPage() {
  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>关于我们</cite></a>
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
                <h1>关于我们</h1>
              </div>
              <div className="content-body layui-text">
                <div id="editor-container">
                  <p style={{ textAlign: "center" }}><img src="/images/products/58efa73697da.jpg" alt="" style={{ maxWidth: "100%" }} /></p>
                  <p><strong>关于我们</strong></p>
                  <p>比比信•贷款口碑-bbxin.com 作为专业的贷款产品口碑查询平台，找合适的贷款，上"比比信"，比比信•贷款口碑-bbxin.com，聚合贷款产品口碑信息，遵从金融本质，以数据为基石，专注于金融信贷产品口碑收录整合，用创新技术为用户提供信息服务，寻找信贷资金查"比比信•贷款口碑"，降低资金需求人的融资成本。并欢迎广大合规信贷产品入驻及展示，助力小微企业及个人，高效的寻求信贷资金支持，降低融资成本，用科技服务大众，促进金融服务效率的提升，践行普惠金融的使命。</p>
                  <p>以"让金融惠及各行各业"为愿景，秉持"诚信创造财富"的理念，持续致力于实现"让每个人都享有简单、公平的互联网金融服务"的使命，为有融资需求的中小微企业及个人，提供详实的互联网金融产品信息服务。公司的服务宗旨是："助力企业资金需求，降低企业融资成本，用服务创造价值。"</p>
                  <p>比比信•贷款口碑-bbxin.com 是国内专业的金融信息服务平台，平台汇聚全国各省市地区贷款产品，致力于用先进的互联网技术和金融创新应用，为有资金需求的企业和个人搭建一个高效精准的贷款产品方案查询渠道，为企业和个人提供一站式金融服务，实现合作共赢。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
