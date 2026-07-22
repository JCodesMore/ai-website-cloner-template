/* eslint-disable @next/next/no-img-element */
import s from "./mobile-header.module.css";

/** HUOAD 移动端头部 — 原站移动版同款黑色顶条（header-mobile-module）：
 *  左 logo + 品牌名，右 语言/币种切换；≤768px 显示。
 *  另带全局类 huoad-mheader，供 /vcc/m、/proxy/m 的移动样式表强制显示。 */

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MobileHeader() {
  return (
    <header className={`${s.bar} huoad-mheader`}>
      <a className={s.logo} href="/zh">
        <img src="/images/huoad/logo.png" alt="HUOAD" />
        <strong>HUOAD</strong>
      </a>
      <a className={s.lang}>
        简体中文 | USD-$
        <ChevronDownIcon />
      </a>
    </header>
  );
}
