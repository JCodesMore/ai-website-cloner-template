import { cn } from "@/lib/utils";

type IconProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
};

/**
 * Monochrome circular spiral monogram (the © -style mark next to the wordmark).
 * Renders a flat black-on-transparent spiral that scales fluidly.
 */
export function MonogramIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" />
      <path
        d="M12 4
           a8 8 0 1 1 -8 8
           a6.5 6.5 0 0 1 6.5 -6.5
           a5 5 0 0 1 5 5
           a3.6 3.6 0 0 1 -3.6 3.6
           a2.4 2.4 0 0 1 -2.4 -2.4"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Monochrome wordmark + monogram, used in the header. */
export function MonochromeLogo({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[2px] font-medium tracking-tight text-[1.5rem] leading-none",
        className,
      )}
      {...props}
    >
      <span>Monochrome</span>
      <MonogramIcon className="w-3 h-3 translate-y-[-0.4em]" />
    </span>
  );
}

/** Footer M with monogram. */
export function MonochromeMark({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("h-10", className)}
      {...props}
    >
      <text
        x="0"
        y="36"
        fontFamily="inherit"
        fontWeight="500"
        fontSize="38"
        fill="currentColor"
      >
        M
      </text>
      <g transform="translate(40 4)">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1" />
        <path
          d="M10 3
             a7 7 0 1 1 -7 7
             a5 5 0 0 1 5 -5
             a4 4 0 0 1 4 4
             a3 3 0 0 1 -3 3
             a2 2 0 0 1 -2 -2"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function HamburgerIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-8 h-4", className)}
      {...props}
    >
      <line x1="0" y1="2" x2="32" y2="2" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ArrowRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("w-4 h-4", className)}
      {...props}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
