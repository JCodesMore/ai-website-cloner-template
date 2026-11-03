"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type FormEvent } from "react";
import { contactPage } from "./content/pages";
import { DatePicker } from "./date-picker";
import { EMAIL_RE, ENQUIRY_EMAIL, submitEnquiry } from "./enquiry";

type Errors = Partial<Record<"name" | "email" | "country" | "arrival" | "departure" | "travellers" | "message", string>>;

const REQUIRED = "Please fill out this field.";
const MAX_COUNT = 50;

type CountKey = "adults" | "children-0-6" | "children-6-12" | "children-12";
const NO_TRAVELLERS: Record<CountKey, number> = { adults: 0, "children-0-6": 0, "children-6-12": 0, "children-12": 0 };

/** Number field with up/down buttons; native spinners are hidden in CSS so every browser looks the same. */
function Counter({ name, label, value, onChange, invalid }: { name: string; label: string; value: number; onChange: (n: number) => void; invalid?: boolean }) {
  const set = (n: number) => onChange(Math.min(MAX_COUNT, Math.max(0, n)));
  return (
    <span className="count-input">
      <input
        type="number"
        name={name}
        aria-label={label}
        aria-invalid={invalid}
        inputMode="numeric"
        min={0}
        max={MAX_COUNT}
        value={value}
        onChange={(e) => set(parseInt(e.target.value, 10) || 0)}
        onFocus={(e) => e.target.select()}
      />
      <span className="count-input__buttons">
        <button type="button" aria-label={`Increase ${label}`} onClick={() => set(value + 1)} disabled={value >= MAX_COUNT}>
          <ChevronUp size={14} strokeWidth={2.5} />
        </button>
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => set(value - 1)} disabled={value <= 0}>
          <ChevronDown size={14} strokeWidth={2.5} />
        </button>
      </span>
    </span>
  );
}

/**
 * Contact Form 7 layout from /contact. Submitted through submitEnquiry().
 */
export function ContactForm() {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [counts, setCounts] = useState(NO_TRAVELLERS);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "invalid" | "sending" | "sent" | "mailto">("");

  const setCount = (key: CountKey) => (n: number) => {
    setCounts((c) => ({ ...c, [key]: n }));
    if (errors.travellers) setErrors((e) => ({ ...e, travellers: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    // Every field is required except telephone.
    if (!get("your-name")) next.name = REQUIRED;
    if (!get("your-email")) next.email = REQUIRED;
    else if (!EMAIL_RE.test(get("your-email"))) next.email = "Please enter an email address.";
    if (!get("country")) next.country = REQUIRED;
    if (!arrival) next.arrival = REQUIRED;
    if (!departure) next.departure = REQUIRED;
    // theme.js: the departure date must be after the arrival date
    else if (arrival && new Date(departure) <= new Date(arrival)) {
      next.departure = "Departure date must be after the arrival date.";
    }
    if (Object.values(counts).every((n) => n === 0)) next.travellers = "Please enter at least one traveller.";
    if (!get("your-message")) next.message = REQUIRED;
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("invalid");
      return;
    }
    const children =
      (
        [
          ["0-6", counts["children-0-6"]],
          ["6-12", counts["children-6-12"]],
          ["12+", counts["children-12"]],
        ] as const
      )
        .filter(([, n]) => n > 0)
        .map(([age, n]) => `${n} aged ${age}`)
        .join(", ") || "None";
    const enquiry = {
      name: get("your-name"),
      email: get("your-email"),
      telephone: get("tel"),
      country: get("country"),
      arrival,
      departure,
      adults: String(counts.adults),
      children,
      hotel: get("hotel"),
      message: get("your-message"),
      page: window.location.pathname,
      website: get("website"),
    };

    setStatus("sending");
    const result = await submitEnquiry(enquiry);
    if (result === "sent") {
      form.reset();
      setArrival("");
      setDeparture("");
      setCounts(NO_TRAVELLERS);
    }
    setStatus(result);
  };

  const field = (label: string, name: string, type = "text", error?: string) => (
    <p>
      <span className="label">{label}</span>
      <input type={type} name={name} aria-invalid={!!error} aria-required={label.endsWith("*")} />
      {error && <span className="field-error">{error}</span>}
    </p>
  );

  return (
    <form className="wpcf7-form" aria-label="Contact form" noValidate onSubmit={onSubmit}>
      {field("name*", "your-name", "text", errors.name)}
      {field("email*", "your-email", "email", errors.email)}
      {field("telephone", "tel", "tel")}
      {field("country*", "country", "text", errors.country)}
      <p className="position-r">
        <span className="label">Arrival Date*</span>
        <DatePicker value={arrival} onChange={setArrival} name="arrival" aria-label="Arrival Date" />
        {errors.arrival && <span className="field-error">{errors.arrival}</span>}
      </p>
      <p className="position-r">
        <span className="label">Departure Date*</span>
        <DatePicker value={departure} onChange={setDeparture} name="departure" aria-label="Departure Date" />
        {errors.departure && <span className="field-error">{errors.departure}</span>}
      </p>
      <p>
        <span className="label">Adults</span>
        <Counter name="adults" label="Adults" value={counts.adults} onChange={setCount("adults")} invalid={!!errors.travellers} />
      </p>
      <div className="children-wrapper">
        <p>
          <span className="label">Children</span>
          <span className="childAgeWrap">
            <span>0 - 6 Years</span>
            <Counter name="children-0-6" label="Children 0 - 6 Years" value={counts["children-0-6"]} onChange={setCount("children-0-6")} invalid={!!errors.travellers} />
            <span>6 - 12 Years</span>
            <Counter name="children-6-12" label="Children 6 - 12 Years" value={counts["children-6-12"]} onChange={setCount("children-6-12")} invalid={!!errors.travellers} />
            <span>12+ Years</span>
            <Counter name="children-12" label="Children 12+ Years" value={counts["children-12"]} onChange={setCount("children-12")} invalid={!!errors.travellers} />
          </span>
          {errors.travellers && <span className="field-error">{errors.travellers}</span>}
        </p>
      </div>
      <p>
        <span className="label">Hotel category</span>
        <select name="hotel" aria-label="Hotel category">
          {contactPage.hotelCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </p>
      <p>
        <span className="label">Message*</span>
        <textarea name="your-message" rows={10} maxLength={2000} aria-label="Message" aria-invalid={!!errors.message} aria-required />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </p>
      {/* Honeypot: hidden from people, filled in by spam bots */}
      <p className="sr-only" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </p>
      <p>
        <input className="wpcf7-submit" type="submit" value={status === "sending" ? "Sending…" : "Submit"} disabled={status === "sending"} />
      </p>
      <p className="required">* Required fields</p>
      {status && status !== "sending" && (
        <div className={`wpcf7-response-output${status === "invalid" ? " is-error" : ""}`} role="status" aria-live="polite">
          {status === "invalid"
            ? "One or more fields have an error. Please check and try again."
            : status === "sent"
              ? "Thank you for your message. It has been sent — we will get back to you shortly."
              : `Your email app should now open with this enquiry addressed to ${ENQUIRY_EMAIL}.`}
        </div>
      )}
    </form>
  );
}
