/**
 * In-memory rate limiter — single-process only.
 *
 * Uses a Map with setInterval cleanup. This works for single-instance deployments.
 * If you deploy behind a load balancer or use serverless (multiple instances),
 * each instance has its own counter and rate limits are not enforced globally.
 *
 * Migration path for multi-instance:
 * 1. Install ioredis: `npm install ioredis`
 * 2. Replace this module with a Redis-backed rate limiter (e.g., rate-limit-redis)
 * 3. Add REDIS_URL to your environment variables
 * 4. Remove the setInterval cleanup — Redis handles key expiry natively
 *
 * For the current single-instance deployment, this is sufficient.
 */

const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { ok: false, remaining: 0 };
  }

  entry.count++;
  return { ok: true, remaining: maxRequests - entry.count };
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60 * 1000);
