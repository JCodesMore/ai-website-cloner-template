import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  { href: "/pages/about", label: "关于我们" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/statement", label: "免责声明", active: true },
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议" },
];

export default function StatementPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>免责声明</span>
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
            <h1 className="mb-6 text-2xl font-bold text-slate-900">免责声明</h1>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              <p><strong>免责声明</strong></p>
              <p>本网站在此特别声明对如下事宜不承担任何法律责任：</p>
              <p>1）本平台所展示的贷款产品信息均由合作金融机构提供或来源于公开渠道，我们不对其准确性、完整性和时效性作出任何明示或默示的保证。用户在申请贷款前应自行核实产品条款。</p>
              <p>2）本平台仅为信息展示与口碑查询平台，不直接提供贷款服务，不参与用户与金融机构之间的借贷行为。用户与金融机构之间发生的任何纠纷，本平台不承担法律责任。</p>
              <p>3）用户的个人资质、征信状况等将直接影响贷款审批结果，本平台不对用户的贷款获批作出任何承诺。</p>
              <p>4）本平台已采取合理的技术手段保障信息安全，但对于因不可抗力、黑客攻击、病毒等非本平台可控因素导致的信息泄露，本平台不承担责任。</p>
              <p>5）本网站有权在不事先通知的情况下修改、暂停或终止部分或全部服务内容。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
