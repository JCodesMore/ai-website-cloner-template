import type { Product } from "@/types";
import { getAvatarColor, getAvatarInitial } from "@/lib/avatar";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "fast";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const isFast = variant === "fast";
  const avatar = getAvatarColor(product.institution || product.name);

  return (
    <a
      href={product.href}
      className="group block cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center gap-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 shrink-0 rounded-lg border border-slate-100 object-cover"
          />
        ) : (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${avatar.bg} text-sm font-bold ${avatar.text}`}>
            {getAvatarInitial(product.institution || product.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-500">{product.institution}</div>
          <h3
            className="truncate text-base font-semibold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <div>
          <div className="text-xs text-slate-400">最高额度</div>
          <div className="text-base font-semibold text-slate-900">{product.maxAmount}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">还款期限</div>
          <div className="text-base font-semibold text-slate-900">{product.term}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">参考利率</div>
          <div className="text-base font-semibold text-slate-900">{product.rate}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400">还款方式</div>
          <div className="text-base font-semibold text-slate-900">{product.repayment}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        {product.promo ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {product.promo}
          </span>
        ) : (
          <span />
        )}
        <span className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700">
          立即申请
        </span>
      </div>
    </a>
  );
}
