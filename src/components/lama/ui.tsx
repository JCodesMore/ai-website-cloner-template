/** LamaProxy 仪表盘通用 UI — Button / Card / ContentArea / OrderPanel。
 *  className 组合与原站打包组件一一对应。 */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { T } from "@/lib/lamaproxy-data";
import { fmtPrice } from "@/lib/lamaproxy-data";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed",
  secondary:
    "bg-primary-50 text-primary-600 hover:bg-primary-100 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "text-gray-600 hover:bg-gray-100 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

/** 两栏内容区：主内容 + 右侧粘滞订单面板 */
export function ContentArea({
  children,
  orderPanel,
}: {
  children: ReactNode;
  orderPanel?: ReactNode;
}) {
  if (!orderPanel) {
    return <div className="p-6 min-h-[calc(100vh-60px)]">{children}</div>;
  }
  return (
    <div className="flex gap-6 p-6 min-h-[calc(100vh-60px)] items-start">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="w-[320px] shrink-0 sticky top-[84px]">{orderPanel}</div>
    </div>
  );
}

export function OrderPanel({
  topSlot,
  bottomSlot,
}: {
  topSlot: ReactNode;
  bottomSlot: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-base">{T.order.title}</h3>
      </div>
      <div className="px-5 py-4 border-b border-gray-100 min-h-[80px]">{topSlot}</div>
      <div className="px-5 py-4">{bottomSlot}</div>
    </Card>
  );
}

export function OrderPanelFooter({
  total,
  disabled,
  loading = false,
  onCheckout,
}: {
  total: number;
  disabled: boolean;
  loading?: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm">{T.order.total}</span>
        <span className="text-xl font-bold text-gray-900">{fmtPrice(total)}</span>
      </div>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={disabled}
        loading={loading}
        onClick={onCheckout}
      >
        {T.order.checkout}
      </Button>
    </div>
  );
}
