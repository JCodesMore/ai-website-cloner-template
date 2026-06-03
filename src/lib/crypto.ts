import { scryptSync, randomBytes, timingSafeEqual, createHmac, createHash } from "crypto";

// ── Password hashing (scrypt, with SHA256 fallback for legacy) ──

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`; // scrypt format: salt:hash
}

export function verifyPassword(password: string, stored: string): boolean {
  // scrypt format: salt:hash
  const parts = stored.split(":");
  if (parts.length === 2 && parts[0]!.length === 32 && parts[1]!.length === 128) {
    const [salt, hash] = parts;
    const inputHash = scryptSync(password, salt!, 64);
    const storedHash = Buffer.from(hash!, "hex");
    if (inputHash.length !== storedHash.length) return false;
    return timingSafeEqual(inputHash, storedHash);
  }
  // Legacy SHA256 format: hash:salt
  if (stored.includes(":") && parts.length === 2) {
    const idx = stored.lastIndexOf(":");
    const salt = stored.slice(idx + 1);
    const expected = createHash("sha256").update(password + salt).digest("hex") + ":" + salt;
    try {
      return timingSafeEqual(Buffer.from(expected), Buffer.from(stored));
    } catch {
      return expected === stored;
    }
  }
  return false;
}

// ── Token signing (HMAC-SHA256) ──

export function signToken(payload: string, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return `${payload}.${hmac.digest("hex").slice(0, 32)}`;
}

export function verifyToken(token: string, secret: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  const expected = signToken(payload, secret);
  try {
    if (expected.length !== token.length) return null;
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token)) ? payload : null;
  } catch {
    return expected === token ? payload : null;
  }
}
