import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  { href: "/pages/about", label: "关于我们" },
  { href: "/pages/contact", label: "联系我们", active: true },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
];

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>联系我们</span>
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
                    <Link href={item.href} className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${item.active ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                      <ChevronRight className="h-3.5 w-3.5" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">联系我们</h1>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              <p><strong>联系我们</strong></p>
              <p className="text-center"><img src="/images/products/064f3bc8e841.png" alt="" className="mx-auto max-w-full rounded-lg" /></p>
              <p>如有合作咨询、产品入驻、意见反馈等事宜，欢迎通过以下方式与我们取得联系：</p>
              <p>客服邮箱：service@yinmaiquan.com</p>
              <p>合作邮箱：business@yinmaiquan.com</p>
              <p>公司地址：四川省内江市东兴区汉安大道万达广场</p>
              <p>工作时间：周一至周五 9:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
