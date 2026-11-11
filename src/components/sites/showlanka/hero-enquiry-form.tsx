"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { EMAIL_RE, ENQUIRY_EMAIL, submitEnquiry } from "./enquiry";

type Errors = Partial<Record<"name" | "email", string>>;

/** Short enquiry form for the home hero; the full form lives on /contact. */
export function HeroEnquiryForm({ className = "", id }: { className?: string; id?: string }) {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "sending" | "sent" | "mailto">("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    if (!get("name")) next.name = "Please enter your name.";
    if (!get("email")) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(get("email"))) next.email = "Please enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const result = await submitEnquiry({
      name: get("name"),
      email: get("email"),
      telephone: get("tel"),
      arrival: get("arrival"),
      adults: get("adults"),
      message: "Quick enquiry from the home page hero form.",
      page: window.location.pathname,
      website: get("website"),
    });
    if (result === "sent") form.reset();
    setStatus(result);
  };

  const fieldId = (name: string) => `${uid}-${name}`;

  return (
    // data-lpignore: LastPass otherwise injects icon <div>s into the labels before hydration.
    <form id={id} className={`hero-enquiry ${className}`} aria-label="Quick enquiry" noValidate onSubmit={onSubmit} data-lpignore="true">
      <p className="hero-enquiry__title">Plan your Sri Lanka trip</p>
      <div className="hero-enquiry__fields">
        <label className="hero-enquiry__field" htmlFor={fieldId("name")}>
          <span>Name*</span>
          <input id={fieldId("name")} type="text" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-required />
          {errors.name && <span className="hero-enquiry__error">{errors.name}</span>}
        </label>
        <label className="hero-enquiry__field" htmlFor={fieldId("email")}>
          <span>Email*</span>
          <input id={fieldId("email")} type="email" name="email" autoComplete="email" aria-invalid={!!errors.email} aria-required />
          {errors.email && <span className="hero-enquiry__error">{errors.email}</span>}
        </label>
        <label className="hero-enquiry__field" htmlFor={fieldId("tel")}>
          <span>Contact number</span>
          <input id={fieldId("tel")} type="tel" name="tel" autoComplete="tel" inputMode="tel" />
        </label>
        <label className="hero-enquiry__field" htmlFor={fieldId("arrival")}>
          <span>Arrival date</span>
          <input id={fieldId("arrival")} type="date" name="arrival" />
        </label>
        <label className="hero-enquiry__field hero-enquiry__field--small" htmlFor={fieldId("adults")}>
          <span>Adults</span>
          <select id={fieldId("adults")} name="adults" defaultValue="2">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {/* Honeypot: hidden from people, filled in by spam bots */}
        <span className="sr-only" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </span>
        <button className="common-btn hero-enquiry__submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
      {status === "sent" || status === "mailto" ? (
        <p className="hero-enquiry__status" role="status">
          {status === "sent"
            ? "Thank you! Your enquiry has been sent — we will get back to you shortly."
            : `Your email app should now open with this enquiry addressed to ${ENQUIRY_EMAIL}.`}
        </p>
      ) : (
        <p className="hero-enquiry__more">
          Want to add more detail? <Link href="/contact">Use our full enquiry form</Link>
        </p>
      )}
    </form>
  );
}
