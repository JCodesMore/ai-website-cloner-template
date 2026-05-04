import type { Metadata } from "next";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { blogPosts } from "@/data/blog";

const post = blogPosts.find((p) => p.slug === "sea-of-cortez-worlds-aquarium")!;

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `https://bajablue.mx/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    url: `https://bajablue.mx/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.date,
    authors: [post.author],
    images: [{ url: post.image, width: 1200, height: 630, alt: post.imageAlt }],
  },
  other: {
    "article:published_time": post.date,
    "article:modified_time": post.date,
    "article:author": post.author,
    "article:section": "Wildlife",
  },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        Jacques Cousteau called the Sea of Cortez <em>&quot;the world&apos;s aquarium&quot;</em> after filming there in the 1970s. The phrase stuck because it&apos;s factually defensible: this 700-mile-long body of water between the Baja California peninsula and mainland Mexico holds <strong>39% of the world&apos;s marine mammal species</strong> (CONABIO) and over <strong>800 documented fish species</strong>, despite covering less than 0.01% of global ocean surface area.
      </p>
      <p>
        UNESCO inscribed the Islands and Protected Areas of the Gulf of California (the official name) on the World Heritage List in 2005, citing &quot;outstanding natural beauty&quot; and a &quot;virtually intact&quot; marine ecosystem. Here&apos;s what makes it unique — and why the species concentration matters so much for marine science and wildlife observation.
      </p>

      <h2>Why So Much Life in So Small a Space?</h2>
      <p>
        Three geographic and oceanographic factors converge:
      </p>
      <h3>1. A Young Sea with Active Tectonics</h3>
      <p>
        The Sea of Cortez is geologically <strong>only ~5 million years old</strong> — formed when the Baja peninsula split from mainland Mexico along the East Pacific Rise. The seafloor is still actively spreading. This produces deep trenches (over 3,000m), hydrothermal vents, and steep-walled islands rising directly from abyssal depths within sight of shore. The result: nutrient-rich deep water is constantly within reach of sunlit surface layers.
      </p>

      <h3>2. Strong Tidal Mixing</h3>
      <p>
        Tidal ranges in the northern Gulf reach 9 meters — among the highest on Earth. This violent twice-daily exchange forces deep cold nutrients up into the photic zone, fueling massive plankton blooms. Plankton feeds krill. Krill feeds mobula rays, whale sharks, and baleen whales. This is why we see mobula aggregations of 10,000+ individuals between April and June.
      </p>

      <h3>3. A Migration Corridor</h3>
      <p>
        The Gulf functions as a north-south migration funnel. Gray whales calve in the Magdalena Bay lagoons and pass through the southern Gulf. Humpback whales overwinter in the warm waters around Cabo and the Revillagigedo Islands. Mahi-mahi, marlin, and tuna follow the seasonal warm-cold currents. Apex predators — including transient orca pods — follow the prey.
      </p>

      <h2>The Species Roster</h2>
      <h3>Marine Mammals (39% of all species globally)</h3>
      <ul>
        <li><strong>Cetaceans:</strong> Blue whales, fin whales, humpbacks, gray whales, sperm whales, Bryde&apos;s whales, orcas, false killer whales, pilot whales, plus 8+ dolphin species.</li>
        <li><strong>Pinnipeds:</strong> California sea lions (massive colonies at Los Islotes), harbor seals, Guadalupe fur seals.</li>
        <li><strong>Sirenians:</strong> Historically present, now absent.</li>
      </ul>

      <h3>Fish (800+ species)</h3>
      <p>
        Includes 90+ endemic species found nowhere else on Earth. Whale sharks aggregate in La Paz Bay annually. Schooling hammerheads at Las Animas. Massive mobula ray (Mobula munkiana) aggregations south of Cerralvo Island.
      </p>

      <h3>Reptiles, Birds, Invertebrates</h3>
      <p>
        Five sea turtle species (loggerhead, green, hawksbill, leatherback, olive ridley) — all IUCN-listed as endangered or vulnerable. Brown pelicans, blue-footed boobies, magnificent frigatebirds. Over 4,500 documented invertebrate species.
      </p>

      <h2>The Vaquita Tragedy</h2>
      <p>
        Not all the news is good. The <strong>vaquita</strong> — a small porpoise endemic to the northern Gulf of California — is the world&apos;s most endangered marine mammal. Fewer than <strong>10 individuals</strong> remained as of the most recent IUCN assessment, down from ~600 in the 1990s. The cause: bycatch in illegal gillnets set for totoaba, a fish whose swim bladder fetches extreme prices in Asian markets.
      </p>
      <p>
        Bajablue operates exclusively in the <em>southern</em> Gulf, where vaquita are not present. But the broader lesson holds: even the world&apos;s aquarium is not invulnerable to specific, targeted pressures. Visitors can help by choosing small-group outings, respecting wildlife distance, and refusing tours that chase, touch, feed, or harass animals.
      </p>

      <h2>What Cousteau Saw — And What We Still Have</h2>
      <p>
        When Cousteau filmed in the early 1970s, he documented massive schools of fish, healthy coral and rocky reef systems, and abundant top predators. Five decades later, the ecosystem has lost some species (vaquita is the headline) and degraded others, but the southern Gulf remains <strong>one of the few places on Earth where you can witness wild orcas, whales, and mobula ray aggregations in a single day, year after year</strong>.
      </p>
      <p>
        That continuity is rare. Most of the world&apos;s marine megafauna hotspots have collapsed within living memory. The Sea of Cortez has not. Visiting with restraint, keeping respectful distance, and refusing staged wildlife encounters all help keep the experience centered on wild animal behavior.
      </p>

      <h2>How to Visit Responsibly</h2>
      <ul>
        <li><strong>Choose small-group tours that prioritize distance and patience.</strong></li>
        <li><strong>No chasing, crowding, touching, feeding, or forcing encounters.</strong></li>
        <li><strong>Reef-safe sunscreen.</strong> Oxybenzone bleaches coral.</li>
        <li><strong>No feeding, touching, or chasing.</strong> Ever.</li>
        <li><strong>Pack out everything.</strong> Including organic waste — it disrupts island ecosystems.</li>
      </ul>

      <h2>The Bigger Picture</h2>
      <p>
        Cousteau&apos;s &quot;world&apos;s aquarium&quot; phrase has been overused in tourism marketing for fifty years. But it&apos;s not hyperbole. The Sea of Cortez is one of the last places on Earth where a single body of water hosts the full vertical food web — phytoplankton to apex predator — at densities that approximate pre-industrial baselines. Coming here and witnessing it respectfully is not just a vacation. It is a reminder that wild places deserve room to stay wild.
      </p>

      <h2>Sources</h2>
      <ul>
        <li>UNESCO World Heritage Centre, &quot;Islands and Protected Areas of the Gulf of California&quot; — inscription file (2005).</li>
        <li>CONABIO — Comisión Nacional para el Conocimiento y Uso de la Biodiversidad, biodiversity assessments.</li>
        <li>IUCN Red List — vaquita (Phocoena sinus) and sea turtle assessments.</li>
      </ul>
    </BlogPostLayout>
  );
}
