/** Faorbit 商户端克隆布局 — 挂载蓝版设计系统（与 Vcc (site)/layout.tsx 相同的两张样式表）。
 *  克隆站根布局把 body 设成 flex 列容器，设计稿按普通文档流编写，这里还原为 block。 */
export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/site.css" />
      <link rel="stylesheet" href="/css/merchant.css" />
      <link rel="stylesheet" href="/css/merchant-embed.css" />
      <link rel="stylesheet" href="/css/huoad-skin.css" />
      {/* 移动段按宽度生效；/vcc/m 的子布局会再无条件加载同一张表强制移动版 */}
      <link
        rel="stylesheet"
        href="/css/merchant-mobile.css"
        media="(max-width: 768px)"
      />
      <style>{`body{display:block}`}</style>
      {children}
    </>
  );
}
