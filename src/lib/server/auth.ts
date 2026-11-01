import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";

// Credentials come from the environment (.env.local), never from source:
//   ADMIN_USERNAME, ADMIN_PASSWORD_HASH ("scrypt:<salt hex>:<key hex>"), ADMIN_SESSION_SECRET
// Generate a hash with:  node scripts/hash-admin-password.mjs "<password>"

export const SESSION_COOKIE = "sl_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET ?? "";
  return s.length >= 32 ? s : null;
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && secret());
}

const sign = (value: string, key: string) => createHmac("sha256", key).update(value).digest("base64url");

/** Constant-time string comparison (both sides hashed to the same length first). */
function sameString(a: string, b: string) {
  const key = "compare";
  return timingSafeEqual(createHmac("sha256", key).update(a).digest(), createHmac("sha256", key).update(b).digest());
}

export function checkCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const [scheme, salt, keyHex] = (process.env.ADMIN_PASSWORD_HASH ?? "").split(":");
  if (!expectedUser || scheme !== "scrypt" || !salt || !keyHex) return false;
  const expected = Buffer.from(keyHex, "hex");
  const actual = scryptSync(password, salt, expected.length);
  const userOk = sameString(username.trim().toLowerCase(), expectedUser.toLowerCase());
  const passOk = timingSafeEqual(actual, expected);
  return userOk && passOk;
}

/** Signed token: base64url("<username>|<expires ms>") + "." + HMAC. */
export function createSessionToken() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not set (needs 32+ characters)");
  const payload = Buffer.from(`${process.env.ADMIN_USERNAME}|${Date.now() + SESSION_MAX_AGE * 1000}`).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

export function verifySessionToken(token: string | undefined) {
  const key = secret();
  if (!key || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !sameString(sig, sign(payload, key))) return false;
  const [user, expires] = Buffer.from(payload, "base64url").toString().split("|");
  return user === process.env.ADMIN_USERNAME && Number(expires) > Date.now();
}

// Failed-login throttle: 5 failures per IP locks it out for 15 minutes (per server process).
const LOCK_AFTER = 5;
const LOCK_MS = 15 * 60 * 1000;
const globalForAuth = globalThis as unknown as { loginFailures?: Map<string, { count: number; until: number }> };
const failures = (globalForAuth.loginFailures ??= new Map<string, { count: number; until: number }>());

export function loginLockedFor(ip: string) {
  const entry = failures.get(ip);
  if (!entry || entry.count < LOCK_AFTER) return 0;
  const left = entry.until - Date.now();
  if (left <= 0) {
    failures.delete(ip);
    return 0;
  }
  return left;
}

export function recordLoginFailure(ip: string) {
  const entry = failures.get(ip) ?? { count: 0, until: 0 };
  entry.count += 1;
  entry.until = Date.now() + LOCK_MS;
  failures.set(ip, entry);
}

export function clearLoginFailures(ip: string) {
  failures.delete(ip);
}
