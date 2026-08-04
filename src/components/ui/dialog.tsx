"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

/**
 * Modal dialog, built on `@base-ui/react` — **not Radix**, so the part names and props follow
 * Base UI (`Backdrop` rather than `Overlay`, `Popup` rather than `Content`).
 *
 * Three Base UI defaults are relied on rather than passed:
 * - `Root` renders **no DOM element**, so a `DialogTrigger` stays a direct child of whatever
 *   laid it out. That is what lets the calculators' `.cta-btn` keep its `margin-top: auto`.
 * - `Portal` is `keepMounted={false}`, so a closed dialog costs nothing and its fields never
 *   reach the SSR output.
 * - `Root` is `modal` (focus trap + scroll lock) and dismisses on outside click.
 *
 * Enter/exit uses Base UI's `data-starting-style` / `data-ending-style`. Both apply here because
 * the popup is never open on first render — contrast `FaqAccordion`, whose panel *is*, and so
 * never receives a starting style at all.
 */
const Dialog = DialogPrimitive.Root

const DialogPortal = DialogPrimitive.Portal

function DialogTrigger({ className, ...props }: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

function DialogClose({ className, ...props }: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}

/**
 * Deliberately a light scrim rather than a blackout — the brief was that the page must stay
 * readable behind the modal.
 */
function DialogBackdrop({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  )
}

/**
 * `translate` and `scale` are separate CSS properties in Tailwind v4, so the centring offset and
 * the entrance scale don't overwrite each other — only `scale` is transitioned.
 */
function DialogPopup({ className, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPrimitive.Popup
      data-slot="dialog-popup"
      className={cn(
        "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-48px)] w-[calc(100vw-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[18px] border border-black/5 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)] outline-none transition-[opacity,scale] duration-200 ease-out data-ending-style:scale-[0.96] data-ending-style:opacity-0 data-starting-style:scale-[0.96] data-starting-style:opacity-0 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-[18px] leading-[24px] font-bold text-[#111111]", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-[13px] leading-[19px] text-[#666666]", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
