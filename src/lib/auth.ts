import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "bbxin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface StoredUser {
  username: string;
  password: string;
  createdAt: string;
}

// In-memory store (resets on server restart)
const globalForUsers = globalThis as typeof globalThis & { __users?: StoredUser[] };
if (!globalForUsers.__users) {
  globalForUsers.__users = [];
}

export function getUsers(): StoredUser[] {
  return globalForUsers.__users!;
}

export function createUser(username: string, password: string): { ok: true } | { ok: false; error: string } {
  const users = getUsers();
  if (users.some((u) => u.username === username)) {
    return { ok: false, error: "用户名已存在" };
  }
  users.push({ username, password, createdAt: new Date().toISOString() });
  return { ok: true };
}

export function validateUser(username: string, password: string): boolean {
  return getUsers().some((u) => u.username === username && u.password === password);
}

export async function setSessionCookie(username: string): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
}

export async function getCurrentUser(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const username = decoded.split(":")[0];
    return getUsers().some((u) => u.username === username) ? username : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
