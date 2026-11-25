#!/usr/bin/env node
// Download a page's raw HTML, CSS and every JS file it can reach (static tags, Next.js RSC
// chunk references, webpack lazy-chunk maps, and script paths referenced inside other JS such
// as lazily injected /vendor/js/*.js), then report animation libraries and extract shaders.
//
// Usage: node fetch-source.mjs <url> [--out <dir>] [--depth 3] [--max 300]
// Output: <dir>/files/<host>/<path>, <dir>/shaders/*.glsl, <dir>/REPORT.md, <dir>/manifest.json
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const pageUrl = args.find((a) => /^https?:\/\//.test(a));
if (!pageUrl) {
  console.error("Usage: node fetch-source.mjs <url> [--out <dir>] [--depth 3] [--max 300]");
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const origin = new URL(pageUrl).origin;
const host = new URL(pageUrl).host;
const OUT = path.resolve(opt("out", path.join("docs", "research", host.replace(/^www\./, ""), "source")));
const MAX_DEPTH = Number(opt("depth", 3));
const MAX_FILES = Number(opt("max", 300));
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const SKIP = /googletagmanager|google-analytics|gtag\/js|facebook\.net|connect\.facebook|hotjar|clarity\.ms|doubleclick|recaptcha|cloudflareinsights|intercom|crisp\.chat|tawk\.to/i;

const LIBS = {
  gsap: /\bgsap\b|GreenSock/,
  ScrollTrigger: /ScrollTrigger/,
  "three.js": /THREE\.|WebGLRenderer|ShaderMaterial/,
  ogl: /\bogl\b|new Renderer\(\{/,
  pixi: /PIXI\./,
  Splitting: /Splitting|splitting/,
  SplitText: /SplitText/,
  Splide: /Splide|splide/,
  Swiper: /Swiper|swiper-/,
  Lenis: /\blenis\b|Lenis/,
  Locomotive: /LocomotiveScroll|data-scroll-container/,
  Barba: /barba/,
  Lottie: /lottie|bodymovin/,
  "framer-motion": /framer-motion|motion\.div|useAnimation/,
  "anime.js": /\banime\(/,
  "Matter.js": /Matter\.Engine/,
};
const SIGNALS = {
  webgl: /getContext\(\s*["'](webgl2?|experimental-webgl)["']/,
  shader: /gl_FragColor|gl_Position|precision (high|medium|low)p/,
  canvas2d: /getContext\(\s*["']2d["']/,
  IntersectionObserver: /IntersectionObserver/,
  requestAnimationFrame: /requestAnimationFrame/,
  scrollListener: /addEventListener\(\s*["']scroll["']/,
  pointerListener: /addEventListener\(\s*["']pointermove|mousemove["']/,
  injectsScripts: /createElement\(\s*["']script["']\)/,
};

const seen = new Map(); // url -> {file, depth, type, size, status}
const queue = [];
const enqueue = (raw, base, depth, type) => {
  let u;
  try {
    u = new URL(raw.replace(/\\\//g, "/"), base);
  } catch {
    return;
  }
  if (!/^https?:$/.test(u.protocol) || SKIP.test(u.href)) return;
  u.hash = "";
  const key = u.href;
  if (seen.has(key) || seen.size + queue.length >= MAX_FILES) return;
  seen.set(key, { depth, type, status: "queued" });
  queue.push(key);
};

const localPath = (u) => {
  const { host: h, pathname, search } = new URL(u);
  let p = decodeURIComponent(pathname);
  if (p.endsWith("/")) p += "index.html";
  if (!path.extname(p)) p += ".html";
  if (search) p = p.replace(/(\.[a-z0-9]+)$/i, `__${search.slice(1).replace(/[^\w.-]/g, "_").slice(0, 40)}$1`);
  return path.join(OUT, "files", h, p);
};

function scanHtml(html, base) {
  for (const m of html.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/i);
    if (href) enqueue(href[1], base, 1, "css");
  }
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) enqueue(m[1], base, 1, "js");
  // Next.js RSC payload / preload hints reference chunks without <script> tags
  for (const m of html.matchAll(/(?:\/_next\/)?static\/(?:chunks|css)\/[^"'\\\s)]+?\.(?:js|css)/g)) {
    const p = m[0].startsWith("/_next/") ? m[0] : `/_next/${m[0]}`;
    enqueue(p, origin, 1, p.endsWith(".css") ? "css" : "js");
  }
}

function scanJs(js, base, depth) {
  // webpack runtime: (({id:"name"})[e]||e)+"."+({id:"hash"})[e]+".js"
  const rt = js.match(/\(\(?\{([^{}]*)\}\)?\[\w+\]\|\|\w+\)\+"\."\+\(?\{([^{}]*)\}\)?\[\w+\]\+"\.js"/);
  if (rt) {
    const parse = (s) => Object.fromEntries([...s.matchAll(/(\d+):"([^"]+)"/g)].map((m) => [m[1], m[2]]));
    const names = parse(rt[1]);
    const hashes = parse(rt[2]);
    const prefix = js.includes("/_next/") || base.includes("/_next/") ? "/_next/static/chunks/" : "/static/chunks/";
    for (const [id, hash] of Object.entries(hashes)) enqueue(`${prefix}${names[id] || id}.${hash}.js`, origin, depth + 1, "js");
  }
  // script paths referenced as strings (lazy loaders, vendor scripts)
  for (const m of js.matchAll(/["'`]((?:https?:\/\/[^"'`\s]+|\/?[\w\-.]+(?:\/[\w\-.@]+)+)\.js)(?:\?[^"'`\s]*)?["'`]/g)) {
    const ref = m[1];
    if (/node_modules|\.min\.js\.map/.test(ref)) continue;
    enqueue(ref.startsWith("http") || ref.startsWith("/") ? ref : `/${ref}`, origin, depth + 1, "js");
  }
}

// Return the full string literal (single, double or template quoted) that contains index i.
function stringAt(src, i) {
  let s = i;
  while (s > 0) {
    const c = src[s];
    if ((c === '"' || c === "'" || c === "`") && src[s - 1] !== "\\") break;
    s--;
  }
  const q = src[s];
  let e = i;
  while (e < src.length) {
    if (src[e] === q && src[e - 1] !== "\\") break;
    e++;
  }
  return { start: s, end: e, text: src.slice(s + 1, e) };
}

function extractShaders(js, name) {
  const out = [];
  let from = 0;
  for (;;) {
    const i = js.slice(from).search(/void main\s*\(/);
    if (i < 0) break;
    const lit = stringAt(js, from + i);
    if (lit.end - lit.start > 40 && lit.end - lit.start < 200000) {
      const decl = js.slice(Math.max(0, lit.start - 60), lit.start).match(/([\w$]+)\s*[=:]\s*$/);
      const text = lit.text.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\'/g, "'");
      out.push({ name: decl ? decl[1] : `${name}-${out.length}`, text });
    }
    from = Math.max(lit.end + 1, from + i + 9);
  }
  return out;
}

async function get(u) {
  const res = await fetch(u, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow" });
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, type: res.headers.get("content-type") || "", buf };
}

const REASONS = {
  ENOTFOUND: "the host does not resolve (check the domain for typos, or try www./another TLD)",
  EAI_AGAIN: "DNS lookup failed (network or DNS problem)",
  ECONNREFUSED: "the server refused the connection",
  ECONNRESET: "the connection was reset",
  ETIMEDOUT: "the connection timed out",
  CERT_HAS_EXPIRED: "the TLS certificate has expired",
};

(async () => {
  let page;
  try {
    page = await get(pageUrl);
  } catch (e) {
    const code = e.cause?.code || e.code;
    console.error(`Could not load ${pageUrl}: ${REASONS[code] || code || e.message}.`);
    console.error("Stop here and ask for a working URL or a saved copy; do not rebuild the site from its name.");
    process.exit(1);
  }
  if (page.status !== 200 && !args.includes("--force")) {
    console.error(`${pageUrl} returned HTTP ${page.status}. Inspect the response before cloning (bot challenge, sign-in, error page); rerun with --force to save it anyway.`);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const html = page.buf.toString("utf8");
  const pageFile = localPath(pageUrl);
  fs.mkdirSync(path.dirname(pageFile), { recursive: true });
  fs.writeFileSync(pageFile, html);
  seen.set(pageUrl, { depth: 0, type: "html", status: page.status, file: pageFile, size: page.buf.length });
  scanHtml(html, pageUrl);

  while (queue.length) {
    const u = queue.shift();
    const meta = seen.get(u);
    try {
      const r = await get(u);
      meta.status = r.status;
      if (r.status !== 200 || /text\/html/.test(r.type)) continue;
      const file = localPath(u);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, r.buf);
      Object.assign(meta, { file, size: r.buf.length });
      if (meta.type === "js" && meta.depth < MAX_DEPTH) scanJs(r.buf.toString("utf8"), u, meta.depth);
    } catch (e) {
      meta.status = `error ${e.message}`;
    }
  }

  const rows = [];
  const shaderDir = path.join(OUT, "shaders");
  let shaderCount = 0;
  for (const [u, m] of seen) {
    if (!m.file || m.type === "html") continue;
    const text = fs.readFileSync(m.file, "utf8");
    const libs = Object.entries(LIBS).filter(([, re]) => re.test(text)).map(([k]) => k);
    const signals = Object.entries(SIGNALS).filter(([, re]) => re.test(text)).map(([k]) => k);
    let shaders = [];
    // Large library bundles (three.js core etc.) carry hundreds of built-in shaders; skip them.
    if (m.type === "js" && SIGNALS.shader.test(text) && m.size < 200 * 1024) {
      shaders = extractShaders(text, path.basename(m.file, ".js"));
      fs.mkdirSync(shaderDir, { recursive: true });
      shaders.forEach((s, i) => {
        fs.writeFileSync(path.join(shaderDir, `${path.basename(m.file, ".js")}__${s.name}__${i}.glsl`), s.text);
      });
      shaderCount += shaders.length;
    }
    rows.push({ url: u, file: path.relative(OUT, m.file), type: m.type, depth: m.depth, size: m.size, libs, signals, shaders: shaders.length });
  }
  const failed = [...seen].filter(([, m]) => m.status !== 200 && m.type !== "html").map(([u, m]) => `${u} (${m.status})`);
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify({ page: pageUrl, files: rows, failed }, null, 1));

  const interesting = rows
    .filter((r) => r.type === "js")
    .sort((a, b) => b.signals.length + b.libs.length - (a.signals.length + a.libs.length));
  const md = [
    `# Source report: ${pageUrl}`,
    "",
    `Downloaded ${rows.length} files (${rows.filter((r) => r.type === "css").length} CSS, ${interesting.length} JS); ${shaderCount} shader strings extracted to \`shaders/\`.`,
    "",
    "Files marked with `injectsScripts` load more code at runtime: open them with find-code.mjs to see what they inject.",
    "Files with app-specific code usually show signals but few/no libraries; pure library bundles show a library and many signals.",
    "",
    "| file | KB | depth | libraries | signals | shaders |",
    "|---|---:|---:|---|---|---:|",
    ...interesting.map((r) => `| ${r.file} | ${Math.round(r.size / 1024)} | ${r.depth} | ${r.libs.join(", ")} | ${r.signals.join(", ")} | ${r.shaders || ""} |`),
    "",
    "## CSS",
    ...rows.filter((r) => r.type === "css").map((r) => `- ${r.file} (${Math.round(r.size / 1024)} KB)`),
    "",
    failed.length ? `## Not downloaded\n${failed.map((f) => `- ${f}`).join("\n")}` : "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "REPORT.md"), md);
  console.log(md);
  console.log(`\nSaved to ${OUT}`);
})();
