"use client";

import { useState, type FormEvent } from "react";
import { contactPage } from "./content/pages";
import { DatePicker } from "./date-picker";
import { EMAIL_RE, ENQUIRY_EMAIL, submitEnquiry } from "./enquiry";

type Errors = Partial<Record<"name" | "email" | "departure", string>>;

/**
 * Contact Form 7 layout from /contact. Submitted through submitEnquiry().
 */
export function ContactForm() {
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "invalid" | "sending" | "sent" | "mailto">("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    if (!get("your-name")) next.name = "Please fill out this field.";
    if (!get("your-email")) next.email = "Please fill out this field.";
    else if (!EMAIL_RE.test(get("your-email"))) next.email = "Please enter an email address.";
    // theme.js: the departure date must be after the arrival date
    if (arrival && departure && new Date(departure) <= new Date(arrival)) {
      next.departure = "Departure date must be after the arrival date.";
    }
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("invalid");
      return;
    }
    const children = [
      ["0-6", get("children-0-6")],
      ["6-12", get("children-6-12")],
      ["12+", get("children-12")],
    ]
      .filter(([, n]) => n)
      .map(([age, n]) => `${n} aged ${age}`)
      .join(", ");
    const enquiry = {
      name: get("your-name"),
      email: get("your-email"),
      telephone: get("tel"),
      country: get("country"),
      arrival,
      departure,
      adults: get("adults"),
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
      {field("country", "country")}
      <p className="position-r">
        <span className="label">Arrival Date</span>
        <DatePicker value={arrival} onChange={setArrival} name="arrival" aria-label="Arrival Date" />
      </p>
      <p className="position-r">
        <span className="label">Departure Date</span>
        <DatePicker value={departure} onChange={setDeparture} name="departure" aria-label="Departure Date" />
        {errors.departure && <span className="field-error">{errors.departure}</span>}
      </p>
      {field("Adults", "adults")}
      <div className="children-wrapper">
        <p>
          <span className="label">Children</span>
          <span className="childAgeWrap">
            <span>0 - 6 Years</span>
            <input type="text" name="children-0-6" aria-label="Children 0 - 6 Years" />
            <span>6 - 12 Years</span>
            <input type="text" name="children-6-12" aria-label="Children 6 - 12 Years" />
            <span>12+ Years</span>
            <input type="text" name="children-12" aria-label="Children 12+ Years" />
          </span>
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
        <span className="label">Message </span>
        <textarea name="your-message" rows={10} maxLength={2000} aria-label="Message" />
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
