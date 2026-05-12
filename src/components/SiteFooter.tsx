import Image from "next/image";
import {
  FOOTER_CONTACT,
  FOOTER_NEWSLETTER_BLURB,
  FOOTER_QUICK_LINKS,
  FOOTER_SCHEDULE,
  FOOTER_SERVICES,
} from "@/lib/content";
import {
  ClockIcon,
  EnvelopeIcon,
  FacebookIcon,
  LinkedinIcon,
  MapPinIcon,
  PaperPlaneIcon,
  PhoneIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const CONTACT_ITEMS: { Icon: IconType; label: string; value: string }[] = [
  { Icon: PhoneIcon, label: "Phone Number", value: FOOTER_CONTACT.phone },
  { Icon: EnvelopeIcon, label: "Email Address", value: FOOTER_CONTACT.email },
  { Icon: MapPinIcon, label: "Loaction", value: FOOTER_CONTACT.location },
];

const SOCIAL_ITEMS: { Icon: IconType; href: string; label: string }[] = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: XIcon, href: "#", label: "X" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
  { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-bold mb-7 flex items-center gap-2">
      <span className="text-primary">|</span>
      {children}
    </h4>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white relative">
      <div className="yo-container border-b border-white/10 py-10 md:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          <div>
            <Image
              src="/img/logos/footer-light-logo.png"
              alt="VertexLink"
              width={180}
              height={50}
              className="h-auto w-[180px]"
            />
          </div>
          {CONTACT_ITEMS.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="shrink-0 mt-2 text-white">
                <Icon className="size-7" />
              </div>
              <div className="flex-grow border-l border-white/10 pl-4">
                <h5 className="text-base mb-1 font-bold text-white">{label}</h5>
                <span className="text-sm opacity-90">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="yo-container py-10 md:py-16 lg:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <ColumnHeading>Newsletter</ColumnHeading>
            <p className="text-white/90 mb-6">{FOOTER_NEWSLETTER_BLURB}</p>
            <form
              action="#"
              method="post"
              className="relative"
              suppressHydrationWarning
            >
              <input
                type="email"
                name="email_address"
                required
                placeholder="Subscribe with us"
                className="w-full h-12 rounded-full bg-white text-secondary placeholder:text-body/60 px-5 pr-14 outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1/2 -translate-y-1/2 size-10 rounded-full bg-primary text-white grid place-items-center hover:bg-primary/90 transition-colors"
              >
                <PaperPlaneIcon className="size-4" />
              </button>
            </form>
          </div>

          <div className="lg:pl-10">
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="space-y-3">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pl-10">
            <ColumnHeading>Our Services</ColumnHeading>
            <ul className="space-y-3">
              {FOOTER_SERVICES.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Schedule</ColumnHeading>
            <ul className="space-y-4">
              {FOOTER_SCHEDULE.map((item) => (
                <li key={item.day} className="flex items-start gap-3">
                  <ClockIcon className="size-5 shrink-0 mt-1" />
                  <div>
                    <h5 className="font-medium mb-1 text-white">{item.day}</h5>
                    <p className="text-sm opacity-90">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-secondary border-t border-white/10">
        <div className="yo-container py-6">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/90">
              © {year} VertexLink Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="font-semibold">Follow Us:</span>
              <ul className="flex gap-3">
                {SOCIAL_ITEMS.map(({ Icon, href, label }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="size-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
