import type { ConsultRequest } from "@/types";

/**
 * Delivery seam for the `/calculators` consultation modal.
 *
 * **Nothing is sent anywhere today.** This resolves without doing any work, and the modal shows
 * its confirmation panel purely on that resolution. That is deliberate and agreed: FundUp will
 * wire delivery up through Resend once they have access to the domain to verify it.
 *
 * When that happens, **this function is the only thing that has to change.** The modal already
 * builds a fully typed `ConsultRequest` and awaits this call, so wiring it up means POSTing to a
 * route handler here (the API key must stay server-side — do not call Resend from this module,
 * which runs in the browser) and letting a rejection surface as the modal's error state.
 */
export async function submitConsultRequest(request: ConsultRequest): Promise<void> {
  // Referenced so the payload shape stays honest while there is no transport.
  void request;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/**
 * `"2026-08-04"` + `"14:30"` → `"4 August 2026 at 2:30 PM"`, for echoing the request back on the
 * confirmation panel.
 *
 * Formatted by hand rather than with `Intl`, for the same reason `formatAud()` is: `Intl` output
 * depends on the host's ICU build, and this project treats server/client divergence as a defect.
 * Returns an empty string if either half is missing, so callers can skip the line entirely.
 */
export function formatPreferredSlot(isoDate: string, time24: string): string {
  if (!isoDate || !time24) {
    return "";
  }

  const [year, month, day] = isoDate.split("-");
  const [hours, minutes] = time24.split(":");

  const monthName = MONTHS[Number(month) - 1];
  const hour24 = Number(hours);
  if (!monthName || Number.isNaN(hour24)) {
    return "";
  }

  const meridiem = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${Number(day)} ${monthName} ${year} at ${hour12}:${minutes} ${meridiem}`;
}

/** Today as `YYYY-MM-DD` in the visitor's own timezone — the floor for the date field. */
export function todayIsoDate(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}
