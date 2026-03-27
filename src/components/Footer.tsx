import Link from "next/link";
import type { SVGProps } from "react";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M4 4l16.5 16M4 20L20.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M2 4h6l14 16h-6Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
    </svg>
  );
}

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
  { label: "Booking Page Themes", href: "/themes" },
  { label: "API", href: "/api" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Partners", href: "/partners" },
  { label: "Careers", href: "/careers" },
  { label: "Press Kit", href: "/press" },
  { label: "Contact", href: "/contact" },
];

const INDUSTRY_LINKS = [
  { label: "Beauty & Wellness", href: "/industries/beauty" },
  { label: "Fitness & Sports", href: "/industries/fitness" },
  { label: "Medical & Health", href: "/industries/medical" },
  { label: "Education", href: "/industries/education" },
  { label: "Photography", href: "/industries/photography" },
  { label: "Consulting", href: "/industries/consulting" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com/simplybook.me", icon: FacebookIcon },
  { label: "Twitter / X", href: "https://twitter.com/simplybookme", icon: TwitterIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/simplybook-me", icon: LinkedinIcon },
  { label: "Instagram", href: "https://instagram.com/simplybook.me", icon: InstagramIcon },
  { label: "YouTube", href: "https://youtube.com/c/SimplyBookme", icon: YoutubeIcon },
];

const FOOTER_LINK_STYLE: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(255,255,255,0.65)",
  textDecoration: "none",
  transition: "color 0.2s",
  display: "block",
  marginBottom: 10,
  lineHeight: 1.5,
};

const COLUMN_HEADING_STYLE: React.CSSProperties = {
  color: "#ffffff",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 20,
};

interface FooterColumnProps {
  heading: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <p style={COLUMN_HEADING_STYLE}>{heading}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              style={FOOTER_LINK_STYLE}
              className="hover:!text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#0f1340" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 24px 48px",
        }}
      >
        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1: Brand */}
          <div>
            {/* Logo (white text version) */}
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, textDecoration: "none" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#ff6c50",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M4 9.5L7.5 13L14 6"
                    stroke="white"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                SimplyBook
                <span style={{ color: "#00c8d4" }}>.me</span>
              </span>
            </Link>

            {/* Tagline */}
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                lineHeight: 1.65,
                marginBottom: 24,
                maxWidth: 260,
              }}
            >
              The online booking system for service businesses worldwide.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    transition: "color 0.2s",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="hover:!text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Product */}
          <FooterColumn heading="Product" links={PRODUCT_LINKS} />

          {/* Column 3: Company */}
          <FooterColumn heading="Company" links={COMPANY_LINKS} />

          {/* Column 4: Industries */}
          <FooterColumn heading="Industries" links={INDUSTRY_LINKS} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            marginTop: 48,
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: 0 }}>
            &copy; 2025 SimplyBook.me. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map((item, index, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center" }}>
                <Link
                  href={item.href}
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 13,
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  className="hover:!text-white"
                >
                  {item.label}
                </Link>
                {index < arr.length - 1 && (
                  <span style={{ color: "rgba(255,255,255,0.3)", margin: "0 8px" }}>
                    &middot;
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
