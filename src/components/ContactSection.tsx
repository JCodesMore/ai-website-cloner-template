import Image from "next/image";
import Link from "next/link";

export function ContactSection() {
  return (
    <section id="section-contact" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[58.75rem]">
        {/* Still Have Questions Card */}
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            borderRadius: "clamp(1rem, 0.6923rem + 1.3138vw, 1.7rem)",
            backgroundImage: "url(/images/still-have-questions-bg.avif)",
          }}
        >
          <div className="flex flex-col items-center gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-[6.25rem] md:py-[3.25rem]">
            <h2
              className="text-center leading-[1.2] font-bold text-white md:text-left"
              style={{
                fontSize:
                  "clamp(1.5rem, 0.8838rem + 2.6291vw, 3.25rem)",
              }}
            >
              Still have questions?
            </h2>

            <div className="flex items-center gap-4">
              <Link
                href="#section-contact"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 font-medium text-white transition-colors hover:bg-black/80"
              >
                Contact us
              </Link>

              <div className="flex gap-3">
                <a
                  href="https://api.whatsapp.com/send/?phone=15144189871"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                  aria-label="Contact us on WhatsApp"
                >
                  <Image
                    src="/images/whatsapp-icon.png"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                  />
                </a>
                <a
                  href="https://t.me/+qXQldWDNab0yNWJi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                  aria-label="Contact us on Telegram"
                >
                  <Image
                    src="/images/social/telegram.webp"
                    alt="Telegram"
                    width={24}
                    height={24}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter CTA Bar */}
        <div className="mt-8">
          <a
            href="https://form.typeform.com/to/e4ZYOiQe"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl bg-[#1a0a2e] px-6 py-6 md:px-10 md:py-8"
          >
            {/* Dot pattern overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <p className="text-center text-lg font-semibold text-white md:text-left md:text-xl">
                Unlock exclusive perks! Subscribe &amp; Supercharge your ad
                spend
              </p>
              <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-[#1a0a2e] transition-colors group-hover:bg-white/90">
                Subscribe
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
