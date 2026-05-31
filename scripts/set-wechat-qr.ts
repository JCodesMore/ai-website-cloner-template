import "dotenv/config";
import { db, schema } from "../src/lib/db";

async function main() {
  await db.insert(schema.settings).values({
    key: "wechat_qr_url",
    value: "/images/wechat-qr.jpg",
  }).onConflictDoUpdate({
    target: schema.settings.key,
    set: { value: "/images/wechat-qr.jpg" },
  });
  console.log("[settings] wechat_qr_url = /images/wechat-qr.jpg");
  process.exit(0);
}

main();
