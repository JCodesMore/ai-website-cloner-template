import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  { href: "/pages/about", label: "关于我们", active: true },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
];

export default function AboutPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>关于我们</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          <aside>
            <nav className="rounded-lg border border-slate-200 bg-white">
              <h3 className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">相关页面</h3>
              <ul>
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${
                        item.active
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">关于我们</h1>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              <p className="text-center"><img src="/images/products/58efa73697da.jpg" alt="" className="mx-auto max-w-full rounded-lg" /></p>
              <p><strong>关于我们</strong></p>
              <p>银脉圈（yinmaiquan.com）是国内领先的贷款产品口碑查询与智能推荐平台。我们聚合全网信贷产品信息，通过用户真实评价和数据分析，帮助每一位借款人找到最适合自己的融资方案。</p>
              <p>银脉圈由内江银脉圈企业管理咨询有限公司运营，核心团队深耕金融信息服务领域多年，致力于用互联网技术打破信贷信息不对称，让贷款选择更加透明、高效、个性化。</p>
              <p>我们的使命：让每个人都能根据自身条件，在万千产品中精准找到对的贷款，省时、省心、省成本。</p>
              <p>我们的定位：不隶属于任何金融机构，不向用户收取推荐费用，以中立第三方的身份为借贷双方搭建信息桥梁。平台通过严格的产品筛选机制和用户口碑反馈体系，帮助优质信贷产品脱颖而出，也帮助用户规避劣质产品风险。</p>
              <p>我们欢迎合规金融机构入驻展示产品，共同推动普惠金融发展，让更多人享受到公平、便捷的信贷服务。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
