/**
 * Input sanitization utilities
 * Treat ALL client input as untrusted. Sanitize before use.
 */

// Strip HTML tags — prevents XSS injection
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// Sanitize text input — strip HTML, limit length
export function sanitizeText(input: string, maxLength = 500): string {
  const stripped = stripHtml(input);
  return stripped.slice(0, maxLength);
}

// Sanitize email — basic format check + strip
export function sanitizeEmail(input: string): string {
  const stripped = stripHtml(input).toLowerCase().trim();
  // Basic email pattern — real validation happens server-side
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(stripped) ? stripped : "";
}

// Sanitize phone — digits, +, spaces, dashes only
export function sanitizePhone(input: string): string {
  return input.replace(/[^\d+\-\s()]/g, "").trim();
}

// Escape for safe HTML rendering (if ever needed)
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return input.replace(/[&<>"']/g, (char) => map[char] || char);
}

// Rate limiting helper (client-side, not a security boundary)
const submissions = new Map<string, number>();
export function isRateLimited(key: string, windowMs = 60000, maxAttempts = 3): boolean {
  const now = Date.now();
  const lastAttempt = submissions.get(key) || 0;
  const count = submissions.get(`${key}_count`) || 0;

  if (now - lastAttempt > windowMs) {
    submissions.set(key, now);
    submissions.set(`${key}_count`, 1);
    return false;
  }

  if (count >= maxAttempts) return true;

  submissions.set(`${key}_count`, count + 1);
  return false;
}
