import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows first request", () => {
    const r = rateLimit(`test-${Date.now()}`, 5, 60_000);
    expect(r.ok).toBe(true);
    expect(r.remaining).toBe(4);
  });

  it("allows requests up to the limit", () => {
    const key = `test-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const r = rateLimit(key, 5, 60_000);
      expect(r.ok).toBe(true);
      expect(r.remaining).toBe(4 - i);
    }
  });

  it("blocks requests exceeding the limit", () => {
    const key = `test-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 60_000);
    }
    const blocked = rateLimit(key, 5, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets after window expires", async () => {
    const key = `reset-test-${Date.now()}`;
    // Use min window to make reset happen quickly
    const windowMs = 10;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, windowMs);
    }
    expect(rateLimit(key, 3, windowMs).ok).toBe(false);

    // Wait well past the window
    await new Promise((r) => setTimeout(r, 20));
    const result = rateLimit(key, 3, windowMs);
    expect(result.ok).toBe(true);
  });

  it("different keys have independent limits", () => {
    const a = `test-a-${Date.now()}`;
    const b = `test-b-${Date.now()}`;

    for (let i = 0; i < 3; i++) rateLimit(a, 3, 60_000);
    expect(rateLimit(a, 3, 60_000).ok).toBe(false);
    expect(rateLimit(b, 3, 60_000).ok).toBe(true);
  });

  it("tracks remaining correctly across multiple keys", () => {
    const key1 = `test-1-${Date.now()}`;
    const key2 = `test-2-${Date.now()}`;

    rateLimit(key1, 10, 60_000);
    rateLimit(key1, 10, 60_000);
    rateLimit(key1, 10, 60_000);

    rateLimit(key2, 10, 60_000);

    const r1 = rateLimit(key1, 10, 60_000);
    expect(r1.ok).toBe(true);
    expect(r1.remaining).toBe(6);

    const r2 = rateLimit(key2, 10, 60_000);
    expect(r2.ok).toBe(true);
    expect(r2.remaining).toBe(8);
  });

  it("handles maxRequests of 1", () => {
    const key = `test-${Date.now()}`;
    expect(rateLimit(key, 1, 60_000).ok).toBe(true);
    expect(rateLimit(key, 1, 60_000).ok).toBe(false);
  });
});
