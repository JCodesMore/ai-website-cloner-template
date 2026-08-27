import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";

import { HandholdLogo } from "@/components/sites/handhold-io-1ee60dfc/shared/logos";

export function TopChrome() {
  return (
    <div>
      <Link
        href="#"
        className="block w-full bg-surface-elevated px-4 py-2.5 text-center font-sans text-base font-normal leading-6 text-black hover:brightness-95 active:brightness-90"
      >
        We raised €3M to grow your revenue on autopilot.{" "}
        <span className="underline">Read the announcement</span>
      </Link>

      <header className="relative z-30 flex h-[72px] items-center justify-between px-4 py-4 md:px-8">
        <Link href="#" className="flex items-center">
          <HandholdLogo className="h-5 w-36 text-black" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <button
            type="button"
            className="flex items-center gap-1 rounded-md px-3 py-2 text-base text-black hover:bg-[var(--surface-interactive-secondary-hover)]"
          >
            Resources
            <ChevronDown size={16} />
          </button>

          <Link
            href="#"
            className="rounded-md px-3 py-2 text-base text-black hover:bg-[var(--surface-interactive-secondary-hover)]"
          >
            Sign in
          </Link>

          <Link
            href="#"
            className="rounded-full bg-black px-4 py-2 text-sm font-normal leading-5 tracking-[-0.13px] text-white hover:bg-[var(--surface-interactive-primary-hover)]"
          >
            Try for free
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          className="flex items-center justify-center rounded-md p-2 text-black md:hidden"
        >
          <Menu size={24} />
        </button>
      </header>
    </div>
  );
}
