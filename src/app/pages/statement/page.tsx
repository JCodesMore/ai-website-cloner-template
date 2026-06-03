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
          <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
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
                    <Link href={item.href} className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${item.active ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                      <ChevronRight className="h-3.5 w-3.5" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">免责声明</h1>
            <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700">
              <p>本网站在此特别声明对如下事宜不承担任何法律责任：</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">非金融机构声明</h2>
              <p>银脉圈（yinmaiquan.com）为第三方贷款信息展示与口碑查询平台，并非金融机构，不直接提供贷款服务，不参与用户与金融机构之间的借贷行为。用户与金融机构之间的任何纠纷，本平台不承担法律责任。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">金融营销合规提示</h2>
              <p>本平台展示的贷款产品信息仅供用户参考，不构成任何贷款建议或贷款承诺。贷款利率、额度、期限等以金融机构实际审批结果为准。用户在申请贷款前应仔细阅读金融机构提供的产品条款及相关协议。贷款有风险，申请需谨慎，请根据自身还款能力合理借贷，避免逾期影响个人征信。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">免责条款</h2>
              <ol>
                <li>本平台所展示的贷款产品信息均由合作金融机构提供或来源于公开渠道，我们不对其准确性、完整性和时效性作出任何明示或默示的保证。用户在申请贷款前应自行核实产品条款。</li>
                <li>本平台仅为信息展示与口碑查询平台，不直接提供贷款服务，不参与用户与金融机构之间的借贷行为。用户与金融机构之间发生的任何纠纷，本平台不承担法律责任。</li>
                <li>用户的个人资质、征信状况等将直接影响贷款审批结果，本平台不对用户的贷款获批作出任何承诺。</li>
                <li>本平台已采取合理的技术手段保障信息安全，但对于因不可抗力、黑客攻击、病毒等非本平台可控因素导致的信息泄露，本平台不承担责任。</li>
                <li>本网站有权在不事先通知的情况下修改、暂停或终止部分或全部服务内容。</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
