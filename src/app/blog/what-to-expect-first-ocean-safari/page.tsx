import type { Metadata } from "next";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { blogPosts } from "@/data/blog";

const post = blogPosts.find((p) => p.slug === "what-to-expect-first-ocean-safari")!;

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
    "article:section": "Tours",
  },
};

export default function Page() {
  return (
    <BlogPostLayout post={post}>
      <p>
        First-time visitors to La Ventana ask the same handful of questions about our <strong>Ocean Safari day trip</strong>: What time does it start? Do I need to be a strong swimmer? What if I get seasick? What do I actually wear? This guide answers each one from the way Bajablue runs small, animal-first days on the water.
      </p>

      <h2>The Quick Summary</h2>
      <ul>
        <li><strong>Duration:</strong> ~6 hours total, from boat departure to return.</li>
        <li><strong>Boat:</strong> Small expedition boat with shade when available, max 8 guests.</li>
        <li><strong>Departure:</strong> 7:30 AM from La Ventana beach (we adjust seasonally — confirmed via WhatsApp 24 hours before).</li>
        <li><strong>Return:</strong> Around 1:30 PM.</li>
        <li><strong>Cost:</strong> $3,000 Mexican Pesos per person (group), $12,000 Mexican Pesos for a private boat (1–4 guests).</li>
        <li><strong>Includes:</strong> Marine guide, full snorkel kit with fins, lunch on board, and trip photos or video when conditions allow.</li>
      </ul>

      <h2>The Morning: 6:30 AM – 7:30 AM</h2>
      <p>
        We send a WhatsApp the night before with the exact pickup point on La Ventana beach (it shifts based on tide and which boat we&apos;re launching). Show up <strong>15 minutes early</strong>. Eat a light breakfast — something carb-forward (oatmeal, toast, fruit) is ideal. Avoid heavy dairy or greasy food; both make seasickness worse.
      </p>
      <p>
        Bring: swimsuit (worn), towel, change of clothes for the ride home, reef-safe sunscreen, polarized sunglasses with strap, a hat, and a light long-sleeve rashguard if you have one. We provide snorkeling gear, fins, and life jackets. Please bring your own wetsuit if water temps call for it.
      </p>

      <h2>On the Water: 7:30 AM – 1:30 PM</h2>
      <h3>The Crossing (~30–60 min)</h3>
      <p>
        We head east toward Cerralvo Island, the southernmost island in the Sea of Cortez. The crossing takes 30 minutes on calm days, up to an hour with chop. The crew will scan continuously — you&apos;ll learn quickly that 80% of wildlife spotting is patient horizon-watching. Bring your sunglasses and lean into the rhythm.
      </p>

      <h3>First Encounter</h3>
      <p>
        Year-round we may encounter <strong>bottlenose dolphins</strong>, sea lions, mobula rays, and other Sea of Cortez wildlife. Cooler months bring more whale activity, spring and summer build mobula aggregations, and orcas are opportunistic when prey and recent pod movement line up. Timing varies by conditions.
      </p>

      <h3>The Snorkel Drop</h3>
      <p>
        When the crew finds a stable mobula school or a curious dolphin pod, they&apos;ll position the boat <strong>upcurrent and at distance</strong>, then signal you to slip in quietly — no jumps, no splashes. You drift toward the animals, never chasing. This is the part most first-timers misunderstand: the goal is not to swim hard, it&apos;s to float, breathe slow, and let the wildlife approach.
      </p>
      <p>
        Most encounters last 8–20 minutes per drop. Expect 2–4 drops over a typical day depending on conditions and what we find.
      </p>

      <h3>Lunch on Board</h3>
      <p>
        Around 11:30 AM we anchor in a calm bay (often the lee side of Cerralvo) and serve a fresh lunch — local fish, fresh fruit, salsa, tortillas, and water/electrolytes. This is also the most common moment for spontaneous wildlife encounters: dolphins frequently approach the anchored boat to bow-ride.
      </p>

      <h2>What If I&apos;m Not a Strong Swimmer?</h2>
      <p>
        You don&apos;t need to be. Every guest wears a flotation vest unless they specifically opt out. The drops are passive drifts, not active swims. We&apos;ve had guests who hadn&apos;t snorkeled in 20 years — and 8-year-olds — complete the trip happily. If you&apos;re anxious about water: tell us when booking, and we&apos;ll pair you with the guide one-on-one for the first drop.
      </p>
      <p>
        That said, you should be comfortable getting <strong>face-down in the water with your face submerged</strong> for at least 30 seconds. If that triggers panic, the snorkel won&apos;t help. We recommend practicing in a hotel pool the day before.
      </p>

      <h2>What If I Get Seasick?</h2>
      <p>
        Seasickness is common enough that it is worth planning for. Mitigation strategies that usually help:
      </p>
      <ol>
        <li><strong>Take Bonine (meclizine) the night before AND morning of</strong> — not just morning of. It needs ~12 hours to bind effectively.</li>
        <li><strong>Stay hydrated</strong> and eat small amounts of bland food throughout the day.</li>
        <li><strong>Look at the horizon, not at your phone or feet</strong>. Reading or screens trigger nausea fast.</li>
        <li><strong>Get in the water at the first sign of nausea</strong> — being submerged eliminates the visual conflict that causes seasickness.</li>
      </ol>

      <h2>The Wildlife Brief</h2>
      <p>
        Before any wildlife approach, the guide will explain the day&apos;s ground rules: no chasing, no touching, no feeding, no crowding, and no pressure to force an encounter. The goal is to watch wild behavior unfold naturally and leave the animals room to choose their own path.
      </p>

      <h2>Will I See Whales / Orcas / [specific animal]?</h2>
      <p>
        Honest answer: we don&apos;t guarantee specific sightings because we don&apos;t bait, chase, or stage encounters. What we <strong>do</strong> guarantee is 6 hours on the water in one of the most concentrated marine ecosystems on Earth, with a guide and local crew who know the seasonal patterns and adjust the route to the day&apos;s conditions.
      </p>

      <h2>After the Trip</h2>
      <p>
        When photo or video files are captured during the trip, we&apos;ll send them via WeTransfer after the tour. The files are yours to use freely.
      </p>

      <h2>Booking</h2>
      <p>
        WhatsApp is the fastest channel — typical response within 2 hours during business hours (8am–7pm Mexico City time, 7 days a week). Tell us your dates, group size, and any swimming/health concerns. We&apos;ll confirm availability and send a 60% deposit invoice. Final payment due day-of in cash or transfer.
      </p>
    </BlogPostLayout>
  );
}
