import "server-only";
import { promises as fs } from "fs";
import path from "path";

/**
 * Loads a reference design HTML file (design-src/<name>.html) and prepares it for
 * rendering inside the Next.js app:
 *  - extracts the <body> inner HTML
 *  - rewrites relative asset URLs (assets/ css/ js/ site.js) to absolute /paths
 *    served from /public
 *  - rewrites inter-page links (about.html -> /about, index.html -> /, ...)
 *  - collects every <script> (external src + inline) in document order as boot
 *    steps, so the original vanilla-JS behaviours + demo stores run unchanged
 *
 * Navigation stays as full-page <a> loads (the original prototype works that way),
 * which keeps the imperative store scripts re-initialising cleanly per page.
 */

export type BootStep =
  | { type: "src"; url: string }
  | { type: "inline"; code: string };

export interface DesignPage {
  body: string;
  steps: BootStep[];
}

// reference filename -> app route
const PAGE_ROUTES: Record<string, string> = {
  "index.html": "/",
  "scenarios.html": "/scenarios",
  "pricing.html": "/pricing",
  "developers.html": "/developers",
  "about.html": "/about",
  "login.html": "/login",
  "dashboard.html": "/vcc",
  "my-wallet.html": "/my-wallet",
  "team-permissions.html": "/team-permissions",
};

const CARD_ICON_ROUTES: Record<string, string> = {
  "flat/visa.svg": "/assets/card-flat-visa.svg",
  "flat/mastercard.svg": "/assets/card-flat-mastercard.svg",
  "flat/unionpay.svg": "/assets/card-flat-unionpay.svg",
  "flat/amex.svg": "/assets/card-flat-amex.svg",
  "flat/discover.svg": "/assets/card-flat-discover.svg",
  "logo/visa.svg": "/assets/card-logo-visa.svg",
  "logo/mastercard.svg": "/assets/card-logo-mastercard.svg",
};

const AVATAR_ROUTES: Record<string, string> = {
  Felix: "/assets/avatar-felix.svg",
  Aneka: "/assets/avatar-aneka.svg",
  Mason: "/assets/avatar-mason.svg",
  Luna: "/assets/avatar-luna.svg",
  Ryker: "/assets/avatar-ryker.svg",
  Sophia: "/assets/avatar-sophia.svg",
};

function rewriteExternalAssets(text: string): string {
  text = text.replace(
    /https:\/\/unpkg\.com\/lucide@latest(?:\/dist\/umd\/lucide(?:\.min)?\.js)?/g,
    "/js/lucide-local.js"
  );
  text = text.replace(
    /https:\/\/cdn\.jsdelivr\.net\/gh\/aaronfagan\/svg-credit-card-payment-icons@main\/(flat|logo)\/(visa|mastercard|unionpay|amex|discover)\.svg/g,
    (_m, style: string, scheme: string) => CARD_ICON_ROUTES[`${style}/${scheme}.svg`] || _m
  );
  text = text.replace(
    /https:\/\/cdn\.jsdelivr\.net\/gh\/aaronfagan\/svg-credit-card-payment-icons@main\/logo\//g,
    "/assets/card-logo-"
  );
  text = text.replace(
    /https:\/\/api\.dicebear\.com\/9\.x\/avataaars\/svg\?seed=([^&"]+)(?:&amp;|&)backgroundColor=[^"]+/g,
    (_m, seed: string) => AVATAR_ROUTES[seed] || "/assets/avatar-felix.svg"
  );
  return text;
}

function rewriteUrls(html: string): string {
  // local static folders served from /public
  html = html.replace(/(href|src)="(assets|css|js)\//g, '$1="/$2/');
  html = html.replace(/(href|src)="site\.js"/g, '$1="/site.js"');
  html = rewriteExternalAssets(html);
  // inter-page links, with optional #hash / ?query preserved
  for (const [file, route] of Object.entries(PAGE_ROUTES)) {
    const esc = file.replace(".", "\\.");
    html = html.replace(
      new RegExp(`(href|src)="${esc}([#?][^"]*)?"`, "g"),
      (_m, attr, suffix = "") => {
        const tail = suffix ?? "";
        // root route: keep the hash but drop the bare slash duplication
        return `${attr}="${route}${tail}"`;
      }
    );
  }
  return html;
}

function extractScripts(fullHtml: string): { steps: BootStep[] } {
  const steps: BootStep[] = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(fullHtml)) !== null) {
    const attrs = m[1] || "";
    const inline = m[2] || "";
    const srcMatch = attrs.match(/\bsrc="([^"]+)"/i);
    if (srcMatch) {
      let url = rewriteExternalAssets(srcMatch[1]);
      if (/^(https?:)?\/\//i.test(url)) {
        // Other external scripts are intentionally left untouched; preflight
        // catches unexpected runtime CDN dependencies before release.
      } else if (url === "site.js") {
        url = "/site.js";
      } else if (url.startsWith("js/")) {
        url = "/" + url;
      } else if (!url.startsWith("/")) {
        url = "/" + url;
      }
      steps.push({ type: "src", url });
    } else if (inline.trim()) {
      steps.push({ type: "inline", code: rewriteExternalAssets(inline) });
    }
  }
  return { steps };
}

function extractHeadStyles(fullHtml: string): string {
  // page-specific <style> blocks live in <head>; they style classes the shared
  // site.css doesn't define (e.g. .uc-list, scenario layout). Injecting them via
  // innerHTML applies them, so we prepend them to the body markup.
  const head = fullHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const styles = head.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) ?? [];
  return styles.join("\n");
}

export async function loadDesignPage(name: string): Promise<DesignPage> {
  const file = path.join(process.cwd(), "design-src", name);
  const raw = await fs.readFile(file, "utf8");

  const { steps } = extractScripts(raw);
  const headStyles = extractHeadStyles(raw);

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : raw;
  // strip script tags from the injected markup (they run via boot steps instead)
  body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  body = rewriteUrls(body);

  // prepend page-specific head styles so per-page layouts render correctly
  if (headStyles) body = headStyles + "\n" + body;

  return { body, steps };
}
