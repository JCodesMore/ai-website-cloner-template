/** /vcc/m — 移动版固定入口。
 *  父布局 (/vcc) 已按 (max-width:768px) 条件加载 merchant-mobile.css；
 *  这里无条件再挂一次，位置更靠后，于是任意视口宽度都走移动版布局。 */
export default function VccMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/merchant-mobile.css" />
      {children}
    </>
  );
}
