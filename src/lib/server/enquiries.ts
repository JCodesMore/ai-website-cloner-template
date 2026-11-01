import { getDb } from "./db";
import { ENQUIRY_STATUSES, type EnquiryStatus } from "./enquiry-statuses";

export { ENQUIRY_STATUSES, type EnquiryStatus };

export type Enquiry = {
  id: number;
  created_at: number;
  status: EnquiryStatus;
  name: string;
  email: string;
  telephone: string;
  country: string;
  arrival: string;
  departure: string;
  adults: string;
  children: string;
  hotel: string;
  message: string;
  page: string;
  source: string;
  referrer: string;
  landing_page: string;
  email_sent: number;
};

export type EnquiryInput = Omit<Enquiry, "id" | "created_at" | "status" | "email_sent"> & { visitor_id: string | null };

export function createEnquiry(e: EnquiryInput) {
  const r = getDb()
    .prepare(
      `INSERT INTO enquiries (created_at, name, email, telephone, country, arrival, departure, adults, children, hotel, message, page, visitor_id, source, referrer, landing_page)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      Date.now(), e.name, e.email, e.telephone, e.country, e.arrival, e.departure, e.adults, e.children,
      e.hotel, e.message, e.page, e.visitor_id, e.source, e.referrer, e.landing_page,
    );
  return Number(r.lastInsertRowid);
}

export function markEmailSent(id: number) {
  getDb().prepare("UPDATE enquiries SET email_sent = 1 WHERE id = ?").run(id);
}

export function listEnquiries({ status, q, limit = 50, offset = 0 }: { status?: string; q?: string; limit?: number; offset?: number }) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (status && (ENQUIRY_STATUSES as readonly string[]).includes(status)) {
    where.push("status = ?");
    args.push(status);
  }
  if (q) {
    where.push("(name LIKE ? OR email LIKE ? OR country LIKE ? OR message LIKE ?)");
    const like = `%${q.replace(/[%_]/g, "")}%`;
    args.push(like, like, like, like);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const db = getDb();
  const items = db.prepare(`SELECT * FROM enquiries ${clause} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...args, limit, offset) as Enquiry[];
  const { n } = db.prepare(`SELECT COUNT(*) AS n FROM enquiries ${clause}`).get(...args) as { n: number };
  return { items, total: n };
}

export function getEnquiry(id: number) {
  return getDb().prepare("SELECT * FROM enquiries WHERE id = ?").get(id) as Enquiry | undefined;
}

export function statusCounts() {
  const rows = getDb().prepare("SELECT status, COUNT(*) AS n FROM enquiries GROUP BY status").all() as { status: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n])) as Partial<Record<EnquiryStatus, number>>;
}

export function setEnquiryStatus(id: number, status: EnquiryStatus) {
  getDb().prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
}

export function deleteEnquiry(id: number) {
  getDb().prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Notification email via Resend, when RESEND_API_KEY and ENQUIRY_EMAIL_FROM are set. */
export async function sendEnquiryEmail(id: number | null, e: EnquiryInput) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_EMAIL_FROM;
  const to = process.env.ENQUIRY_EMAIL_TO;
  if (!key || !from || !to) return false;
  const rows: [string, string][] = [
    ["Name", e.name], ["Email", e.email], ["Telephone", e.telephone], ["Country", e.country],
    ["Arrival", e.arrival], ["Departure", e.departure], ["Adults", e.adults], ["Children", e.children],
    ["Hotel category", e.hotel], ["Sent from", e.page], ["Came from", e.source],
  ];
  const site = process.env.SITE_URL?.replace(/\/$/, "");
  const html = `<h2>New tour enquiry</h2><table cellpadding="4">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`)
    .join("")}</table><p style="white-space:pre-wrap">${esc(e.message)}</p>${
    site && id !== null ? `<p><a href="${site}/admin/enquiries/${id}">View in admin</a></p>` : ""
  }`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), reply_to: e.email, subject: `Tour enquiry from ${e.name}`, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
