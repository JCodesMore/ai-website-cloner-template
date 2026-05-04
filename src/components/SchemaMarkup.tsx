import { siteConfig, tours, faqs } from "@/data/site";

// LocalBusiness + TourOperator schema
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TouristAttraction"],
    "@id": "https://bajablue.mx/#business",
    name: siteConfig.name,
    alternateName: "Bajablue",
    description: "Small-group marine megafauna expeditions in the Sea of Cortez. Swim with mobula rays and dolphins, and observe orcas and whales from La Ventana, Baja California Sur, Mexico.",
    url: "https://bajablue.mx",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: "https://bajablue.mx/images/og-image.jpg",
    logo: "https://bajablue.mx/images/logo.png",
    priceRange: "$$$",
    currenciesAccepted: "MXN, USD",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      postalCode: siteConfig.zip,
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.05,
      longitude: -109.98,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 24.05,
        longitude: -109.98,
      },
      geoRadius: "100000",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "19:00",
    },
    sameAs: [
      siteConfig.instagramUrl,
      siteConfig.facebookUrl,
      siteConfig.youtubeUrl,
    ].filter(Boolean),
    founder: {
      "@type": "Organization",
      "@id": "https://bajablue.mx/#founding-team",
      name: "Bajablue founding team",
      url: "https://bajablue.mx/about",
    },
    foundingDate: "2025",
    knowsLanguage: ["en", "es"],
    slogan: siteConfig.tagline,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marine Expeditions",
      itemListElement: tours.map((tour, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: tour.name,
          description: tour.description,
          touristType: "Adventure travelers, Marine wildlife enthusiasts",
        },
        price: tour.pricePerPerson.replace(/[^0-9]/g, "") || undefined,
        priceCurrency: tour.priceCurrency,
        position: i + 1,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite schema with SearchAction
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://bajablue.mx/#website",
    name: siteConfig.name,
    url: "https://bajablue.mx",
    description: "Small-group marine megafauna expeditions in the Sea of Cortez from La Ventana, Mexico.",
    publisher: {
      "@id": "https://bajablue.mx/#business",
    },
    inLanguage: "en",
    // F25: SearchAction (using Google Programmable Search fallback URL pattern)
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.google.com/search?q=site%3Abajablue.mx+{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// LocalBusiness reference schema (lightweight, for non-homepage pages — F33)
export function LocalBusinessRefSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://bajablue.mx/#business",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ItemList schema for tour carousel rich result (F29)
export function ToursItemListSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bajablue Tours Marine Expeditions",
    itemListElement: tours.map((tour, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://bajablue.mx/tours/${tour.slug}`,
      name: tour.name,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Event schema for seasonal tours (F30)
export function SeasonalEventSchema({
  name,
  startDate,
  endDate,
  description,
  url,
}: {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    startDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description,
    url,
    location: {
      "@type": "Place",
      name: "Sea of Cortez near Cerralvo Island",
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressRegion: siteConfig.state,
        addressCountry: "MX",
      },
    },
    organizer: {
      "@id": "https://bajablue.mx/#business",
    },
    offers: {
      "@type": "Offer",
      url,
      availability: "https://schema.org/InStock",
      priceCurrency: "MXN",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ImageGallery schema (F32)
export function ImageGallerySchema({
  images,
}: {
  images: { src: string; alt: string; caption?: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Bajablue Tours — Sea of Cortez Marine Wildlife Gallery",
    description: "Marine wildlife photography from Bajablue Tours expeditions in the Sea of Cortez.",
    image: images.map((img, i) => ({
      "@type": "ImageObject",
      "@id": `https://bajablue.mx/gallery#image-${i + 1}`,
      contentUrl: `https://bajablue.mx${img.src}`,
      url: `https://bajablue.mx${img.src}`,
      name: img.alt,
      caption: img.caption ?? img.alt,
      creditText: "Bajablue Tours",
      copyrightHolder: { "@id": "https://bajablue.mx/#business" },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Tour/Product schema for individual tour pages
export function TourSchema({ tour }: { tour: typeof tours[0] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.description,
    touristType: "Adventure travelers, Marine wildlife enthusiasts, Ocean travelers",
    provider: {
      "@id": "https://bajablue.mx/#business",
    },
    offers: {
      "@type": "Offer",
      price: tour.pricePerPerson.replace(/[^0-9]/g, "") || undefined,
      priceCurrency: tour.priceCurrency,
      availability: "https://schema.org/InStock",
      url: `https://bajablue.mx/tours/${tour.slug}`,
      validFrom: "2025-01-01",
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.includes.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item,
      })),
    },
    subjectOf: {
      "@type": "CreativeWork",
      name: `${tour.name} — Bajablue Tours`,
      url: `https://bajablue.mx/tours/${tour.slug}`,
    },
    image: `https://bajablue.mx${tour.image}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQPage schema
export function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList schema
export function BreadcrumbSchema({ items }: { items: { name: string; href: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `https://bajablue.mx${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Organization schema
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://bajablue.mx/#organization",
    name: siteConfig.name,
    url: "https://bajablue.mx",
    logo: "https://bajablue.mx/images/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "reservations",
      availableLanguage: ["English", "Spanish"],
    },
    sameAs: [
      siteConfig.instagramUrl,
      siteConfig.facebookUrl,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
