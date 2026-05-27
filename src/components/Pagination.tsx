import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  extraParams?: string;
}

export default function Pagination({ currentPage, totalPages, baseHref, extraParams = "" }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const connector = baseHref.includes("?") ? "&" : "?";
  const sep = extraParams ? (extraParams.startsWith("&") ? extraParams : `&${extraParams}`) : "";

  const href = (page: number) => `${baseHref}${connector}page=${page}${sep}`;

  return (
    <div style={{ marginTop: 32, textAlign: "center" }}>
      <div className="layui-box layui-laypage layui-laypage-default">
        {currentPage > 1 ? (
          <Link className="GPageLink" href={href(1)}>首页</Link>
        ) : (
          <span className="GPageSpan">首页</span>
        )}
        {currentPage > 1 ? (
          <Link className="GPageLink" href={href(currentPage - 1)}>上一页</Link>
        ) : (
          <span className="GPageSpan">上一页</span>
        )}
        {pages.map((p: number) =>
          p === currentPage ? (
            <span className="GPageSpan" key={p}>{p}</span>
          ) : (
            <Link className="GPageLink" key={p} href={href(p)}>{p}</Link>
          )
        )}
        {currentPage < totalPages ? (
          <Link className="GPageLink" href={href(currentPage + 1)}>下一页</Link>
        ) : (
          <span className="GPageSpan">下一页</span>
        )}
        {currentPage < totalPages ? (
          <Link className="GPageLink" href={href(totalPages)}>尾页</Link>
        ) : (
          <span className="GPageSpan">尾页</span>
        )}
      </div>
    </div>
  );
}
