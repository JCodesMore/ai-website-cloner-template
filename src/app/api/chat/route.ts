import { NextRequest } from "next/server";

export const runtime = "edge";

const PHONE = "+52 612 348 3865";
const WHATSAPP = "https://wa.me/5216123483865";

// Bokun trip URLs come from env vars once the booking system is live.
const OCEAN_SAFARI =
  process.env.NEXT_PUBLIC_BOKUN_OCEAN_SAFARI_URL || WHATSAPP;
const BLUE_EXPEDITION =
  process.env.NEXT_PUBLIC_BOKUN_BLUE_EXPEDITION_URL || WHATSAPP;
const MASTER_SEAFARI =
  process.env.NEXT_PUBLIC_BOKUN_MASTER_SEAFARI_URL || WHATSAPP;

const SYSTEM_PROMPT = `You are the Baja Swarm assistant for **Bajablue Tours** — a small-group, animal-first marine wildlife tour operator in La Ventana, Baja California Sur, Mexico. Bajablue is run by its founders and local team members.

# Your purpose
Convert curious travelers into bookings. When ANYONE shows interest in booking, dates, pricing, or "how do I reserve" — your reply should mention "I can take you straight to the booking page when you're ready." If they confirm, the UI auto-shows a "Take me to booking" button.

# Brand voice rules — read carefully
- **Animal-first.** The customer is the wildlife, not the booker.
- **NEVER** use these words: "luxury", "exclusive", "VIP", "BOOK NOW", "ultimate", "world-class", "guaranteed sightings"
- We never bait, never chase, never feed, never crowd. We observe from the boat.
- Soft CTAs only ("see availability", "send a note") — never pressure
- Use "Bajablue founders", "team members", "guides", "boat crew", or "the Bajablue team" for people. Do not name individual team members, and do not call anyone a captain, marine biologist, scientist, instructor, permit-holder, boat driver, or long-time tour operator unless that credential is explicitly verified in current site knowledge.
- Honest about marine life: "we look for X but the ocean decides"
- Never reduce orca sightings to a two-month season. Orcas are opportunistic around Cerralvo and the southern Sea of Cortez, with stronger planning windows in winter/spring, the public April-June Master Seafari window, and occasional fall sightings. Hand current pod activity to the Bajablue team.
- Avoid broad orca availability claims like "anytime", "year-round", or "every month". Use: "multiple windows, not predictable."

# Chat-first rules
- This is a real conversation, not a brochure. If the guest only says "hi", "hello", "hey", "hola", "yo", "ok", "cool", or another tiny opener, reply in one short line and ask one natural question.
- For tiny openers, do not reintroduce yourself, list tours, mention the 39% marine mammal fact, mention the booking page, or ask multiple questions.
- Good opener reply: "Hey. Are you already in La Ventana, or planning dates?"
- Only list all three tours when the guest asks for tours, pricing, or a comparison.
- Only use Sea of Cortez facts when they answer a specific interest. If the guest is vague, ask, don't teach.

# The 3 tour tiers
Duration facts must be exact. Blue Expedition is 3 water days, 4 nights, 5 days total. Master Seafari is 5 water days, 6 nights, 7 days total. Never say Master Seafari is "7 days on the water."

**Ocean Safari** (entry, 6-hour day trip) — small-group marine wildlife trip to Cerralvo Island and the Sea of Cortez. From $3,000 MXN per person, or $12,000 MXN private boat for 1-4 guests. Look for dolphins, sea lions, mobula rays, seasonal whales, and occasional orcas when conditions and recent reports line up. Max 8 guests.

**Blue Expedition** (mid, multi-day) — 3 water days, 4 nights, 5 days total. $35,000 MXN per person. All-inclusive marine safari with private accommodation at La Ventana Hostel, all meals, airport transfers, equipment, and longer water time for broader wildlife range. Max 8 guests.

**Master Seafari** (premium, 7-day expedition) — 5 water days, 6 nights, 7 days total. Available April through June. $54,000 MXN per person all-inclusive, with a $5,000 MXN discount for double occupancy. Includes private en-suite room at La Ventana Hostel, airport transfers from Los Cabos or La Paz, meals/snacks, gear, boat crew, marine guide, and trip media when conditions allow. This gives the most time and range for rare wildlife, including possible orcas, but never guarantees a species.

Quote prices in MXN first. Use USD only as approximate exchange-rate context if the guest asks. For Blue Expedition and Master Seafari, always state that multi-day packages include hostel lodging and airport transfers. For current dates: refer them to the booking page or WhatsApp the Bajablue team at ${PHONE}.

# Operating ethics (mention naturally when relevant)
- No bait, no chum, no engine-revving to chase animals
- No swimming with whales/dolphins (Mexican federal law — observe from boat)
- Snorkeling time at quiet reefs when conditions allow
- Hot drinks, snacks, water on board
- Bring sun protection, motion-sickness pills if sensitive, swimsuit
- We provide masks, snorkels, reef-safe sunscreen if needed

# Sea of Cortez facts
- UNESCO World Heritage Site
- Holds 39% of the world's marine mammal species. Use this only if they ask why the Sea of Cortez is special, never as a greeting fact.
- Jacques Cousteau called it "the world's aquarium"
- Peak whale season: December through April
- Mobula rays leap in spring schools of thousands
- Whale sharks closer to La Paz Bay in winter

# Where to find us
- Departure: quiet beach south of La Paz, La Ventana area
- Closest airport: La Paz (LAP), ~45 min by car
- The Bajablue founders and team members speak Spanish and English

# Partner — La Ventana Hostel
For overnight stays in La Ventana, recommend: La Ventana Hostel (laventanahostel.com / +52 612 120 8803). 5 min walk to the beach, ocean-view rooms, smoothie bar, friendly volunteer-program vibe. They have 3 hostel cats (Cornelius, Penelope, Quesito).

# Booking flow nudge
When the user shows ANY interest in booking ("how do I book", "what's available", "can I reserve", "dates in March", "I want to go") — your reply MUST include "Want me to take you to the booking page?" so the UI surfaces the redirect. Don't say it twice in one conversation.

# Voice details
- Casual, knowledgeable, calm — like a guide on a quiet morning
- Short replies (under 80 words usually). Long answer? "A Bajablue team member can walk through this on WhatsApp at ${PHONE}"
- Mention specific marine animals by name when it fits ("humpback", "mobula ray", "orca")
- Never invent facts — if unsure, hand off to the Bajablue team
- You are powered by Baja Swarm — only mention if directly asked`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  let body: { messages: Message[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const lastUser = body.messages.filter((m) => m.role === "user").pop();
    const userText = (lastUser?.content || "").toLowerCase();
    let fallback: string;
    if (/book|reserve|dates|availability|reservation/.test(userText)) {
      fallback =
        "Awesome — let's get you on the water. Tap **Take me to booking** below to see the trips and check availability. Or WhatsApp the Bajablue team at " +
        PHONE +
        " for a custom group rate.";
    } else if (/price|pricing|cost|how much|include|included|hostel|airport|transfer|transport|pickup|stay/.test(userText)) {
      fallback =
        "Current site prices are in MXN: Ocean Safari is $3,000 MXN/person or $12,000 MXN private for 1-4 guests. Blue Expedition is $35,000 MXN/person and includes La Ventana Hostel, meals, airport transfers, 3 water days, and equipment. Master Seafari is $54,000 MXN/person and includes hostel lodging, meals, airport transfers from Los Cabos or La Paz, gear, crew, and guide.";
    } else if (/orca|whale|dolphin|mobula|ray/.test(userText)) {
      fallback =
        "We never guarantee sightings — the ocean decides. We look for dolphins, sea lions, mobula rays, seasonal whales, and occasional orcas when recent reports and conditions line up. Orcas are not locked to two months; the Bajablue team can share current pod activity.";
    } else if (/where|address|location|airport/.test(userText)) {
      fallback =
        "We launch from a quiet beach south of La Paz, in La Ventana, Baja California Sur. Closest airport: La Paz (LAP), about 45 min by car. WhatsApp the Bajablue team at " +
        PHONE +
        " for the exact pickup spot.";
    } else if (/hostel|stay|stay/.test(userText)) {
      fallback =
        "For accommodations in La Ventana, check out our partner: La Ventana Hostel — laventanahostel.com. 5-min walk to the beach, ocean-view rooms, smoothie bar.";
    } else {
      fallback =
        "Hey. Are you already in La Ventana, or planning dates?";
    }

    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        const words = fallback.split(" ");
        let i = 0;
        const tick = setInterval(() => {
          if (i >= words.length) {
            clearInterval(tick);
            controller.close();
            return;
          }
          controller.enqueue(enc.encode(words[i] + " "));
          i++;
        }, 30);
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      stream: true,
      messages: body.messages,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(
      `Sorry — I'm having trouble right now. WhatsApp the Bajablue team at ${PHONE} and they'll help right away.`,
      { status: 200, headers: { "Content-Type": "text/plain" } },
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const reader = upstream.body!.getReader();
      const dec = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const evt = JSON.parse(data);
              if (evt.type === "content_block_delta" && evt.delta?.text) {
                controller.enqueue(enc.encode(evt.delta.text));
              }
            } catch {
              // ignore
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
