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

const SITE = (process.env.SITE_URL || "https://showlanka.com").replace(/\/$/, "");
const LOGO = `${SITE}/sites/showlanka/images/logo.png`;
const WHATSAPP = "+94 77 914 4664";
const EMPTY = '<span style="color:#aaa">—</span>';

const section = (title: string) =>
  `<tr><td colspan="2" style="background:#e8f2fc;color:#0057a7;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:.5px;padding:10px 24px;border-top:1px solid #d3e4f5">${title}</td></tr>`;
const row = (label: string, value: string, i: number) =>
  `<tr style="background:${i % 2 ? "#f7f9fb" : "#ffffff"}"><td style="width:38%;padding:10px 24px;color:#555;font-weight:bold;border-top:1px solid #eef1f4;vertical-align:top">${label}</td><td style="padding:10px 24px;color:#222;border-top:1px solid #eef1f4">${
    value || EMPTY
  }</td></tr>`;
const rows = (items: [string, string][]) => items.map(([k, v], i) => row(k, v, i)).join("");
const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#047ad9;color:#fff;text-decoration:none;padding:12px 32px;border-radius:20px;font-weight:bold;font-size:13px;text-transform:uppercase">${label}</a>`;

/** Shared branded frame: logo header, blue accent bar, content rows, footer. */
function emailLayout(title: string, subtitle: string, body: string) {
  return `<div style="background:#f0f3f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;margin:0 auto;background:#fff;border-collapse:collapse;border-radius:8px;overflow:hidden;border:1px solid #dde3ea">
<tr><td colspan="2" style="padding:24px 24px 12px;text-align:center;background:#fff"><a href="${SITE}"><img src="${LOGO}" alt="Show Lanka Tours" width="180" style="display:inline-block;width:180px;max-width:60%;height:auto;border:0"></a></td></tr>
<tr><td colspan="2" style="background:#047ad9;color:#fff;padding:18px 24px;text-align:center"><div style="font-size:20px;font-weight:bold">${title}</div><div style="font-size:13px;opacity:.9;margin-top:4px">${subtitle}</div></td></tr>
${body}
<tr><td colspan="2" style="background:#1f2a36;color:#c9d3dd;padding:18px 24px;text-align:center;font-size:12px;line-height:1.6"><b style="color:#fff">Show Lanka Tours</b><br>WhatsApp ${WHATSAPP} · <a href="mailto:showlankatours@gmail.com" style="color:#8cc6f5">showlankatours@gmail.com</a><br><a href="${SITE}" style="color:#8cc6f5">${SITE.replace(/^https?:\/\//, "")}</a></td></tr>
</table></div>`;
}

const tripRows = (e: EnquiryInput) =>
  rows([
    ["Arrival", esc(e.arrival)],
    ["Departure", esc(e.departure)],
    ["Adults", esc(e.adults)],
    ["Children", esc(e.children)],
    ["Hotel category", esc(e.hotel)],
  ]);
const messageRow = (e: EnquiryInput) =>
  `<tr><td colspan="2" style="padding:14px 24px;color:#222;white-space:pre-wrap;line-height:1.5;border-top:1px solid #eef1f4">${esc(e.message) || EMPTY}</td></tr>`;

async function sendEmail(payload: { to: string[]; reply_to?: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_EMAIL_FROM;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, ...payload }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const teamAddresses = () => (process.env.ENQUIRY_EMAIL_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);

/** Thank-you email to the visitor, via Resend; replies go to the team. */
export async function sendThankYouEmail(e: EnquiryInput) {
  const firstName = esc(e.name.split(/\s+/)[0] ?? e.name);
  const body = `<tr><td colspan="2" style="padding:28px 24px 8px;line-height:1.7;font-size:15px">
<p style="margin:0 0 14px">Dear ${firstName},</p>
<p style="margin:0 0 14px"><b>Thank you for your enquiry!</b> We're delighted that you're thinking of exploring Sri Lanka with us.</p>
<p style="margin:0 0 14px">One of our team members will contact you <b style="color:#047ad9">within 24 hours</b> to help plan your perfect trip.</p>
</td></tr>
<tr><td colspan="2" style="padding:4px 24px 20px"><div style="background:#fff7ef;border-left:4px solid #f39a4a;padding:12px 16px;border-radius:4px;font-size:13px;line-height:1.6;color:#5a4632">Need something urgently? Message us on WhatsApp at <b>${WHATSAPP}</b>.</div></td></tr>
${section("Your enquiry summary")}
${tripRows(e)}
${section("Your message")}
${messageRow(e)}
<tr><td colspan="2" style="padding:24px;text-align:center;border-top:1px solid #eef1f4">${button(`${SITE}/sri-lanka-tours`, "Browse our tours")}</td></tr>
<tr><td colspan="2" style="padding:0 24px 24px;line-height:1.6;font-size:14px;color:#444">Warm regards,<br><b>The Show Lanka Tours team</b></td></tr>`;
  return sendEmail({
    to: [e.email],
    reply_to: teamAddresses()[0],
    subject: "Thank you for your enquiry – Show Lanka Tours",
    html: emailLayout("Thank you for your enquiry", "We'll be in touch within 24 hours", body),
  });
}

/** Notification email to the team via Resend, when RESEND_API_KEY, ENQUIRY_EMAIL_FROM and ENQUIRY_EMAIL_TO are set. */
export async function sendEnquiryEmail(id: number | null, e: EnquiryInput) {
  const to = teamAddresses();
  if (!to.length) return false;
  const mail = esc(e.email);
  const body = `${section("Contact details")}
${rows([
  ["Name", esc(e.name)],
  ["Email", `<a href="mailto:${mail}" style="color:#047ad9">${mail}</a>`],
  ["Telephone", esc(e.telephone)],
  ["Country", esc(e.country)],
])}
${section("Trip details")}
${tripRows(e)}
${section("Message")}
${messageRow(e)}
${section("Source")}
${rows([
  ["Sent from", esc(e.page)],
  ["Came from", esc(e.source)],
])}
${
  id !== null
    ? `<tr><td colspan="2" style="padding:20px 24px;text-align:center;border-top:1px solid #eef1f4">${button(`${SITE}/admin/enquiries/${id}`, "View in admin")}</td></tr>`
    : ""
}`;
  return sendEmail({
    to,
    reply_to: e.email,
    subject: `Tour enquiry from ${e.name}`,
    html: emailLayout("New tour enquiry", `from ${esc(e.name)}`, body),
  });
}
