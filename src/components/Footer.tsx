const links = {
  Services: [
    { label: "FlowStack", href: "/flowstack" },
    { label: "FlowOps", href: "/flowops" },
    { label: "Pricing", href: "/pricing" },
    { label: "Case Studies", href: "/case-studies" },
  ],
  Resources: [
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
    { label: "Changelog", href: "/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

function FloLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* 4-square grid icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="9" height="9" fill="white" fillOpacity="0.9" />
        <rect x="13" y="2" width="9" height="9" fill="white" fillOpacity="0.9" />
        <rect x="2" y="13" width="9" height="9" fill="white" fillOpacity="0.9" />
        <rect x="13" y="13" width="9" height="9" fill="white" fillOpacity="0.9" />
      </svg>
      <span
        style={{
          fontSize: "18px",
          fontWeight: 800,
          color: "oklch(1 0 0 / 0.9)",
        }}
      >
        FLO
      </span>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid oklch(1 0 0 / 0.1)",
        paddingTop: "48px",
        paddingBottom: "48px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Logo + tagline + social */}
          <div className="flex flex-col gap-4">
            <FloLogo />
            <p
              style={{
                fontSize: "14px",
                color: "oklch(1 0 0 / 0.6)",
                lineHeight: 1.6,
              }}
            >
              Automation systems for modern businesses.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(1 0 0 / 0.6)" }}
                className="hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "oklch(1 0 0 / 0.6)" }}
                className="hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Cols 2-4: Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "oklch(1 0 0 / 0.9)",
                  marginBottom: "16px",
                }}
              >
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{
                        fontSize: "14px",
                        color: "oklch(1 0 0 / 0.6)",
                        textDecoration: "none",
                      }}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: "1px solid oklch(1 0 0 / 0.1)",
            paddingTop: "24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "oklch(1 0 0 / 0.4)",
            }}
          >
            © 2025 FLO Automation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
