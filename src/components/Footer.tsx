"use client";

import Link from "next/link";

const footerLinks = [
  { label: "关于我们", href: "/pages/about" },
  { label: "联系我们", href: "/pages/contact" },
  { label: "免责声明", href: "/pages/statement" },
  { label: "隐私政策", href: "/pages/privacy" },
  { label: "用户协议", href: "/pages/agreement" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1fr_200px_150px]">
          <div className="space-y-3 text-sm text-slate-400">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl font-bold tracking-wide text-white">银脉圈</span>
              <div className="flex flex-col">
                <span className="text-base leading-tight text-slate-300">贷款随心选</span>
                <span className="text-sm leading-tight text-slate-400">yinmaiquan.com</span>
              </div>
            </div>
            <p>
              银脉圈 &middot; 贷款随心选 &mdash; 万千用户的贷款优选指南
            </p>
            <p>
              用数据说话，用口碑导航，让每个人都能找到对的贷款。
            </p>
            <p>
              不推产品、只推适合，做用户身边的贷款参谋。
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">快速链接</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">微信咨询</h4>
            <img
              src="/images/wechat-qr.png"
              alt="微信二维码"
              className="mb-2 h-24 w-24 rounded-lg border border-slate-700 object-cover"
              onClick={() => {
                fetch("/api/qr/scan", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ pagePath: window.location.pathname, source: "footer" }),
                  keepalive: true,
                }).catch(() => {});
              }}
              style={{ cursor: "pointer" }}
            />
            <p className="text-xs text-slate-500">扫码添加微信</p>
            {process.env.NEXT_PUBLIC_WECOM_URL && (
              <a
                href={process.env.NEXT_PUBLIC_WECOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
              >
                企业微信客服
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-500">
          Copyright &copy; 2025 内江银脉圈企业管理咨询有限公司版权所有 www.yinmaiquan.com
        </div>
      </div>
    </footer>
  );
}
