/** 短信接码板块布局 — 只挂自己的样式表（同 /proxy，不依赖商户端注入链）。
 *  克隆站根布局把 body 设成 flex 列容器，这里还原为 block。 */
export default function SmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/sms.css" />
      {/* 移动段按宽度生效；/sms/m 的子布局会再无条件加载同一张表强制移动版 */}
      <link
        rel="stylesheet"
        href="/css/sms-mobile.css"
        media="(max-width: 768px)"
      />
      <style>{`body{display:block}`}</style>
      {children}
    </>
  );
}
