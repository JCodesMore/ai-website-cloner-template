import { readFileSync } from 'fs';
import DOMPurify from 'isomorphic-dompurify';

const data = JSON.parse(readFileSync('src/data/productDetails.json', 'utf-8'));

// Person/88
const p = data.find(x => x.category === 'person' && x.id === '88');
if (!p) { console.log('person/88 not found'); process.exit(1); }

function rewriteImageUrls(html) {
  return html.replace(
    /https:\/\/www\.bbxin\.com\/storage\/[^"'\s]+(?:\/[^"'\s]+)?\/([^"'\s\/]+)/g,
    (_, filename) => `/images/remote/${filename}`
  );
}

function cleanHtml(html) {
  const cleaned = html.replace(/^(?:rich-text-content"[^>]*>|org-rich-text">|product-intro-wrap">)\s*/, "");
  return DOMPurify.sanitize(rewriteImageUrls(cleaned));
}

console.log('=== Raw (first 300 chars) ===');
console.log(JSON.stringify(p.introHtml.substring(0, 300)));

const result = cleanHtml(p.introHtml);
console.log('\n=== After cleanHtml ===');
console.log(result);
console.log('\nhas img:', result.includes('<img'));
