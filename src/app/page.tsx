import Link from "next/link";

type Clone = {
  slug: string;
  title: string;
  origin: string;
  blurb: string;
  status: "ready" | "in-progress";
};

const CLONES: Clone[] = [
  {
    slug: "monochrome",
    title: "Monochrome",
    origin: "monochrome.so",
    blurb: "Japanese building-integrated solar panel brand. KV carousel, dark journal section, hover-driven architect grid.",
    status: "ready",
  },
];

export default function HubPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-20 md:py-28">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          copier
        </p>
        <h1 className="text-3xl font-medium md:text-4xl">
          Pixel-perfect website clones, all in one repo.
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-neutral-600 md:text-base">
          Each clone is a Next.js route under <code className="font-mono text-neutral-800">/&lt;slug&gt;</code> with
          its own design tokens, fonts, and downloaded assets. Run{" "}
          <code className="font-mono text-neutral-800">/clone-website &lt;url&gt;</code> in
          Claude Code to add a new one.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          Clones
        </h2>
        <ul className="flex flex-col gap-2">
          {CLONES.map((clone) => (
            <li key={clone.slug}>
              <Link
                href={`/${clone.slug}`}
                className="group flex flex-col gap-1 rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-lg font-medium">{clone.title}</span>
                  <span className="font-mono text-xs text-neutral-500">
                    /{clone.slug}
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-500">
                  {clone.origin}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {clone.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto flex flex-col gap-2 border-t border-neutral-200 pt-8 text-xs text-neutral-500">
        <p>
          Repo layout: <code className="font-mono">src/app/&lt;slug&gt;/</code>{" "}
          + <code className="font-mono">public/clones/&lt;slug&gt;/</code> +{" "}
          <code className="font-mono">docs/research/&lt;slug&gt;/</code>.
        </p>
        <p>
          Run <code className="font-mono">node scripts/download-assets.mjs &lt;slug&gt;</code> to
          fetch a clone's assets.
        </p>
      </footer>
    </main>
  );
}
