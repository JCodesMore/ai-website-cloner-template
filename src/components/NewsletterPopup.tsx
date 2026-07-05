"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";

const PREFERENCES = [
  "Je préfère des conseils sur l'énergie",
  "Je préfère des conseils sur le sommeil",
  "Je préfère des conseils sur la digestion",
  "Je préfère des conseils sur l'immunité",
];

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [preference, setPreference] = useState("");

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  function close() {
    setOpen(false);
    setDismissed(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-[#fcfaf0] shadow-2xl md:grid-cols-2">
        <button
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003D2A] shadow"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col justify-center gap-5 p-8">
          <h2 className="font-heading text-2xl text-[#003D2A] md:text-3xl">
            10% de réduction sur votre première commande
          </h2>
          <p className="text-sm text-[#1a1a1a]">
            La newsletter Onday, c&apos;est des conseils bien-être chaque semaine ! Quel sujet
            vous intéresse le plus ?
          </p>

          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="rounded-full border border-[#003D2A]/30 bg-white px-4 py-3 text-sm text-[#1a1a1a]"
          >
            <option value="">Je préfère des conseils...</option>
            {PREFERENCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="rounded-full border border-[#003D2A]/30 bg-white px-4 py-3 text-sm text-[#1a1a1a]"
          />

          <button
            type="button"
            onClick={close}
            className="rounded-full bg-[#003D2A] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Je débloque ma réduction
          </button>

          <button
            type="button"
            onClick={close}
            className="text-center text-sm text-[#7d7d7d] underline-offset-2 hover:underline"
          >
            Peut-être plus tard
          </button>
        </div>

        <div className="relative hidden min-h-[420px] md:block">
          <Image
            src="/images/onday/Mosaique_site_internet_1.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/20 text-2xl text-white">
            <span>off</span>
            <span className="relative inline-flex h-8 w-16 items-center rounded-full bg-white/30">
              <span className="absolute h-6 w-6 translate-x-1 rounded-full bg-[#e0ff0c]" />
            </span>
            <span className="italic">
              <ArrowRight className="sr-only" />
              on
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
