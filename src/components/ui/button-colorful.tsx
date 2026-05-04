import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function ButtonColorful({
  className,
  label = "Book Your Expedition",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-11 px-5 overflow-hidden rounded-xl",
        "bg-deep",
        "transition-all duration-300",
        "hover:scale-[1.03] hover:-translate-y-0.5",
        "group",
        className
      )}
      {...props}
    >
      {/* Gradient background effect — brand palette */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-teal via-teal-light to-coral",
          "opacity-40 group-hover:opacity-80",
          "blur transition-opacity duration-500"
        )}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-warm-white">{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-warm-white/90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Button>
  );
}

export { ButtonColorful as default };
