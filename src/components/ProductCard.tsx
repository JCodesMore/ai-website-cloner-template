import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "fast";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const isFast = variant === "fast";
  const hasPromo = !!product.promo;

  return (
    <a href={product.href} className={`ley-product-card ${isFast ? "ley-product-card-fast" : ""}`}>
      <div className="product-title-row">
        <img src={product.image} alt={product.name} />
        <div className="product-name" title={product.name}>
          {product.name}
        </div>
      </div>
      <div className="product-comment-badge">
        评：<strong>{product.commentCount}</strong>
      </div>
      <div className="org-cell">
        <span>机构：{product.institution}</span>
      </div>
      <div className={`attr-list ${isFast ? "attr-list-fast" : ""}`}>
        <div className={`item ${isFast ? "metric-item" : ""}`}>
          <div className="attr-name">最高额度(元)</div>
          <div className="attr-value">{product.maxAmount}</div>
        </div>
        <div className={`item ${isFast ? "metric-item" : ""}`}>
          <div className="attr-name">还款期限</div>
          <div className="attr-value">{product.term}</div>
        </div>
        <div className="item">
          <div className="attr-name">参考利率</div>
          <div className="attr-value">{product.rate}</div>
        </div>
        <div className="item">
          <div className="attr-name">还款方式</div>
          <div className="attr-value">{product.repayment}</div>
        </div>
      </div>
      {(isFast || hasPromo) && (
        <div className="fast-card-actions">
          {product.promo && <div className="product-promo product-promo-inline">{product.promo}</div>}
          <span className="fast-card-apply">
            立即申请
          </span>
        </div>
      )}
    </a>
  );
}
