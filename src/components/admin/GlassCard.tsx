import { cn } from "@/lib/utils";

const variantClasses = {
  default: "glass-card",
  stat: "glass-stat",
  warning: "glass-warning",
  table: "glass-table",
} as const;

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variantClasses;
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div className={cn(variantClasses[variant], "rounded-sm", className)}>
      {children}
    </div>
  );
}
