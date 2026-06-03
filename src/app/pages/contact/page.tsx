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
          <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
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
                    <Link href={item.href} className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-200 ${item.active ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
                      <ChevronRight className="h-3.5 w-3.5" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">联系我们</h1>

            {/* QR + contact info */}
            <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6 md:grid-cols-[auto_1fr]">
              <img src="/images/zrb-wechat-qr.jpg" alt="微信二维码" className="w-40 rounded-lg" />
              <div className="space-y-3 text-base text-slate-700">
                <p className="text-slate-500">如有合作咨询、产品入驻、意见反馈等事宜，欢迎通过以下方式与我们取得联系：</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">客服邮箱</span>
                    <a href="mailto:service@yinmaiquan.com" className="text-emerald-600 hover:underline">service@yinmaiquan.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">公司地址</span>
                    <span>四川省内江市东兴区汉安大道万达广场</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">工作时间</span>
                    <span>周一至周五 9:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business + Complaints side by side */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">商务合作</h2>
                <div className="space-y-3 text-base leading-relaxed text-slate-700">
                  <p>欢迎合规金融机构在银脉圈平台展示贷款产品。</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>发送邮件至 <a href="mailto:business@yinmaiquan.com" className="text-emerald-600 hover:underline font-medium">business@yinmaiquan.com</a>，注明机构全称、联系人及合作意向；</li>
                    <li>我们将在 <strong>3 个工作日内</strong> 与您联系；</li>
                    <li>双方确认合作条款后，签署合作协议并安排产品上线。</li>
                  </ol>
                  <p className="text-sm text-slate-500">平台不向用户收取推荐费用，以中立第三方的身份为借贷双方搭建信息桥梁。</p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">投诉与建议</h2>
                <div className="space-y-3 text-base leading-relaxed text-slate-700">
                  <p>如您对平台服务有任何不满或建议：</p>
                  <p>投诉邮箱：<a href="mailto:service@yinmaiquan.com" className="text-emerald-600 hover:underline font-medium">service@yinmaiquan.com</a></p>
                  <p>我们承诺在 <strong>5 个工作日内</strong> 回复处理结果。</p>
                  <p className="text-sm text-slate-500">如对处理结果不满意，您可向平台所在地消费者协会或有关监管部门投诉。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
