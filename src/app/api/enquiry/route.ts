import { after, type NextRequest } from "next/server";
import { sessionOrigin } from "@/lib/server/analytics";
import { createEnquiry, markEmailSent, sendEnquiryEmail, type EnquiryInput } from "@/lib/server/enquiries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 5 enquiries per IP per 10 minutes (per server process).
const WINDOW_MS = 10 * 60 * 1000;
const globalForLimit = globalThis as unknown as { enquiryHits?: Map<string, number[]> };
const hits = (globalForLimit.enquiryHits ??= new Map<string, number[]>());

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const get = (k: string, max = 200) => (typeof body[k] === "string" ? (body[k] as string).trim().slice(0, max) : "");

  // Honeypot field, hidden from people; bots fill it in.
  if (get("website")) return Response.json({ ok: true });

  const name = get("name", 120);
  const email = get("email", 200);
  if (!name || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Please enter your name and a valid email address." }, { status: 422 });
  }

  const h = request.headers;
  const ip = h.get("cf-connecting-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  if (limited(ip || "unknown")) {
    return Response.json({ ok: false, error: "Too many enquiries from this connection. Please try again later." }, { status: 429 });
  }

  let origin = { visitor: null as string | null, source: "", referrer: "", landingPage: "" };
  try {
    origin = sessionOrigin(ip, h.get("user-agent") ?? "");
  } catch {}
  const input: EnquiryInput = {
    name,
    email,
    telephone: get("telephone", 60),
    country: get("country", 80),
    arrival: get("arrival", 40),
    departure: get("departure", 40),
    adults: get("adults", 20),
    children: get("children", 120),
    hotel: get("hotel", 80),
    message: get("message", 2000),
    page: get("page", 300),
    visitor_id: origin.visitor,
    source: origin.source,
    referrer: origin.referrer,
    landing_page: origin.landingPage,
  };
  // Without a database the enquiry is still emailed, just not stored.
  let id: number | null = null;
  try {
    id = createEnquiry(input);
  } catch (err) {
    console.warn("[enquiry] database unavailable, email only:", err);
  }
  after(async () => {
    if ((await sendEnquiryEmail(id, input)) && id !== null) markEmailSent(id);
  });
  return Response.json({ ok: true });
}
