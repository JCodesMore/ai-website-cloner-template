"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <section className="bg-[#e0ff0c] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[600px] text-center">
        <h2 className="font-heading text-[28px] text-[#003D2A] sm:text-[36px]">
          Rejoignez-nous !
        </h2>
        <p className="mt-3 text-[15px] text-[#003D2A]">
          Profitez de 10% offerts en vous inscrivant à notre newsletter :
          recevez des conseils nutrition pour prendre soin de vous au
          quotidien.
        </p>

        {subscribed ? (
          <p className="mt-6 text-[15px] font-medium text-[#003D2A]">
            Merci pour votre inscription ! Vérifiez votre boîte mail pour
            récupérer votre code de réduction.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Votre email"
              aria-label="Votre email"
              className="min-w-0 flex-1 basis-full rounded-full border border-[#003D2A] bg-transparent px-5 py-3 text-sm text-[#003D2A] placeholder-[#003D2A]/60 outline-none focus-visible:ring-2 focus-visible:ring-[#003D2A]/40 sm:basis-auto"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#003D2A] py-3 pr-3 pl-6 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:w-fit"
            >
              Je m&apos;inscris
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e0ff0c]">
                <ArrowRight className="size-4 text-[#003D2A]" />
              </span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
