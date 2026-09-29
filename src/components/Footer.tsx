const columns = [
  {
    title: "Club",
    links: [
      { label: "Events", href: "#events" },
      { label: "Members", href: "#members" },
      { label: "Social media", href: "#social" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Discord", href: "#" },
      { label: "X (Twitter)", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-base font-semibold tracking-tight">
              CSULBreach
            </span>
            <p className="mt-2 max-w-[20ch] text-sm text-muted-foreground">
              CyberSecurity Club
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CSULBreach
        </p>
      </div>
    </footer>
  );
}
