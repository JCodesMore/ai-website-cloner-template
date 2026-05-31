import { cookies } from "next/headers";
import { createHmac } from "crypto";

const ADMIN_SESSION = "ymq_admin_session";

// Earliest allowed token issuance timestamp (ms). Set to now on module load.
// Tokens with iat older than this are rejected.
let minValidIssuedAt = Date.now();

/** Invalidate all existing sessions by advancing the minimum-valid-iat. */
export function invalidateAllSessions(): void {
  minValidIssuedAt = Date.now();
  void auditLog("sessions_invalidated", `minValidIssuedAt=${minValidIssuedAt}`);
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET must be set");
  return secret;
}

function sign(payload: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex").slice(0, 32)}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  return sign(payload) === token ? payload : null;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPass || !username || !password) return false;
  return username === adminUser && password === adminPass;
}

export async function requireAdmin(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION)?.value;
    if (!token) return null;
    const payload = verify(token);
    if (!payload) return null;
    const parts = payload.split(":");
    const username = parts[0];
    const iat = parseInt(parts[1], 10);
    // Reject if token was issued before the last invalidation
    if (isNaN(iat) || iat < minValidIssuedAt) return null;
    return username === process.env.ADMIN_USERNAME ? username : null;
  } catch { return null; }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION);
}

export async function auditLog(action: string, detail?: string): Promise<void> {
  const line = `[AUDIT] ${new Date().toISOString()} | ${action}${detail ? ` | ${detail}` : ""}`;
  console.log(line);
}
