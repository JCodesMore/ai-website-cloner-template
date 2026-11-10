import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Members", href: "#members" },
  { label: "Social media", href: "#social" },
  { label: "Ram", href: "#ram" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/cyberclublogo.png"
              alt="CSULBreach Cyber Security Club logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <span className="text-base font-semibold tracking-tight">
              CSULBreach
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <Image
              src="/images/belllogo.png"
              alt="Notifications"
              width={20}
              height={22}
              className="h-5 w-auto object-contain"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
