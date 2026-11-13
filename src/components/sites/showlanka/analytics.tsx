"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends one pageview per route change to /api/track (cookieless; see lib/server/analytics.ts). */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      path: pathname,
      // document.referrer keeps the original referrer after client-side navigations.
      referrer: first.current ? document.referrer : "",
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
    });
    first.current = false;
    const sent = navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }));
    if (!sent) void fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
