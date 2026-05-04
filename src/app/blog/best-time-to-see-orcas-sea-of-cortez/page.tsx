import type { Metadata } from "next";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { blogPosts } from "@/data/blog";

const post = blogPosts.find((p) => p.slug === "best-time-to-see-orcas-sea-of-cortez")!;

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
        The short answer: <strong>April through June</strong> is Bajablue&apos;s public Master Seafari window in the Sea of Cortez near La Ventana, Baja California Sur. Orcas are opportunistic, not guaranteed, and not limited to two months. If seeing orcas is the single reason you&apos;re booking, plan for more water days and ask the Bajablue team about recent pod activity before choosing dates.
      </p>

      <h2>Why April–June Is the Master Seafari Window</h2>
      <p>
        Orcas move through the southern Sea of Cortez following prey and conditions. Spring brings warmer water, mobula activity, and long search windows around Cerralvo Island, which is why the Master Seafari is built around April through June.
      </p>
      <p>
        The Comisión Nacional para el Conocimiento y Uso de la Biodiversidad (CONABIO) documents that the Sea of Cortez contains over 800 fish species and supports 39% of the world&apos;s marine mammal species, making the spring upwelling here one of the most concentrated marine feeding events in the Pacific.
      </p>

      <h2>Month-by-Month Breakdown</h2>
      <h3>April</h3>
      <p>
        Water temperature climbs and mobula ray aggregations begin forming. Orcas are possible when prey and recent pod activity line up. Calm mornings and lighter winds make longer search days more realistic.
      </p>

      <h3>May</h3>
      <p>
        Water warms and mobula ray schools can build in size. Orcas may pass through, sometimes with active hunting behavior, but every encounter depends on wild animal movement and conditions that week.
      </p>

      <h3>June</h3>
      <p>
        Water keeps warming and mobula activity remains a major draw. Orcas are still possible, then activity can change as prey moves. Wind picks up, so morning departures usually give the best sea state.
      </p>

      <h2>What If You Can&apos;t Come in April–June?</h2>
      <p>
        Orcas can be seen opportunistically outside the public Master Seafari window too, including winter/spring and occasional fall sightings. The trade-off is that sea conditions, prey, and recent pod movement matter a lot. If your priority is general marine wildlife and not specifically orcas, our <strong>Ocean Safari day trip</strong> is the simpler fit for dolphins, mobulas, sea lions, and seasonal whales.
      </p>

      <h2>Which Tour Should I Book for Orca Season?</h2>
      <p>
        For the most patient orca search, we recommend the <a href="/tours/master-seafari">Master Seafari</a>. It&apos;s a 7-day immersive expedition designed for the April–June window, with five water days to respond to weather and recent sightings. The <a href="/tours/blue-expedition">Blue Expedition</a> gives three water days and is a strong runner-up. Single-day Ocean Safaris can still get lucky, but they have less time and range.
      </p>

      <h2>How Far in Advance to Book</h2>
      <ul>
        <li><strong>Master Seafari (April–June):</strong> Book early. We cap groups at 8 guests and the best dates can fill well ahead of the season.</li>
        <li><strong>Blue Expedition (peak season):</strong> Book at least 60 days ahead.</li>
        <li><strong>Ocean Safari (year-round):</strong> 2–3 weeks ahead is usually sufficient outside of peak season.</li>
      </ul>

      <h2>What to Pack Specifically for Orca Encounters</h2>
      <ul>
        <li><strong>3mm shorty wetsuit</strong> — water is comfortable but you&apos;ll spend hours in it (bring your own).</li>
        <li><strong>Polarized sunglasses</strong> — critical for spotting dorsal fins from the boat.</li>
        <li><strong>GoPro with floating wrist strap</strong> — orcas surface unexpectedly close.</li>
        <li><strong>Reef-safe sunscreen</strong> — choose mineral sunscreen and avoid oxybenzone-based formulas near sensitive marine areas.</li>
        <li><strong>Patience.</strong> Orca encounters average 8–14 minutes once a pod is located. The build-up — scanning the horizon, listening on hydrophone — is part of the experience.</li>
      </ul>

      <h2>Wildlife Notice</h2>
      <p>
        Bajablue Tours follows a simple wildlife-first approach: no chasing, no touching, no feeding, and no crowding animals for a closer look. The Sea of Cortez is a UNESCO World Heritage Site and one of the few places globally where wild orca encounters are possible, so every outing is handled with patience and restraint.
      </p>

      <h2>Bottom Line</h2>
      <p>
        If orcas are the dream, choose more water days, stay flexible, and ask the Bajablue team what has been moving recently. The Master Seafari gives the best search window, but the ocean still decides.
      </p>
    </BlogPostLayout>
  );
}
