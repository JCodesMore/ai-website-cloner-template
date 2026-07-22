/* eslint-disable @next/next/no-img-element */
import s from "./site-header.module.css";

function GlobeIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ChevronDownIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function UserIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function SmsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}

function SearchIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

function IpShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="shieldGrad" x1="8.4" y1="8.1" x2="14.9" y2="16.9" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#17D2C7" />
          <stop offset="1" stopColor="#1D73FF" />
        </linearGradient>
      </defs>
      <g transform="translate(-6.5 -4.6)">
        <g transform="scale(1.55)">
          <path d="M12 4.2C14.12 5.44 16.1 6.14 18 6.7V11.2C18 13.74 16.3 15.87 12 17.8C7.7 15.87 6 13.74 6 11.2V6.7C7.9 6.14 9.88 5.44 12 4.2Z" fill="url(#shieldGrad)" stroke="#1B67FF" strokeWidth="1" strokeLinejoin="round" />
          <g fill="#FFFFFF">
            <rect x="9.2" y="7.6" width="1.5" height="5.2" rx="0.55" />
            <path d="M11.7 12.8V7.6H14.05C15.43 7.6 16.2 8.35 16.2 9.55C16.2 10.75 15.43 11.5 14.05 11.5H12.85V12.8H11.7ZM12.85 10.5H13.95C14.66 10.5 15 10.16 15 9.55C15 8.94 14.66 8.6 13.95 8.6H12.85V10.5Z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

const PAYMENT_ICONS = ["usdt.png", "trx.png", "alipay.png", "wechatpay.png", "ethereum.svg"];

export function SiteHeader() {
  return (
    <header className={s.wrapper}>
      <div className={s.top}>
        <div className={s.inner}>
          <div className={s.slogan}>
            欢迎来到 HUOAD，专业数字商城，客服时间：10:00 - 23:00
            {PAYMENT_ICONS.map((icon) => (
              <img key={icon} src={`/images/huoad/${icon}`} alt={icon.split(".")[0]} />
            ))}
          </div>
          <div className={s.right}>
            <a className={s.lang}>
              <GlobeIcon size={15} />
              简体中文&nbsp;&nbsp;|&nbsp;&nbsp;USD-$
              <ChevronDownIcon size={16} />
            </a>
            <a href="/zh/blog">教程</a>
            <a href="/zh/shop">我的店铺</a>
            <a href="https://www.2fa.money/zh">2FA</a>
          </div>
        </div>
      </div>

      <div className={s.middle}>
        <div className={s.inner}>
          <div className={s.logo}>
            <a href="/zh">
              <img src="/images/huoad/logo.png" alt="HUOAD" />
              <strong>HUOAD</strong>
            </a>
          </div>
          <div className={s.search}>
            <span className={s.searchWrap}>
              <input id="search-input" type="text" placeholder="搜索商品..." />
              <SearchIcon size={14} />
            </span>
          </div>
          <div className={s.user}>
            <a href="/zh/login">
              <button type="button" className={s.loginBtn}>
                <UserIcon size={16} />
                <span>登录</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.inner}>
          <nav className={s.nav}>
            <div className={s.navItem}>
              <UsersIcon />
              社交账号
              <ChevronDownIcon size={16} />
            </div>
            <div className={s.navDrop}>
              <a className={s.navItem} href="/proxy">
                <IpShieldIcon />
                全球 IP 代理
                <ChevronDownIcon size={16} />
              </a>
              <div className={s.dropMenu}>
                <a href="/proxy?view=residential">住宅代理</a>
                <a href="/proxy?view=mobile">移动代理</a>
                <a href="/proxy?view=isp">ISP 代理</a>
                <a href="/proxy?view=datacenter">数据中心代理</a>
              </div>
            </div>
            <div className={s.navDrop}>
              <a className={s.navItem} href="/vcc">
                <CreditCardIcon />
                虚拟信用卡
                <ChevronDownIcon size={16} />
              </a>
              <div className={s.dropMenu}>
                <a href="/vcc?view=cards">我的卡片</a>
                <a href="/vcc?view=newcard">开新卡</a>
                <a href="/vcc?view=transactions">交易记录</a>
              </div>
            </div>
            <div className={s.navDrop}>
              <a className={s.navItem} href="/sms">
                <SmsIcon />
                短信接码
                <ChevronDownIcon size={16} />
              </a>
              <div className={s.dropMenu}>
                <a href="/sms">购买号码</a>
                <a href="/sms?view=orders">我的订单</a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
