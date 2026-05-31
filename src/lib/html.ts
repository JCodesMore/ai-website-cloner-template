import DOMPurify from "isomorphic-dompurify";

/** Rewrite remote storage URLs to local /images/remote/ paths */
function rewriteImageUrls(html: string): string {
  return html.replace(
    /https:\/\/www\.yinmaiquan.com\/storage\/(?:[^"'\s\/]+\/)*([^"'\s\/]+)/g,
    (_, filename) => `/images/remote/${filename}`
  );
}

/** Strip known scraping-artifact prefixes, rewrite remote images, and sanitize against XSS. */
export function cleanHtml(html: string): string {
  const cleaned = html.replace(/^(?:rich-text-content"[^>]*>|org-rich-text">|product-intro-wrap">)\s*/, "");
  return DOMPurify.sanitize(rewriteImageUrls(cleaned));
}
