"use server";

import { redirect } from "next/navigation";

function s(formData: FormData, key: string): string {
  return (formData.get(key) ?? "").toString().trim();
}

function isEmail(value: string): boolean {
  return value.includes("@") && value.length >= 3;
}

/**
 * Server action for the per-product contact form
 * (`/monochrome/contact/[slug]`).
 *
 * Validates required fields then redirects to the thanks page. There is no
 * real backend in this clone — submissions are logged to the server console
 * for development visibility and discarded.
 */
export async function submitContactForm(formData: FormData): Promise<void> {
  const slug = s(formData, "slug");
  const name = s(formData, "name");
  const email = s(formData, "email");
  const phone = s(formData, "phone");
  const prefecture = s(formData, "prefecture");
  const propertyType = s(formData, "property_type");
  const schedule = s(formData, "schedule");
  const message = s(formData, "message");
  const source = s(formData, "source");
  const company = s(formData, "company");
  const postalCode = s(formData, "postal_code");
  const agree = s(formData, "privacy_agree");

  if (!name || !email || !isEmail(email) || !agree) {
    redirect(`/monochrome/thanks?form=contact&status=error`);
  }

  // Product-specific fields (best-effort — only logged for visibility)
  const productExtras: Record<string, string | string[]> = {};
  for (const key of [
    "roof_area",
    "roof_shape",
    "wall_area",
    "building_floors",
    "panel_location",
    "capacity",
    "existing_solar",
    "current_provider",
    "monthly_usage",
  ]) {
    const v = s(formData, key);
    if (v) productExtras[key] = v;
  }
  const appOs = formData.getAll("app_os").map((v) => v.toString());
  if (appOs.length) productExtras.app_os = appOs;

  console.log("[contact] submission", {
    slug,
    name,
    email,
    phone,
    prefecture,
    propertyType,
    schedule,
    company,
    postalCode,
    source,
    messageLength: message.length,
    extras: productExtras,
  });

  redirect(
    `/monochrome/thanks?form=contact&product=${encodeURIComponent(slug)}`,
  );
}

/**
 * Server action for the newsletter signup form (`/monochrome/newsletter`).
 */
export async function submitNewsletter(formData: FormData): Promise<void> {
  const email = s(formData, "email");

  if (!email || !isEmail(email)) {
    redirect(`/monochrome/thanks?form=newsletter&status=error`);
  }

  console.log("[newsletter] submission", { email });

  redirect(`/monochrome/thanks?form=newsletter`);
}

/**
 * Server action for the Roof–1 工務店パートナー application
 * (`/monochrome/mc-builder`).
 */
export async function submitBuilderApplication(
  formData: FormData,
): Promise<void> {
  const company = s(formData, "company");
  const name = s(formData, "name");
  const email = s(formData, "email");
  const phone = s(formData, "phone");
  const contactMethod = s(formData, "contact_method");
  const inquiryType = s(formData, "inquiry_type");
  const referral = s(formData, "referral");
  const message = s(formData, "message");
  const startDate = s(formData, "start_date");
  const source = s(formData, "source");
  const agree = s(formData, "privacy_agree");
  const areas = formData.getAll("areas").map((v) => v.toString().trim()).filter(Boolean);

  if (
    !company ||
    !name ||
    !email ||
    !isEmail(email) ||
    !agree ||
    areas.length < 2
  ) {
    redirect(`/monochrome/thanks?form=builder&status=error`);
  }

  console.log("[builder] submission", {
    company,
    name,
    email,
    phone,
    contactMethod,
    inquiryType,
    referral,
    startDate,
    areasCount: areas.length,
    source,
    messageLength: message.length,
  });

  redirect(`/monochrome/thanks?form=builder`);
}
