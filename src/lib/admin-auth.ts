import { cookies } from "next/headers";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken, verifyToken } from "@/lib/crypto";

const ADMIN_SESSION = "ymq_admin_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set");
  return secret;
}

// ── Session invalidation (DB-backed) ──

let _cachedAdminInvalidation = 0;
let _cachedAdminInvalidationAt = 0;

async function getMinValidIssuedAt(): Promise<number> {
  const now = Date.now();
  if (now - _cachedAdminInvalidationAt < 30_000) return _cachedAdminInvalidation;
  try {
    const rows = await db.select({ value: schema.settings.value })
      .from(schema.settings)
      .where(eq(schema.settings.key, "admin_session_invalidation"));
    _cachedAdminInvalidation = rows.length > 0 ? parseInt(rows[0].value, 10) || 0 : 0;
    _cachedAdminInvalidationAt = now;
    return _cachedAdminInvalidation;
  } catch {
    return 0;
  }
}

export async function invalidateAllSessions(): Promise<void> {
  const now = Date.now();
  await db.insert(schema.settings)
    .values({ key: "admin_session_invalidation", value: String(now) })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value: String(now) } });
  void auditLog("sessions_invalidated", `timestamp=${now}`);
}

// ── Admin credentials ──

export async function validateAdminCredentials(username: string, password: string): Promise<boolean> {
  try {
    const rows = await db.select({ password: schema.users.password, role: schema.users.role })
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (rows.length === 0) return false;
    if (rows[0].role !== "admin") return false;
    return verifyPassword(password, rows[0].password);
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION)?.value;
    if (!token) return null;
    const payload = verifyToken(token, getSecret());
    if (!payload) return null;
    const parts = payload.split(":");
    const username = parts[0];
    const iat = parseInt(parts[1], 10);
    if (!username || isNaN(iat)) return null;

    const minValid = await getMinValidIssuedAt();
    if (iat < minValid) return null;

    const rows = await db.select({ role: schema.users.role })
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (rows.length === 0 || rows[0].role !== "admin") return null;
    return username;
  } catch { return null; }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION);
}

// ── Audit ──

export async function auditLog(action: string, detail?: string): Promise<void> {
  const line = `[AUDIT] ${new Date().toISOString()} | ${action}${detail ? ` | ${detail}` : ""}`;
  console.log(line);
}

// ── Seed admin user ──

export async function seedAdminUser(): Promise<void> {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "bbxin2026";
  try {
    const rows = await db.select({ username: schema.users.username, password: schema.users.password })
      .from(schema.users)
      .where(eq(schema.users.username, username));
    const hashed = hashPassword(password);
    if (rows.length === 0) {
      await db.insert(schema.users).values({
        username,
        password: hashed,
        role: "admin",
      });
      console.log(`[admin-auth] Created admin user: ${username}`);
    } else if (!verifyPassword(password, rows[0].password)) {
      await db.update(schema.users)
        .set({ password: hashed })
        .where(eq(schema.users.username, username));
      console.log(`[admin-auth] Updated password for admin user: ${username}`);
    }
  } catch (err: any) {
    console.error("[admin-auth] Seed admin user failed:", err.message);
  }
}
