/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import s from "./mobile-home.module.css";
import { MobileHeader } from "./mobile-header";
import { CATEGORY_GROUPS, FILTER_TAGS, PRODUCTS } from "@/lib/huoad-data";

/* 首页移动版（≤768px）— 原站 UA 分流出的移动布局：
 * 黑色顶条 + 置顶分类 + 搜索 + 标签筛选 + 双列商品卡 + 固定底部五格导航。
 * 标签为单选（全部 = 不过滤），规格见 docs/research/huoad.com/mobile-spec.md。 */

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

/* antd product 图标 — 原站「更多」分类入口同款 */
function AntProductIcon() {
  return (
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M464 144a16 16 0 0116 16v304a16 16 0 01-16 16H160a16 16 0 01-16-16V160a16 16 0 0116-16zm-52 68H212v200h200zm493.33 87.69a16 16 0 010 22.62L724.31 503.33a16 16 0 01-22.62 0L520.67 322.31a16 16 0 010-22.62l181.02-181.02a16 16 0 0122.62 0zm-84.85 11.3L713 203.53 605.52 311 713 418.48zM464 544a16 16 0 0116 16v304a16 16 0 01-16 16H160a16 16 0 01-16-16V560a16 16 0 0116-16zm-52 68H212v200h200zm452-68a16 16 0 0116 16v304a16 16 0 01-16 16H560a16 16 0 01-16-16V560a16 16 0 0116-16zm-52 68H612v200h200z" />
    </svg>
  );
}

/* antd heart（描边）— 商品卡收藏钮同款 */
function AntHeartIcon() {
  return (
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
    </svg>
  );
}

function CartIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const PIN_CATEGORIES = CATEGORY_GROUPS.slice(0, 3).map((g) => ({
  icon: g.icon,
  label: g.children[0].label,
  href: g.children[0].href,
  active: Boolean(g.children[0].active),
}));

export function MobileHome() {
  const [tag, setTag] = useState<string | null>(null);

  /* 同原站：把 --full-height 设为真实 window.innerHeight。
     iOS Safari 的 100vh 不含底部工具条，真机上会比可视区大。 */
  useEffect(() => {
    const setFullHeight = () =>
      document.documentElement.style.setProperty("--full-height", `${window.innerHeight}px`);
    setFullHeight();
    window.addEventListener("resize", setFullHeight);
    window.addEventListener("orientationchange", setFullHeight);
    return () => {
      window.removeEventListener("resize", setFullHeight);
      window.removeEventListener("orientationchange", setFullHeight);
    };
  }, []);

  const products = tag ? PRODUCTS.filter((p) => p.tags.includes(tag)) : PRODUCTS;

  return (
    <div className={s.root}>
      <MobileHeader />

      <div className={s.content}>
        <nav className={s.pinCats}>
          {PIN_CATEGORIES.map((c) => (
            <a key={c.label} className={c.active ? `${s.pinCat} ${s.pinCatActive}` : s.pinCat} href={c.href}>
              <img src={c.icon} alt={c.label} />
              <p>{c.label}</p>
            </a>
          ))}
          <div className={`${s.pinCat} ${s.more}`}>
            <div className={s.moreIcon}>
              <AntProductIcon />
            </div>
            <p>更多</p>
          </div>
        </nav>

        <span className={s.search}>
          <input type="text" placeholder="搜索商品..." />
          <SearchIcon />
        </span>

        <ul className={s.tags}>
          <li className={tag === null ? s.tagSelected : undefined} onClick={() => setTag(null)}>
            全部
          </li>
          {FILTER_TAGS.map((t) => (
            <li key={t} className={tag === t ? s.tagSelected : undefined} onClick={() => setTag(t)}>
              {t}
            </li>
          ))}
        </ul>

        <div className={s.grid}>
          {products.map((p) => (
            <a key={p.id} className={s.item} href={p.href}>
              <img className={s.cover} src={p.image} alt={p.title} />
              <div className={s.fav}>
                <AntHeartIcon />
              </div>
              <div className={s.body}>
                <p className={s.name}>{p.title}</p>
                <ul className={s.ptags}>
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className={s.blank} />
                <p className={s.price}>
                  <span className={s.money}>
                    <span>$</span>
                    <span>{p.price.toFixed(2)}</span>
                  </span>
                </p>
                <div className={s.stockRow}>
                  <p className={s.stock}>
                    {p.stock === "充足" ? <span className={s.stockOk}>充足</span> : p.stock}
                  </p>
                  <button
                    type="button"
                    className={s.cartBtn}
                    aria-label="加入购物车"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CartIcon size={14} />
                  </button>
                </div>
              </div>
              <div className={s.cfooter}>
                <span className={s.shopName}>
                  <span className={s.avatar}>官</span>
                  官方
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <nav className={s.navbar} aria-label="移动端导航">
        <Link className={s.navActive} href="/">
          <HouseIcon />
          <span>首页</span>
        </Link>
        <a>
          <span className={s.badgeWrap}>
            <CartIcon size={17} />
            <sup className={s.badge}>0</sup>
          </span>
          <span>购物车</span>
        </a>
        <a>
          <HeadsetIcon />
          <span>客服</span>
        </a>
        <a>
          <span className={s.badgeWrap}>
            <FileTextIcon />
          </span>
          <span>订单</span>
        </a>
        <a>
          <UserIcon />
          <span>我的</span>
        </a>
      </nav>
    </div>
  );
}
