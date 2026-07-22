/* eslint-disable @next/next/no-img-element */
import s from "./category-sidebar.module.css";
import { CATEGORY_GROUPS } from "@/lib/huoad-data";

function Settings2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 17H5" />
      <path d="M19 7h-9" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
}

export function CategorySidebar() {
  return (
    <aside className={s.wrapper}>
      <div className={s.title}>
        <span>商品分类</span>
        <p className={s.sort}>
          <Settings2Icon />
          排序
        </p>
      </div>
      <nav className={s.categories}>
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.label}>
            <div className={s.tag}>
              <img src={group.icon} alt={group.label} />
              <span>{group.label}</span>
            </div>
            {group.children.map((child) => (
              <a
                key={child.label}
                className={child.active ? `${s.category} ${s.active}` : s.category}
                href={child.href}
              >
                {child.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
