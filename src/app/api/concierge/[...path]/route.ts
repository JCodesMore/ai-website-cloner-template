import { NextRequest } from "next/server";

/**
 * Same-origin proxy for the Baja Swarm Bubbles concierge widget.
 *
 * The bot server at https://ai-studio.tail50dc5a.ts.net responds to OPTIONS
 * preflights with HTTP 400 and no Access-Control-Allow-Origin header, so
 * browsers block any cross-origin POST from bajablue.mx → the chat fails
 * with "Couldn't reach the concierge."
 *
 * The widget supports overriding its API base via the `data-api` attribute
 * on the script tag. We point it at /api/concierge here, and this handler
 * forwards every request (and its body, query string, and any cookies the
 * widget sets) to the upstream bot. Same origin from the browser's POV →
 * no preflight needed → no CORS errors.
 */

export const runtime = "edge";

const UPSTREAM = process.env.BAJASWARM_BOT_URL || "https://ai-studio.tail50dc5a.ts.net";

// Headers that should NOT be forwarded — they're hop-by-hop or contain the
// caller's identity rather than the request's intent.
const STRIP_REQ_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-real-ip",
  "x-vercel-deployment-url",
  "x-vercel-forwarded-for",
  "x-vercel-id",
  "x-vercel-ip-country",
  "x-vercel-ip-city",
  "x-vercel-ip-country-region",
  "x-vercel-ip-latitude",
  "x-vercel-ip-longitude",
  "x-vercel-ip-timezone",
  "x-vercel-proxy-signature",
  "x-vercel-proxy-signature-ts",
]);

const STRIP_RES_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
]);

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search;
  const target = `${UPSTREAM}/${path.join("/")}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!STRIP_REQ_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = req.body;
    // Edge runtime requires duplex when streaming a request body
    (init as RequestInit & { duplex: string }).duplex = "half";
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(target, init);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "upstream_unreachable", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }

  const resHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    if (!STRIP_RES_HEADERS.has(key.toLowerCase())) resHeaders.set(key, value);
  });

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: resHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
