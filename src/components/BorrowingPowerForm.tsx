"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** `.w-input` + `.text-field-*` — 38px box, square corners, `#ccc` hairline. */
const FIELD_CLASS =
  "mb-[10px] h-[38px] w-full rounded-none border border-[#ccc] bg-white px-[12px] py-[8px] align-middle font-inter text-[14px] leading-[1.42857] transition-none placeholder:text-[#999] focus:border-[#3898ec] focus-visible:border-[#3898ec] focus-visible:ring-0 md:text-[14px]";

/** Webflow's `label` base, relaxed to weight 400 by `.field-label-3 … -8`. */
const LABEL_CLASS =
  "mb-[5px] block gap-0 font-inter text-[14px] leading-[20px] font-normal select-text";

/** `.w-select` — same box as `.w-input`, filled `#f3f3f3`, text `#676767`. */
const SELECT_TRIGGER_CLASS =
  "mb-[10px] h-[38px] w-full rounded-none border border-[#ccc] bg-[#f3f3f3] px-[12px] py-[8px] font-inter text-[14px] text-[#676767] transition-none focus-visible:border-[#3898ec] focus-visible:ring-0 data-placeholder:text-[#676767] data-[size=default]:h-[38px]";

/** `label.w-checkbox` — 20px indent that the floated native checkbox sits in. */
const CHECKBOX_LABEL_CLASS = "block cursor-pointer pl-[20px] font-inter";

/** `.w-checkbox-input` — a native checkbox, floated back into the label's indent. */
const CHECKBOX_INPUT_CLASS = "float-left mt-[4px] ml-[-20px] appearance-auto leading-normal";

/** `.checkbox-label` / `.checkbox-label-2`, i.e. `.w-form-label` + Inter. */
const CHECKBOX_TEXT_CLASS =
  "mb-0 inline-block cursor-pointer font-inter text-[14px] leading-[20px] font-normal";

const SITUATION_OPTIONS = [
  "First Home Buyer",
  "Investor",
  "Refinance",
  "Upgrading",
  "Commercial Lending",
  "Asset Finance",
] as const;

const INCOME_OPTIONS = ["100K-150K", "150K-200K", "200K+"] as const;

interface BorrowingPowerFormProps {
  /** Extra classes merged onto the outer `<section>`. */
  className?: string;
}

/**
 * `section#booking.bpa-section` — the free borrowing-power assessment card on `/`.
 *
 * **Both ids are load-bearing.** `#booking` is the section anchor, and `#bpa-consent2` is the
 * target the hero CTA and `CTA_BAND_LINKS` both point at (an odd choice by the original author,
 * but the element does exist, so it is not a broken anchor).
 *
 * `.bpa-*` has **no responsive overrides anywhere** in the source bundle — 44px heading, 80px/24px
 * section padding and the card's 40px/48px padding hold at every width, including 320px.
 *
 * Deliberate divergences from the source markup (all invisible, see the spec for detail):
 * - **No backend.** `onSubmit` calls `preventDefault()` and swaps in the `.w-form-done` panel.
 *   Nothing is posted anywhere; `.w-form-fail` can never fire and is not rendered.
 * - The source gives **all six controls `id="field"`** and two labels `for=""`. Unique ids are
 *   used here so each label actually addresses its control. `#bpa-consent1` / `#bpa-consent2`
 *   keep the source's own ids.
 * - Every situation `<option>` carries `value="Another option"` in the source — an unedited
 *   Webflow default. The option label is used as its value instead.
 *
 * One source quirk that *is* reproduced: the **Last Name label sits outside** the `<div>` holding
 * its input. Because the form is a plain block container this is invisible — the label's 5px
 * bottom margin collapses against the wrapper below it, so it sits 5px above its field like
 * every other label.
 */
export function BorrowingPowerForm({ className }: BorrowingPowerFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="booking" className={cn("bg-[#111111] px-[24px] py-[80px]", className)}>
      <div className="mx-auto flex max-w-[600px] flex-col items-center gap-[12px] text-center">
        <h2 className="font-inter text-[44px] leading-[1.15] font-bold text-white">
          Get Your Free Borrowing Power Assessment
        </h2>
        <p className="font-inter text-[15px] text-[#aaaaaa]">
          Find out how much more you could borrow – and at what rate. Takes 60 seconds.
        </p>
        <p className="font-inter text-[13px] text-[#e63946]">
          {"🔴 "}
          <em>Limited free assessment spots available this month</em>
        </p>

        {/* .bpa-card */}
        <div className="mt-[24px] w-full rounded-[12px] bg-white px-[48px] py-[40px] text-left font-serif shadow-[0_2px_16px_#00000014]">
          {/* `.bpa-card-title` declares no line-height, so it keeps Webflow's `h3 {
              line-height: 30px }` base — not a ratio of its 36px font-size. */}
          <h3 className="mb-[28px] text-center font-inter text-[36px] leading-[30px] font-normal tracking-[0] text-[#111111]">
            Get Approved
          </h3>

          {submitted ? (
            <div className="bg-[#dddddd] p-[20px] text-center font-inter text-[14px] leading-[20px] text-[#333333]">
              <div>Thank you! Your submission has been received!</div>
            </div>
          ) : (
            /* `.bpa-form.w-form` is the DIV *wrapping* the form, not the form itself, so its
               `display:flex; gap:16px` never reaches these fields — the form is a plain block
               and its children stack on their own collapsing margins. Only `.w-form`'s
               `margin: 0 0 15px` is observable, folded onto the form here. */
            <form onSubmit={handleSubmit} className="mb-[15px]">
              <div>
                <Label htmlFor="bpa-first-name" className={LABEL_CLASS}>
                  First Name
                </Label>
                <Input
                  id="bpa-first-name"
                  name="firstName"
                  type="text"
                  maxLength={256}
                  placeholder="First Name"
                  className={cn(FIELD_CLASS, "text-[#333333]")}
                />
              </div>

              {/* The source really does leave this label outside the field's wrapper. */}
              <Label htmlFor="bpa-last-name" className={LABEL_CLASS}>
                Last Name
              </Label>
              <div>
                <Input
                  id="bpa-last-name"
                  name="lastName"
                  type="text"
                  maxLength={256}
                  placeholder="Last Name"
                  className={cn(FIELD_CLASS, "text-[#333333]")}
                />
              </div>

              <div>
                <Label htmlFor="bpa-phone" className={LABEL_CLASS}>
                  Phone <span>*</span>
                </Label>
                <Input
                  id="bpa-phone"
                  name="phone"
                  type="tel"
                  maxLength={256}
                  placeholder="Phone"
                  className={cn(FIELD_CLASS, "text-[#333333]")}
                />
              </div>

              <div>
                <Label htmlFor="bpa-email" className={LABEL_CLASS}>
                  Email <span>*</span>
                </Label>
                <Input
                  id="bpa-email"
                  name="email"
                  type="email"
                  maxLength={256}
                  placeholder="Email"
                  className={cn(FIELD_CLASS, "text-[#676767]")}
                />
              </div>

              <div>
                <Label htmlFor="bpa-situation" className={LABEL_CLASS}>
                  What best describes your situation?
                </Label>
                <Select name="situation">
                  <SelectTrigger id="bpa-situation" className={SELECT_TRIGGER_CLASS}>
                    <SelectValue placeholder=" Please select" />
                  </SelectTrigger>
                  <SelectContent>
                    {SITUATION_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bpa-income" className={LABEL_CLASS}>
                  What is your estimated annual income?
                </Label>
                <Select name="income">
                  <SelectTrigger id="bpa-income" className={SELECT_TRIGGER_CLASS}>
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
              </div>

              <div>
                <label className={cn(CHECKBOX_LABEL_CLASS, "my-[20px]")}>
                  <input
                    type="checkbox"
                    id="bpa-consent1"
                    name="consent1"
                    required
                    className={CHECKBOX_INPUT_CLASS}
                  />
                  <span className={CHECKBOX_TEXT_CLASS}>
                    By checking this box, I consent to receive non-marketing text messages from{" "}
                    <strong>FundUp</strong> about <strong>Lending Products</strong>. Message
                    frequency varies, message &amp; data rates may apply. Text HELP for assistance,
                    reply STOP to opt out.
                  </span>
                </label>
              </div>

              <div>
                <label className={cn(CHECKBOX_LABEL_CLASS, "mb-[40px]")}>
                  <input
                    type="checkbox"
                    id="bpa-consent2"
                    name="consent2"
                    className={CHECKBOX_INPUT_CLASS}
                  />
                  <span className={CHECKBOX_TEXT_CLASS}>
                    By checking this box, I consent to receive marketing and promotional messages
                    including special offers, discounts, new product updates among others from{" "}
                    <strong>FundUp</strong> at the phone number provided. Frequency may vary.
                    Message &amp; data rates may apply. Text HELP for assistance, reply STOP to opt
                    out.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-[5px] border-0 bg-black px-[15px] py-[13px] font-inter text-[14px] leading-[20px] text-white"
              >
                Submit
              </button>

              {/* No stylesheet on the source sets a colour for a bare <a>, so this renders in the
                  browser default link blue. Reproduced literally — Tailwind's preflight
                  (`a { color: inherit }`) would otherwise silently change it. */}
              <Link
                href="/privacy-policy"
                className="mx-auto mt-[40px] flex justify-center text-center font-inter text-[#0000ee] underline"
              >
                Privacy Policy
              </Link>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
