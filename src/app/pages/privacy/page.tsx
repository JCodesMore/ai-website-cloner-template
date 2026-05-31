import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  { href: "/pages/about", label: "关于我们" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/privacy", label: "隐私保护", active: true },
  { href: "/pages/agreement", label: "使用协议" },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>隐私保护</span>
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
            <h1 className="mb-6 text-2xl font-bold text-slate-900">隐私保护</h1>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              <p><strong>隐私保护</strong></p>
              <p>银脉圈尊重并保护用户个人隐私权。本隐私保护政策构成银脉圈用户服务协议的一部分。</p>
              <p><strong>信息收集：</strong>您在注册、使用银脉圈服务时，我们可能收集您的姓名、手机号码、电子邮箱等个人信息，仅用于为您提供贷款产品推荐和资讯服务。</p>
              <p><strong>信息使用：</strong>银脉圈承诺不会将您的个人信息出售或出租给第三方。我们仅在以下情形使用您的信息：为您提供所需的服务、改善用户体验、履行法律义务。</p>
              <p><strong>信息安全：</strong>我们采用业界通用的安全技术和内部管理制度保护您的个人信息，防止未经授权的访问、使用或泄露。</p>
              <p><strong>免责情形：</strong>在以下情况下，银脉圈不承担隐私泄露责任：</p>
              <ul>
                <li>不可抗力事件导致的泄露；</li>
                <li>您主动向第三方透露个人信息；</li>
                <li>因您自身原因导致账号密码泄露；</li>
                <li>黑客攻击、病毒等非本平台可控的技术因素。</li>
              </ul>
              <p><strong>政策更新：</strong>银脉圈有权适时修订本隐私保护政策，修订后的政策将在官网公布后生效。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
