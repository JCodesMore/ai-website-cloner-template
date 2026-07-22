/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import s from "./home-body.module.css";
import { FILTER_TAGS, PRODUCTS, type Product } from "@/lib/huoad-data";

/* 首页正文（标签筛选 + 排序工具栏 + 商品列表/网格 + 浮动按钮）。
 * 交互与原站一致：标签多选 AND 过滤，价格排序，list/grid 切换（默认 list），
 * 0 结果显示 antd 同款空态。结构与尺寸见 docs/research/huoad.com/home-body-spec.md。 */

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

function GridIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );
}

/* antd Empty PRESENTED_IMAGE_DEFAULT 同款插画 */
function EmptyImage() {
  return (
    <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient x1="55.6%" y1="47.5%" x2="50%" y2="100%" id="hb-empty-g">
          <stop stopColor="#DEDEDE" offset="0%" />
          <stop stopColor="#FAFAFA" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(24 31.67)">
          <ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668" />
          <path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2" />
          <path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#hb-empty-g)" transform="translate(13.56)" />
          <path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7" />
          <path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6" />
        </g>
        <path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6" />
        <g transform="translate(149.65 15.383)" fill="#FFF">
          <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
          <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
        </g>
      </g>
    </svg>
  );
}

function ProductMeta({ product }: { product: Product }) {
  return (
    <div className={s.productInfo}>
      <a className={s.shopName} href="/zh">
        <span className={s.avatar}>官</span>
        官方
      </a>
      <p>规格：{product.spec}</p>
      <p>
        库存：
        {product.stock === "充足" ? <span className={s.stockOk}>充足</span> : product.stock}
      </p>
    </div>
  );
}

function Price({ value }: { value: number }) {
  return (
    <div className={s.price}>
      <span className={s.money}>
        <span>$</span>
        <span>{value.toFixed(2)}</span>
      </span>
    </div>
  );
}

function BuyButton() {
  return (
    <button type="button" className={s.buyBtn}>
      <CartIcon size={14} />
      加入购物车
    </button>
  );
}

export function HomeBody() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [view, setView] = useState<"grid" | "list">("list");

  const toggleTag = (tag: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filtered = PRODUCTS.filter((p) =>
    [...selected].every((tag) => p.tags.includes(tag))
  );
  const products =
    sort === "default"
      ? filtered
      : [...filtered].sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));

  return (
    <div className={s.right}>
      <div className={s.filterCard}>
        <div className={s.filterTitle}>
          标签筛选
          {selected.size > 0 && (
            <button type="button" className={s.clearTags} onClick={() => setSelected(new Set())}>
              <XIcon />
              清除筛选
            </button>
          )}
        </div>
        <div className={s.tags}>
          {FILTER_TAGS.map((tag) => (
            <a
              key={tag}
              className={selected.has(tag) ? `${s.tagPill} ${s.selected}` : s.tagPill}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      <div className={s.toolbar}>
        <span className={s.count}>共 {products.length} 个商品</span>
        <div className={s.toolbarRight}>
          <span>排序：</span>
          <select
            className={s.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="排序"
          >
            <option value="default">默认排序</option>
            <option value="asc">价格由低到高</option>
            <option value="desc">价格由高到低</option>
          </select>
          <div className={s.viewSwitch}>
            <button
              type="button"
              className={view === "grid" ? `${s.viewBtn} ${s.viewOn}` : s.viewBtn}
              onClick={() => setView("grid")}
              aria-label="网格视图"
            >
              <GridIcon />
            </button>
            <button
              type="button"
              className={view === "list" ? `${s.viewBtn} ${s.viewOn}` : s.viewBtn}
              onClick={() => setView("list")}
              aria-label="列表视图"
            >
              <ListIcon />
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={s.empty}>
          <EmptyImage />
          <div className={s.emptyDesc}>无数据</div>
        </div>
      ) : view === "list" ? (
        <div className={s.productList}>
          {products.map((p) => (
            <div key={p.id} className={s.listItem}>
              <img className={s.cover} src={p.image} alt={p.title} />
              <div className={s.center}>
                <a className={s.link} href={p.href}>
                  {p.title}
                </a>
                <ProductMeta product={p} />
              </div>
              <div className={s.footer}>
                <Price value={p.price} />
                <BuyButton />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={s.productGrids}>
          {products.map((p) => (
            <div key={p.id} className={s.gridItem}>
              <img className={s.cover} src={p.image} alt={p.title} />
              <div className={s.center}>
                <a className={s.link} href={p.href}>
                  {p.title}
                </a>
                <ProductMeta product={p} />
              </div>
              <div className={s.footer}>
                <Price value={p.price} />
                <BuyButton />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={s.floating}>
        <button type="button" className={`${s.fab} ${s.fabCart}`} aria-label="购物车">
          <CartIcon size={24} />
          <sup className={s.cartBadge}>0</sup>
        </button>
        <a className={`${s.fab} ${s.fabTg}`} href="https://t.me/HUOAD" target="_blank" rel="noreferrer" aria-label="Telegram">
          <TelegramIcon />
        </a>
        <a className={`${s.fab} ${s.fabWa}`} href="https://wa.me/37060084934" target="_blank" rel="noreferrer" aria-label="WhatsApp">
          <WhatsAppIcon />
        </a>
        <a className={`${s.fab} ${s.fabChat}`} href="https://chat.huoaccs.com/" target="_blank" rel="noreferrer" aria-label="在线聊天">
          <img src="/images/huoad/online-chat.svg" alt="" width={22} height={22} />
        </a>
      </div>
    </div>
  );
}
