"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { CheckIcon, XIcon } from "lucide-react";

import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPreferredSlot, submitConsultRequest, todayIsoDate } from "@/lib/consult-request";
import { INCOME_OPTIONS, SITUATION_OPTIONS } from "@/lib/enquiry-options";
import type { ConsultRequest } from "@/types";

/* -------------------------------------------------------------------------- */
/*  Field styling                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Deliberately **not** the homepage form's treatment. `BorrowingPowerForm` reproduces Webflow's
 * square `#ccc` hairlines because it is cloning a live section; this modal is new work and was
 * briefed as "modern", so it gets soft corners and a filled rest state.
 *
 * `md:text-[14px]` cancels `ui/input`'s own `text-base md:text-sm`, and `focus-visible:ring-0`
 * cancels its focus ring in favour of a red border.
 */
const FIELD_CLASS =
  "h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] px-[12px] py-0 text-[14px] leading-[20px] text-[#222222] transition-colors placeholder:text-[#a0a0a0] focus-visible:border-[#d62b2b] focus-visible:bg-white focus-visible:ring-0 md:text-[14px]";

/** `ui/label` is a flex row with a gap and `select-none`; both are unwanted here. */
const LABEL_CLASS =
  "mb-[6px] block gap-0 font-inter text-[13px] leading-[18px] font-semibold text-[#333333] select-text";

/** Same box as `FIELD_CLASS`; `w-fit` and the `data-[size=default]` height both need overriding. */
const SELECT_TRIGGER_CLASS =
  "h-[42px] w-full rounded-[10px] border border-[#e0e0e0] bg-[#fafafa] px-[12px] text-[14px] text-[#222222] transition-colors data-placeholder:text-[#a0a0a0] focus-visible:border-[#d62b2b] focus-visible:ring-0 data-[size=default]:h-[42px]";

/** Pairs two fields side by side from 480px up. Arbitrary min-widths only — see the note below. */
const FIELD_ROW_CLASS = "grid grid-cols-1 gap-x-[14px] min-[480px]:grid-cols-2";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface ConsultDialogProps {
  /** Classes for the trigger button — the calculators pass their `.cta-btn` treatment. */
  triggerClassName?: string;
  /** Trigger copy. Defaults to the label the four calculator cards use. */
  triggerLabel?: string;
}

/**
 * The "Book Free Consult" button on `/calculators` and the booking modal it opens.
 *
 * **This replaces a link to `/contact`** (client direction — see `docs/research/FIXES.md`). The
 * live site's button is `window.open("https://fundup.au/contact","_blank")`, and `/contact` has
 * no form on it at all, so the site's main conversion moment used to dead-end. The form now opens
 * in place, over the calculator the visitor was just using.
 *
 * Fields mirror the homepage `BorrowingPowerForm` one-for-one, plus **preferred date and time**.
 * Styling does not — that form clones Webflow, this one was briefed fresh.
 *
 * Note the breakpoints are all arbitrary `min-[480px]:` rather than Tailwind's `sm:`. Tailwind v4
 * emits arbitrary min-width blocks *before* the named breakpoints, so mixing the two families on
 * one property lets the named variant win at widths where it shouldn't. This file stays on one
 * family throughout.
 *
 * Rendered four times per page (once per calculator). That is cheap: `Dialog.Root` emits no DOM
 * and `Portal` defaults to `keepMounted={false}`, so a closed modal contributes nothing — and
 * the trigger stays a direct flex child of `.right-panel`, which is what keeps `.cta-btn`'s
 * `margin-top: auto` pinning it to the bottom of the card.
 */
export function ConsultDialog({
  triggerClassName,
  triggerLabel = "Book Free Consult",
}: ConsultDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<ConsultRequest | null>(null);

  return (
    <Dialog
      open={open}
      // Reset on *open*, not on close. Clearing on close would flip the confirmation panel back
      // to an empty form mid-fade-out; clearing on `onOpenChangeComplete` avoids that but is only
      // as reliable as the exit animation — it never fires in a background tab, so a visitor who
      // booked, closed and came back would reopen to a stale "Thanks". Opening always fires, and
      // React batches this with the open state, so the popup mounts blank with no flash.
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setSubmitted(null);
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger className={triggerClassName}>{triggerLabel}</DialogTrigger>

      <DialogPortal>
        <DialogBackdrop />

        <DialogPopup>
          {/* Sticky because the form is long enough to scroll inside the popup. */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-[16px] border-b border-[#eeeeee] bg-white/95 px-[28px] py-[20px] backdrop-blur-sm max-[479px]:px-[20px]">
            <div className="flex flex-col gap-[4px]">
              <DialogTitle>Book Your Free Consult</DialogTitle>
              <DialogDescription>
                No obligation. We&rsquo;ll confirm your preferred time by phone or email.
              </DialogDescription>
            </div>

            <DialogClose
              aria-label="Close"
              className="-mt-[4px] -mr-[6px] flex size-[32px] shrink-0 items-center justify-center rounded-[8px] text-[#999999] transition-colors hover:bg-[#f2f2f2] hover:text-[#111111]"
            >
              <XIcon className="size-[18px]" />
            </DialogClose>
          </div>

          <div className="px-[28px] py-[24px] max-[479px]:px-[20px]">
            {submitted ? (
              <ConsultConfirmation request={submitted} />
            ) : (
              <ConsultForm onSubmitted={setSubmitted} />
            )}
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Mounted only while the modal is open, which is what makes `todayIsoDate()` safe to call during
 * render — it never runs on the server, so a visitor west of the server's timezone can't be handed
 * a `min` date computed from someone else's "today".
 */
function ConsultForm({ onSubmitted }: { onSubmitted: (request: ConsultRequest) => void }) {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const request: ConsultRequest = {
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      situation: String(data.get("situation") ?? ""),
      income: String(data.get("income") ?? ""),
      preferredDate: String(data.get("preferredDate") ?? ""),
      preferredTime: String(data.get("preferredTime") ?? ""),
      consentNonMarketing: data.get("consentNonMarketing") === "on",
      consentMarketing: data.get("consentMarketing") === "on",
    };

    setPending(true);
    setError(null);

    try {
      await submitConsultRequest(request);
      onSubmitted(request);
    } catch {
      // Unreachable until Resend is wired up, but the branch has to exist for that day.
      setError("Something went wrong sending that. Please call 0412 885 734 instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={FIELD_ROW_CLASS}>
        <Field id={fieldId("first-name")} label="First Name">
          <Input
            id={fieldId("first-name")}
            name="firstName"
            type="text"
            maxLength={256}
            autoComplete="given-name"
            placeholder="First Name"
            className={FIELD_CLASS}
          />
        </Field>

        <Field id={fieldId("last-name")} label="Last Name">
          <Input
            id={fieldId("last-name")}
            name="lastName"
            type="text"
            maxLength={256}
            autoComplete="family-name"
            placeholder="Last Name"
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <div className={FIELD_ROW_CLASS}>
        <Field id={fieldId("phone")} label="Phone" required>
          <Input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            required
            maxLength={256}
            autoComplete="tel"
            placeholder="0412 345 678"
            className={FIELD_CLASS}
          />
        </Field>

        <Field id={fieldId("email")} label="Email" required>
          <Input
            id={fieldId("email")}
            name="email"
            type="email"
            required
            maxLength={256}
            autoComplete="email"
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <Field id={fieldId("situation")} label="What best describes your situation?">
        <Select name="situation">
          <SelectTrigger id={fieldId("situation")} className={SELECT_TRIGGER_CLASS}>
            <SelectValue placeholder="Please select" />
          </SelectTrigger>
          <SelectContent>
            {SITUATION_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id={fieldId("income")} label="What is your estimated annual income?">
        <Select name="income">
          <SelectTrigger id={fieldId("income")} className={SELECT_TRIGGER_CLASS}>
            <SelectValue placeholder="Please select" />
          </SelectTrigger>
          <SelectContent>
            {INCOME_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className={FIELD_ROW_CLASS}>
        <Field id={fieldId("date")} label="Preferred date" required>
          <Input
            id={fieldId("date")}
            name="preferredDate"
            type="date"
            required
            // Floored at today: a request for a past date is never valid. There is no ceiling.
            min={todayIsoDate()}
            // Firefox and Safari format the native picker from the field's `lang`. Chrome ignores
            // it and always follows the browser's own locale — verified, it still renders
            // `mm/dd/yyyy` here on a US-locale Chrome. That is Chrome's behaviour, not a defect:
            // an Australian visitor's Chrome shows `dd/mm/yyyy`. The value is ISO either way.
            lang="en-AU"
            className={FIELD_CLASS}
          />
        </Field>

        {/* No `min`/`max`: FundUp advertise "Available 24/7/365" in their own contact band, so any
            hour is inside their service window. Swap in a slot list if that ever stops being true. */}
        <Field
          id={fieldId("time")}
          label="Preferred time"
          required
          hint="We’re available 24/7 — pick whatever suits you."
        >
          <Input
            id={fieldId("time")}
            name="preferredTime"
            type="time"
            required
            className={FIELD_CLASS}
          />
        </Field>
      </div>

      <div className="mt-[6px] flex flex-col gap-[12px]">
        <label className="flex cursor-pointer items-start gap-[10px]">
          <input
            type="checkbox"
            name="consentNonMarketing"
            required
            className="mt-[2px] size-[15px] shrink-0 appearance-auto accent-[#d62b2b]"
          />
          <span className="text-[12px] leading-[17px] text-[#666666]">
            By checking this box, I consent to receive non-marketing text messages from{" "}
            <strong className="font-semibold text-[#333333]">FundUp</strong> about{" "}
            <strong className="font-semibold text-[#333333]">Lending Products</strong>. Message
            frequency varies, message &amp; data rates may apply. Text HELP for assistance, reply
            STOP to opt out.
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-[10px]">
          <input
            type="checkbox"
            name="consentMarketing"
            className="mt-[2px] size-[15px] shrink-0 appearance-auto accent-[#d62b2b]"
          />
          <span className="text-[12px] leading-[17px] text-[#666666]">
            By checking this box, I consent to receive marketing and promotional messages including
            special offers, discounts, new product updates among others from{" "}
            <strong className="font-semibold text-[#333333]">FundUp</strong>{" "}
            {/* Explicit — the compiler swallows a plain space between a closing tag and text that
                wraps to the next line. That is exactly how `/` ended up reading "FundUpat". */}
            at the phone number provided. Frequency may vary. Message &amp; data rates may apply.
            Text HELP for assistance, reply STOP to opt out.
          </span>
        </label>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-[16px] rounded-[10px] bg-[#d62b2b]/8 px-[12px] py-[10px] text-[13px] leading-[18px] text-[#b82020]"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-[20px] h-[46px] w-full cursor-pointer rounded-[10px] border-0 bg-[#d62b2b] text-[14px] font-bold tracking-[0.01em] text-white transition-[background-color,translate] duration-150 hover:-translate-y-px hover:bg-[#b82020] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? "Sending…" : "Book My Free Consult"}
      </button>

      <p className="mt-[12px] text-center text-[11px] leading-[16px] text-[#999999]">
        By submitting you agree to our{" "}
        <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-[#666666]">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

/** Label + optional required marker + optional hint, wrapping one control. */
function Field({
  id,
  label,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-[14px]">
      <Label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-[2px] text-[#d62b2b]">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {hint ? <p className="mt-[5px] text-[11px] leading-[15px] text-[#999999]">{hint}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Confirmation                                                              */
/* -------------------------------------------------------------------------- */

/** Echoes the requested slot back so the visitor can see exactly what they asked for. */
function ConsultConfirmation({ request }: { request: ConsultRequest }) {
  const slot = formatPreferredSlot(request.preferredDate, request.preferredTime);

  return (
    <div className="flex flex-col items-center gap-[12px] py-[12px] text-center">
      <span className="flex size-[52px] items-center justify-center rounded-full bg-[#d62b2b]/10">
        <CheckIcon className="size-[26px] text-[#d62b2b]" />
      </span>

      <h3 className="text-[18px] leading-[24px] font-bold text-[#111111]">
        {request.firstName ? `Thanks, ${request.firstName}!` : "Thanks!"}
      </h3>

      <p className="text-[14px] leading-[20px] text-[#666666]">
        {slot ? (
          <>
            We&rsquo;ll be in touch to confirm your free consult for{" "}
            <strong className="font-semibold text-[#222222]">{slot}</strong>.
          </>
        ) : (
          <>We&rsquo;ll be in touch shortly to confirm your free consult.</>
        )}
      </p>

      {/* Development-only. This must never reach a visitor — but it must be impossible for a
          developer to forget that submissions currently go nowhere. See
          `submitConsultRequest()` in `src/lib/consult-request.ts`. */}
      {process.env.NODE_ENV !== "production" ? (
        <p className="rounded-[8px] bg-[#fff7d6] px-[12px] py-[8px] text-[11px] leading-[16px] text-[#8a6d1f]">
          Dev only: nothing was actually sent. Wire up <code>submitConsultRequest()</code> before
          this goes live.
        </p>
      ) : null}

      <DialogClose className="mt-[8px] h-[44px] w-full rounded-[10px] border-0 bg-[#d62b2b] text-[14px] font-bold text-white transition-colors duration-150 hover:bg-[#b82020]">
        Done
      </DialogClose>
    </div>
  );
}
