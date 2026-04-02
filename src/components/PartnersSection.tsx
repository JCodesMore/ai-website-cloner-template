"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Partner {
  name: string;
  logo: string;
  popupLogo: string;
  category: string;
  promoCode: string;
  promoDescription: string;
  bonusUrl: string;
}

const partners: Partner[] = [
  {
    name: "Octo Browser",
    logo: "/images/partners/octobrowser-1.png",
    popupLogo: "/images/partners/octobrowser-2.png",
    category: "Tools",
    promoCode: "LEADINGCARDS30",
    promoDescription: "30% off your first purchase of any subscription",
    bonusUrl: "https://octobrowser.net/",
  },
  {
    name: "Dolphin Anty",
    logo: "/images/partners/dolphin-logo.png",
    popupLogo: "/images/partners/dolphin-popup-logo.png",
    category: "Tools",
    promoCode: "Leadingcards",
    promoDescription: "Get 20% off",
    bonusUrl: "https://dolphin-anty.com/",
  },
  {
    name: "AdsPower",
    logo: "/images/partners/adspower-logo.png",
    popupLogo: "/images/partners/adspower-popup-logo.png",
    category: "Tools",
    promoCode: "Leadingcards",
    promoDescription: "Discount tiers available",
    bonusUrl: "https://www.adspower.com/",
  },
  {
    name: "Mostbet Partners",
    logo: "/images/partners/mostbet-logo.png",
    popupLogo: "/images/partners/mostbet-popup-logo.png",
    category: "Affiliate Network",
    promoCode: "leadingcards",
    promoDescription: "200 bonus points",
    bonusUrl: "https://mostbet-partners.com/",
  },
  {
    name: "ADxAD",
    logo: "/images/partners/adxad-logo.png",
    popupLogo: "/images/partners/adxad-popup-logo.png",
    category: "Traffic Source",
    promoCode: "LEADINGCARDS5",
    promoDescription: "5% bonus on first deposit of $1000+",
    bonusUrl: "https://adxad.com/",
  },
  {
    name: "Everad",
    logo: "/images/partners/everad-logo.png",
    popupLogo: "/images/partners/everad-popup-logo.png",
    category: "Affiliate Network",
    promoCode: "Hi! I'm from Leading Cards",
    promoDescription: "+5$ for best offers",
    bonusUrl: "https://everad.com/",
  },
  {
    name: "ClickAdilla",
    logo: "/images/partners/clickadilla-logo.png",
    popupLogo: "/images/partners/clickadilla-popup-logo.png",
    category: "Traffic Source",
    promoCode: "LEADINGCARDS20",
    promoDescription: "$20 bonus first deposit from $150",
    bonusUrl: "https://clickadilla.com/",
  },
  {
    name: "Admobispy",
    logo: "/images/partners/admobispy-logo.png",
    popupLogo: "/images/partners/admobispy-popup-logo.png",
    category: "Tools",
    promoCode: "LeadingCards",
    promoDescription: "-30% OFF",
    bonusUrl: "https://admobispy.com/",
  },
  {
    name: "PrimeAds",
    logo: "/images/partners/primeads-logo.png",
    popupLogo: "/images/partners/primeads-popup-logo.png",
    category: "Affiliate Network",
    promoCode: "LeadingCards",
    promoDescription: "+25% commission",
    bonusUrl: "https://primeads.com/",
  },
];

function PartnerModal({
  partner,
  onClose,
}: {
  partner: Partner;
  onClose: () => void;
}) {
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: "#1804257a" }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${partner.name} partner details`}
    >
      <div
        className="relative w-full overflow-y-auto bg-white"
        style={{
          borderRadius: "1.5rem",
          maxWidth: "80rem",
          padding: "3.75rem",
          maxHeight: "80dvh",
          margin: "1rem",
        }}
      >
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={partner.popupLogo}
              alt={partner.name}
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
            <div>
              <h3
                className="text-xl font-bold"
                style={{ color: "#151c28" }}
              >
                {partner.name}
              </h3>
              <span
                className="text-sm"
                style={{ color: "#4d5e80" }}
              >
                {partner.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-70"
            aria-label="Close modal"
          >
            <Image
              src="/images/close.webp"
              alt="Close"
              width={32}
              height={32}
            />
          </button>
        </div>

        {/* Content */}
        <div className="mb-8">
          <p style={{ color: "#4d5e80", lineHeight: 1.6 }}>
            {partner.promoDescription}
          </p>
        </div>

        {/* CTA Area */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Promo Code */}
          <div>
            <span
              className="mb-1 block text-sm font-medium"
              style={{ color: "#4d5e80" }}
            >
              Promo code
            </span>
            <div
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2"
              style={{
                borderColor: "#e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <code
                className="text-sm font-semibold"
                style={{ color: "#151c28" }}
              >
                {partner.promoCode}
              </code>
            </div>
          </div>

          {/* Get Bonus Button */}
          <a
            href={partner.bonusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background:
                "linear-gradient(180deg, #33c19b 0%, #1ea47e 100%)",
              boxShadow:
                "0 1px 2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            Get bonus
          </a>
        </div>
      </div>
    </div>
  );
}

export function PartnersSection() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  return (
    <>
      <section
        className="px-6"
        style={{
          backgroundColor: "#f7f7f7",
          paddingBlock: "clamp(3rem, 2rem + 4vw, 6rem)",
        }}
      >
        <div className="mx-auto max-w-[67rem]">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2
              className="mx-auto mb-4 font-bold tracking-[-0.01em]"
              style={{
                fontSize:
                  "clamp(1.75rem, 1.1338rem + 2.6291vw, 3.5rem)",
                lineHeight: 1.2,
                color: "#151c28",
              }}
            >
              Our charging solutions come from trusted partners
            </h2>
            <p
              className="mx-auto max-w-[40rem]"
              style={{
                fontSize:
                  "clamp(1rem, 0.912rem + 0.3756vw, 1.25rem)",
                color: "#4d5e80",
                lineHeight: 1.5,
              }}
            >
              LeadingCards clients get more — our partners have lined up sweet
              deals for you. Trusted by the best in the niche!
            </p>
          </div>

          {/* Partners Grid */}
          <div className="mb-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <button
                key={partner.name}
                onClick={() => setSelectedPartner(partner)}
                className="flex cursor-pointer items-center justify-center rounded-lg p-6 transition-colors duration-300"
                style={{
                  backgroundColor: "#f0f0f0",
                  aspectRatio: "16 / 10",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#a9e5dc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f0f0";
                }}
                aria-label={`View ${partner.name} partner details`}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={60}
                  className="h-auto max-h-[3rem] w-auto max-w-[10rem] object-contain"
                />
              </button>
            ))}
          </div>

          {/* More Partners Button */}
          <div className="flex justify-center">
            <Link
              href="/partner"
              className="inline-flex items-center justify-center rounded-xl border px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #333 0%, #222 100%)",
                borderColor: "#444",
              }}
            >
              More Partners
            </Link>
          </div>
        </div>
      </section>

      {/* Partner Modal */}
      {selectedPartner && (
        <PartnerModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
        />
      )}
    </>
  );
}
