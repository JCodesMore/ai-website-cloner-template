const fs = require("fs");
const data = JSON.parse(fs.readFileSync("src/data/productDetails.json", "utf-8"));
const p = data.find(x => x.category === "person" && x.id === "88");

console.log("=== RAW DATA ===");
console.log("length:", p.introHtml.length);
console.log("has bbxin.com/storage:", p.introHtml.includes("bbxin.com/storage"));
console.log("has <img:", p.introHtml.includes("<img"));

// Extract the URL
const match = p.introHtml.match(/https?:\/\/[^"'\s]+/);
if (match) {
  console.log("matched URL:", match[0]);
  console.log("URL length:", match[0].length);
}

console.log("\n=== AFTER PREFIX STRIP ===");
const cleaned = p.introHtml.replace(/^(?:rich-text-content"[^>]*>|org-rich-text">|product-intro-wrap">)\s*/, "");
console.log("length:", cleaned.length);
console.log("starts with:", cleaned.substring(0, 50));
console.log("ends with:", cleaned.substring(cleaned.length - 100));
console.log("has bbxin.com/storage:", cleaned.includes("bbxin.com/storage"));

// Test new regex specifically
const newRegex = /https:\/\/www\.bbxin\.com\/storage\/(?:[^"'\s\/]+\/)*([^"'\s\/]+)/g;
const matches = [...cleaned.matchAll(newRegex)];
console.log("\n=== REGEX MATCHES ===");
console.log("number of matches:", matches.length);
for (const m of matches) {
  console.log("  full match:", m[0].substring(0, 80) + "...");
  console.log("  captured filename:", m[1]);
}

console.log("\n=== AFTER REPLACEMENT ===");
const result = cleaned.replace(newRegex, (_, f) => `/images/remote/${f}`);
console.log("length:", result.length);
console.log("has /images/remote:", result.includes("/images/remote"));
console.log("ends with:", result.substring(result.length - 150));
