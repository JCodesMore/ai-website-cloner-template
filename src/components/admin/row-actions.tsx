"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { buttonClass } from "./ui";

/** Show/hide on the website toggle used in the tours and news lists. */
export function PublishToggle({ published, onToggle }: { published: boolean; onToggle: (next: boolean) => Promise<void> }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => onToggle(!published))}
      className={buttonClass.ghost}
      title={published ? "Hide from the website" : "Show on the website"}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      {published ? "Hide" : "Publish"}
    </button>
  );
}

/** Delete (custom items) or reset (edited built-in items), behind a confirm prompt. */
export function DangerButton({ label, confirmText, onConfirm, className }: { label: string; confirmText: string; onConfirm: () => Promise<void>; className?: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className={cn(buttonClass.danger, className)}
      onClick={() => {
        if (confirm(confirmText)) start(() => onConfirm());
      }}
    >
      {pending && <LoaderCircle className="size-4 animate-spin" />}
      {label}
    </button>
  );
}
