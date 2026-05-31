import Link from "next/link";
import { ChevronRight } from "lucide-react";

const sidebarItems = [
  { href: "/pages/about", label: "关于我们" },
  { href: "/pages/contact", label: "联系我们" },
  { href: "/pages/statement", label: "免责声明" },
  { href: "/pages/privacy", label: "隐私保护" },
  { href: "/pages/agreement", label: "使用协议", active: true },
];

export default function AgreementPage() {
  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>使用协议</span>
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
            <h1 className="mb-6 text-2xl font-bold text-slate-900">使用协议</h1>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700">
              <p><strong>使用协议</strong></p>
              <p>欢迎使用银脉圈（yinmaiquan.com）。本协议是您与内江银脉圈企业管理咨询有限公司之间关于使用银脉圈服务的有效协议。</p>
              <p><strong>1、声明与承诺</strong></p>
              <p>银脉圈网站的所有权和运作权归内江银脉圈企业管理咨询有限公司所有。用户接受并使用本平台服务，即视为已完整阅读、理解并同意本协议的全部内容。</p>
              <p><strong>2、服务内容</strong></p>
              <p>银脉圈向用户提供贷款产品口碑查询、产品信息比较、信贷资讯浏览及用户评论发布等服务。</p>
              <p><strong>3、服务条款变更</strong></p>
              <p>银脉圈有权依据法律法规及运营需要对本协议进行修订，并在官网予以公告。如您继续使用本平台服务，视为接受修订后的协议。</p>
              <p><strong>4、账户安全</strong></p>
              <p>您应妥善保管账号及密码信息，因您自身原因导致的账户被盗用或信息泄露，银脉圈不承担责任。</p>
              <p><strong>5、用户信息保护</strong></p>
              <p>详见<a href="/pages/privacy" className="text-blue-600 hover:underline">《银脉圈隐私保护》</a>。</p>
              <p><strong>6、知识产权</strong></p>
              <p>银脉圈所有内容（包括但不限于文字、图片、设计、程序）的知识产权归内江银脉圈企业管理咨询有限公司所有，未经许可不得转载或用于商业用途。</p>
              <p><strong>7、法律适用</strong></p>
              <p>本协议的订立、执行和解释适用中华人民共和国法律。银脉圈保留本协议的最终解释权。</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
