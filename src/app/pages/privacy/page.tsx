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
          <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
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
                    <Link href={item.href} className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${item.active ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                      <ChevronRight className="h-3.5 w-3.5" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="mb-6 text-2xl font-bold text-slate-900">隐私保护</h1>
            <div className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700">
              <p>银脉圈（yinmaiquan.com）尊重并保护用户个人隐私权。本隐私政策依据《中华人民共和国个人信息保护法》（PIPL）、《中华人民共和国网络安全法》制定，构成银脉圈用户服务协议的一部分。请您仔细阅读。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">一、信息收集</h2>
              <p>您在注册、使用银脉圈服务时，我们可能收集以下信息：</p>
              <ul>
                <li><strong>必要信息：</strong>手机号码、姓名，用于为您提供贷款产品推荐和资讯服务；</li>
                <li><strong>选填信息：</strong>贷款用途、所在城市，用于优化产品匹配精准度；</li>
                <li><strong>自动采集：</strong>设备信息、IP 地址、浏览记录，用于改善用户体验和安全防护。</li>
              </ul>
              <p>我们遵循最小必要原则，仅收集实现服务功能所必需的个人信息，并在收集前取得您的明确同意。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">二、信息使用</h2>
              <p>银脉圈承诺不会将您的个人信息出售或出租给第三方。我们仅在以下情形使用您的信息：</p>
              <ul>
                <li>为您提供贷款产品推荐和金融资讯服务；</li>
                <li>在您明确授权的前提下，将相关信息提供给您选择的合作金融机构；</li>
                <li>改善用户体验、优化产品推荐算法；</li>
                <li>履行法律义务、配合监管要求。</li>
              </ul>
              <p>如需委托第三方处理您的个人信息，我们将与受托方签订保密协议，并对其数据处理活动进行监督。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">三、用户权利</h2>
              <p>根据《中华人民共和国个人信息保护法》，您享有以下权利：</p>
              <ul>
                <li><strong>查阅权：</strong>您可以随时查阅我们收集的您的个人信息；</li>
                <li><strong>更正权：</strong>您可以在发现信息不准确时要求更正；</li>
                <li><strong>删除权：</strong>在法定情形下，您可以要求删除您的个人信息；</li>
                <li><strong>撤回同意权：</strong>您可以随时撤回对个人信息收集和使用的同意；</li>
                <li><strong>注销账户：</strong>您可以选择注销账户，我们将依法删除您的个人信息。</li>
              </ul>
              <p>行使上述权利，请通过本政策第九章所列联系方式与我们联系。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">四、信息存储</h2>
              <p>您的个人信息存储于中华人民共和国境内服务器。我们将在实现服务目的所必需的最短期限内保留您的个人信息，法律另有规定的除外。服务关系终止或您注销账户后，我们将依法在合理期限内删除或匿名化处理您的个人信息。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">五、信息安全</h2>
              <p>我们采用业界通用的安全技术（SSL 加密传输、数据库加密存储、访问权限控制）和内部管理制度保护您的个人信息。若发生个人信息泄露事件，我们将依法立即启动应急预案，并在 72 小时内向主管部门报告，同时以合理方式通知您。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">六、Cookie 及同类技术</h2>
              <p>本网站使用 Cookie 及类似技术以改善您的浏览体验、分析网站流量。您可以随时通过浏览器设置禁用 Cookie，但这可能影响部分功能的正常使用。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">七、未成年人保护</h2>
              <p>根据《中华人民共和国未成年人保护法》，本平台仅向年满 18 周岁的用户提供服务。我们不会主动收集未成年人的个人信息。如发现误收集，请立即联系我们，我们将及时删除。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">八、政策更新</h2>
              <p>我们可能适时修订本隐私政策。发生重大变更时，我们将通过网站公告、弹窗提示等显著方式通知您。修订后的政策自公布之日起生效。</p>

              <h2 className="mt-6 mb-3 text-lg font-semibold text-slate-900">九、联系方式</h2>
              <p>如您对本隐私政策有任何疑问，或需行使您的个人信息权利，请联系：</p>
              <p>联系邮箱：service@yinmaiquan.com</p>
              <p>联系地址：四川省内江市东兴区汉安大道万达广场</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
