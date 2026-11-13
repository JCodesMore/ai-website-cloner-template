"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";
import { buttonClass, Field, inputClass } from "./ui";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Username">
        <input name="username" autoComplete="username" required autoFocus className={inputClass} />
      </Field>
      <Field label="Password">
        <span className="relative block">
          <input name="password" type={show ? "text" : "password"} autoComplete="current-password" required className={`${inputClass} pr-10`} />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-slate-800"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </Field>
      {state?.errors.length ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.errors[0]}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${buttonClass.primary} w-full py-2.5`}>
        {pending && <LoaderCircle className="size-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}
