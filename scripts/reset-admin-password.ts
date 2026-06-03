/**
 * Reset admin user password. Run with: npx tsx scripts/reset-admin-password.ts
 */
import "dotenv/config";
import { db, schema } from "../src/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword } from "../src/lib/crypto";

const username = process.env.ADMIN_USERNAME || "admin";
const newPassword = process.env.ADMIN_PASSWORD;

if (!newPassword) {
  console.error("ADMIN_PASSWORD not set in .env");
  process.exit(1);
}

async function main() {
  const rows = await db.select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.username, username));

  if (rows.length === 0) {
    console.log(`Admin user '${username}' not found. Creating...`);
    await db.insert(schema.users).values({
      username,
      password: hashPassword(newPassword),
      role: "admin",
    });
  } else {
    await db.update(schema.users)
      .set({ password: hashPassword(newPassword) })
      .where(eq(schema.users.username, username));
  }

  console.log(`Password updated for admin user '${username}'.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
