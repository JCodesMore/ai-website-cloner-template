"use client";

import { Icon } from "./Icon";
import { useCases } from "@/data/integral-security";

export function UseCases() {
  return (
    <section className="relative border-b border-border/40 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-foreground/55">
            <span className="mr-3 inline-block size-1.5 align-middle bg-accent" />
            Casos de uso
          </div>
          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight md:text-5xl">
            La misma plataforma,
            <br />
            <span className="text-foreground/80">adaptada a cada operación.</span>
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {useCases.map((u) => (
            <article
              key={u.id}
              className="group flex flex-col border border-border/50 bg-background/40 p-6 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-secondary/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {u.industry}
                </span>
                <Icon path={u.icon} size={22} className="text-foreground/60 transition-colors group-hover:text-accent" />
              </div>

              <h3 className="mt-5 font-heading text-2xl font-black uppercase leading-tight tracking-tight">
                {u.title}
              </h3>

              <ul className="mt-5 space-y-2 font-mono text-[12px] leading-relaxed text-foreground/75">
                {u.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-1 text-accent">▸</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
