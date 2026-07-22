/** /sms/m — 移动版固定入口。
 *  父布局 (/sms) 已按 (max-width:768px) 条件加载 sms-mobile.css；
 *  这里无条件再挂一次，位置更靠后，于是任意视口宽度都走移动版布局。 */
export default function SmsMobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="stylesheet" href="/css/sms-mobile.css" />
      {children}
    </>
  );
}
