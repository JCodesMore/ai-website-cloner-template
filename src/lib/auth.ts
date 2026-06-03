import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, signToken, verifyToken } from "@/lib/crypto";

const SESSION_COOKIE = "yinmaiquan_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set");
  return secret;
}

// ── User CRUD ──

export async function createUser(username: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await db.insert(schema.users).values({
      username,
      password: hashPassword(password),
    });
    return { ok: true };
  } catch (err: any) {
    if (err.message?.includes("duplicate") || err.message?.includes("unique")) {
      return { ok: false, error: "用户名已存在" };
    }
    throw err;
  }
}

export async function validateUser(username: string, password: string): Promise<"locked" | boolean> {
  try {
    // Check lockout
    const lockRows = await db.select({ value: schema.settings.value })
      .from(schema.settings)
      .where(eq(schema.settings.key, `lockout:${username}`));
    if (lockRows.length > 0) {
      const lock = JSON.parse(lockRows[0].value);
      if (lock.lockedUntil && Date.now() < lock.lockedUntil) {
        return "locked";
      }
    }

    const rows = await db.select({ password: schema.users.password })
      .from(schema.users)
      .where(eq(schema.users.username, username));
    if (rows.length === 0) return false;
    return verifyPassword(password, rows[0].password);
  } catch {
    return false;
  }
}

export async function recordLoginFailure(username: string): Promise<void> {
  try {
    const key = `lockout:${username}`;
    const rows = await db.select({ value: schema.settings.value }).from(schema.settings).where(eq(schema.settings.key, key));
    let attempts = 0;
    if (rows.length > 0) {
      const lock = JSON.parse(rows[0].value);
      attempts = lock.attempts || 0;
    }
    attempts++;
    const lockedUntil = attempts >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
    await db.insert(schema.settings)
      .values({ key, value: JSON.stringify({ attempts, lockedUntil }) })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value: JSON.stringify({ attempts, lockedUntil }) } });
  } catch { /* non-critical */ }
}

export async function clearLoginFailures(username: string): Promise<void> {
  try {
    await db.delete(schema.settings).where(eq(schema.settings.key, `lockout:${username}`));
  } catch { /* non-critical */ }
}

export interface UserInfo {
  username: string;
  phone: string;
  createdAt: string | null;
}

export async function getUserInfo(username: string): Promise<UserInfo | null> {
  try {
    const rows = await db.select({
      username: schema.users.username,
      phone: schema.users.phone,
      createdAt: schema.users.createdAt,
    }).from(schema.users).where(eq(schema.users.username, username));
    if (rows.length === 0) return null;
    return {
      username: rows[0].username,
      phone: rows[0].phone || "",
      createdAt: rows[0].createdAt?.toISOString() || null,
    };
  } catch {
    return null;
  }
}

// ── Session management ──

export async function setSessionCookie(username: string): Promise<NextResponse> {
  const cookieStore = await cookies();
  const payload = `${username}:${Date.now()}`;
  const token = signToken(payload, getSecret());
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}

let _cachedInvalidation = 0;
let _cachedInvalidationAt = 0;

async function getSessionInvalidationTime(): Promise<number> {
  const now = Date.now();
  if (now - _cachedInvalidationAt < 30_000) return _cachedInvalidation;
  try {
    const rows = await db.select({ value: schema.settings.value })
      .from(schema.settings)
      .where(eq(schema.settings.key, "user_session_invalidation"));
    _cachedInvalidation = rows.length > 0 ? parseInt(rows[0].value, 10) || 0 : 0;
    _cachedInvalidationAt = now;
    return _cachedInvalidation;
  } catch {
    return 0;
  }
}

export async function getCurrentUser(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyToken(token, getSecret());
    if (!payload) return null;
    const parts = payload.split(":");
    const username = parts[0];
    const iat = parseInt(parts[1], 10);
    if (!username || isNaN(iat)) return null;

    const minValid = await getSessionInvalidationTime();
    if (iat < minValid) return null;

    const rows = await db.select({ username: schema.users.username })
      .from(schema.users)
      .where(eq(schema.users.username, username));
    return rows.length > 0 ? username : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function invalidateAllUserSessions(): Promise<void> {
  const now = Date.now();
  await db.insert(schema.settings)
    .values({ key: "user_session_invalidation", value: String(now) })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value: String(now) } });
}
