"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { draftToNews, draftToTour, type NewsDraft, type TourDraft } from "@/components/admin/models";
import {
  checkCredentials,
  clearLoginFailures,
  createSessionToken,
  isAuthConfigured,
  loginLockedFor,
  recordLoginFailure,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/server/auth";
import {
  adminNews,
  adminTours,
  builtinNewsItem,
  builtinTour,
  isBuiltinNews,
  isBuiltinTour,
  slugInUse,
} from "@/lib/server/content";
import { getDb } from "@/lib/server/db";
import { deleteEnquiry, ENQUIRY_STATUSES, setEnquiryStatus, type EnquiryStatus } from "@/lib/server/enquiries";
import { clientIp, requireAdmin } from "@/lib/server/session";

export type FormState = { errors: string[] } | undefined;

// ---------- Session ----------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isAuthConfigured()) {
    return { errors: ["The admin login is not set up on this server (ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET)."] };
  }
  const ip = await clientIp();
  const locked = loginLockedFor(ip);
  if (locked) return { errors: [`Too many failed attempts. Try again in ${Math.ceil(locked / 60000)} minutes.`] };

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    recordLoginFailure(ip);
    return { errors: ["Incorrect username or password."] };
  }
  clearLoginFailures(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Shared ----------

type Table = "tours" | "news";

function upsert(table: Table, slug: string, data: unknown, published: boolean) {
  const now = Date.now();
  getDb()
    .prepare(
      `INSERT INTO ${table} (slug, data, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET data = excluded.data, published = excluded.published, updated_at = excluded.updated_at`,
    )
    .run(slug, JSON.stringify(data), published ? 1 : 0, now, now);
}

function rename(table: Table, from: string, to: string) {
  getDb().prepare(`UPDATE ${table} SET slug = ? WHERE slug = ?`).run(to, from);
}

function removeRow(table: Table, slug: string) {
  getDb().prepare(`DELETE FROM ${table} WHERE slug = ?`).run(slug);
}

/** Public pages read content per request; this also clears the client router cache. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function parseDraft<T>(formData: FormData): T | null {
  try {
    return JSON.parse(String(formData.get("draft") ?? "")) as T;
  } catch {
    return null;
  }
}

/** Check a new or changed slug; built-in items keep theirs so existing links never break. */
function slugError(slug: string, original: string, builtin: boolean) {
  if (builtin && slug !== original) return "Built-in pages keep their original web address.";
  if (slug !== original && slugInUse(slug)) return `The web address "/${slug}" is already used by another page.`;
  return null;
}

// ---------- Tours ----------

export async function saveTour(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const draft = parseDraft<TourDraft>(formData);
  if (!draft) return { errors: ["The form could not be read. Please try again."] };
  const original = String(formData.get("original") ?? "");
  const result = draftToTour(draft);
  if (!result.ok) return { errors: result.errors };
  const tour = result.value;

  const builtin = !!original && isBuiltinTour(original);
  const err = slugError(tour.slug, original, builtin);
  if (err) return { errors: [err] };

  if (original && original !== tour.slug) rename("tours", original, tour.slug);
  upsert("tours", tour.slug, tour, draft.published);
  refreshSite();
  redirect(`/admin/tours?saved=${encodeURIComponent(tour.slug)}`);
}

export async function setTourPublished(slug: string, published: boolean) {
  await requireAdmin();
  const entry = adminTours().find((e) => e.item.slug === slug);
  if (!entry) return;
  upsert("tours", slug, entry.item, published);
  refreshSite();
}

/** Custom tours are deleted; built-in ones go back to their original content. */
export async function deleteTour(slug: string) {
  await requireAdmin();
  removeRow("tours", slug);
  refreshSite();
  redirect(builtinTour(slug) ? "/admin/tours?reset=1" : "/admin/tours?deleted=1");
}

// ---------- News ----------

export async function saveNews(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const draft = parseDraft<NewsDraft>(formData);
  if (!draft) return { errors: ["The form could not be read. Please try again."] };
  const original = String(formData.get("original") ?? "");
  const builtin = !!original && isBuiltinNews(original);
  // Only built-in posts can link to an original article on showlanka.com.
  const result = draftToNews({ ...draft, linkOriginal: builtin && draft.linkOriginal });
  if (!result.ok) return { errors: result.errors };
  const item = result.value;

  const err = slugError(item.slug, original, builtin);
  if (err) return { errors: [err] };

  if (original && original !== item.slug) rename("news", original, item.slug);
  upsert("news", item.slug, item, draft.published);
  refreshSite();
  redirect(`/admin/news?saved=${encodeURIComponent(item.slug)}`);
}

export async function setNewsPublished(slug: string, published: boolean) {
  await requireAdmin();
  const entry = adminNews().find((e) => e.item.slug === slug);
  if (!entry) return;
  upsert("news", slug, entry.item, published);
  refreshSite();
}

export async function deleteNews(slug: string) {
  await requireAdmin();
  removeRow("news", slug);
  refreshSite();
  redirect(builtinNewsItem(slug) ? "/admin/news?reset=1" : "/admin/news?deleted=1");
}

// ---------- Enquiries ----------

export async function updateEnquiryStatus(id: number, status: string) {
  await requireAdmin();
  if (!(ENQUIRY_STATUSES as readonly string[]).includes(status)) return;
  setEnquiryStatus(id, status as EnquiryStatus);
  revalidatePath("/admin", "layout");
}

export async function removeEnquiry(id: number) {
  await requireAdmin();
  deleteEnquiry(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/enquiries?deleted=1");
}
