/** 全球 IP 代理板块布局 — 只挂自己的样式表（不依赖商户端注入链）。
 *  克隆站根布局把 body 设成 flex 列容器，这里同 /vcc 还原为 block。 */
export default function ProxyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/proxy.css" />
      {/* 移动段按宽度生效；/proxy/m 的子布局会再无条件加载同一张表强制移动版 */}
      <link
        rel="stylesheet"
        href="/css/proxy-mobile.css"
        media="(max-width: 768px)"
      />
      <style>{`body{display:block}`}</style>
      {children}
    </>
  );
}
