import { SiteHeader } from "@/components/site-header";
import { CategorySidebar } from "@/components/category-sidebar";
import { HomeBody } from "@/components/home-body";
import { MobileHome } from "@/components/mobile-home";
import s from "@/components/home-body.module.css";

/* 首页 = huoad.com/zh 商品区：fixed 头部 + fixed 分类侧栏 + 商品列表。
 * 侧栏 position:fixed 不设 left，静态位即容器左缘（随容器居中）。
 * ≤768px 隐藏桌面版，切换为 MobileHome（原站 UA 分流的移动布局）。 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className={s.page}>
        <div className={s.container}>
          <CategorySidebar />
          <HomeBody />
        </div>
      </main>
      <MobileHome />
    </>
  );
}
