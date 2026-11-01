// Prints an ADMIN_PASSWORD_HASH line for .env.local.
// Usage: node scripts/hash-admin-password.mjs "new password"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "new password"');
  process.exit(1);
}
const salt = randomBytes(16).toString("hex");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`);
