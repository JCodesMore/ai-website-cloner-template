import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "fast";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const isFast = variant === "fast";

  return (
    <a
      href={product.href}
      className="group block cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 object-cover"
        />
        <h3
          className="truncate text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-yellow-600"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
        <span>评：<strong className="text-slate-700">{product.commentCount}</strong></span>
        <span>机构：{product.institution}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <div>
          <div className="text-xs text-slate-400">最高额度</div>
          <div className="text-sm font-semibold text-slate-900">{product.maxAmount}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">还款期限</div>
          <div className="text-sm font-semibold text-slate-900">{product.term}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">参考利率</div>
          <div className="text-sm font-semibold text-slate-900">{product.rate}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">还款方式</div>
          <div className="text-sm font-semibold text-slate-900">{product.repayment}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        {product.promo ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
            {product.promo}
          </span>
        ) : (
          <span />
        )}
        <span className="rounded-md bg-yellow-600 px-3 py-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700">
          立即申请
        </span>
      </div>
    </a>
  );
}
