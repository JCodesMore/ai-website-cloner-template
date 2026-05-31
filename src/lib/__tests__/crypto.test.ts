import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken } from "@/lib/crypto";

describe("hashPassword / verifyPassword", () => {
  it("hashes and verifies a password", () => {
    const hash = hashPassword("mypassword");
    expect(hash).toContain(":");
    expect(verifyPassword("mypassword", hash)).toBe(true);
  });

  it("rejects wrong password", () => {
    const hash = hashPassword("correct");
    expect(verifyPassword("wrong", hash)).toBe(false);
  });

  it("verifies legacy SHA256 format", () => {
    const { createHash, randomBytes } = require("crypto");
    const salt = randomBytes(32).toString("hex");
    const h = createHash("sha256").update("legacypass" + salt).digest("hex");
    const legacy = `${h}:${salt}`;
    expect(verifyPassword("legacypass", legacy)).toBe(true);
    expect(verifyPassword("wrong", legacy)).toBe(false);
  });

  it("produces different hashes for same password", () => {
    const h1 = hashPassword("same");
    const h2 = hashPassword("same");
    expect(h1).not.toBe(h2);
    expect(verifyPassword("same", h1)).toBe(true);
    expect(verifyPassword("same", h2)).toBe(true);
  });

  it("rejects malformed stored value", () => {
    expect(verifyPassword("test", "not-a-hash")).toBe(false);
    expect(verifyPassword("test", "")).toBe(false);
  });
});

describe("signToken / verifyToken", () => {
  const secret = "test-secret-key";

  it("signs and verifies a token", () => {
    const token = signToken("user1:1234567890", secret);
    const payload = verifyToken(token, secret);
    expect(payload).toBe("user1:1234567890");
  });

  it("rejects token with wrong secret", () => {
    const token = signToken("user1:1234567890", secret);
    expect(verifyToken(token, "wrong-secret")).toBeNull();
  });

  it("rejects tampered token", () => {
    const token = signToken("user1:1234567890", secret);
    const tampered = token.slice(0, -5) + "xxxxx";
    expect(verifyToken(tampered, secret)).toBeNull();
  });

  it("rejects token without signature", () => {
    expect(verifyToken("no-dot", secret)).toBeNull();
  });

  it("consistent signatures for same payload", () => {
    const t1 = signToken("payload", secret);
    const t2 = signToken("payload", secret);
    expect(t1).toBe(t2); // HMAC is deterministic
  });
});
