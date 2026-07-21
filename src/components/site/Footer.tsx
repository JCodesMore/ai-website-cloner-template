import Link from "next/link";
import Image from "next/image";

const cols = [
  { h: "Browse", links: ["Trending", "Popular", "Seasonal", "Movies", "Schedule"] },
  { h: "Genres", links: ["Action", "Romance", "Comedy", "Fantasy", "Horror"] },
  { h: "Company", links: ["About", "Contact", "DMCA", "Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--border)] bg-[#040508] px-6 py-10 md:pl-[92px]">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/icon.png" alt="AnimeSaga" width={28} height={28} />
            <span className="font-heading text-lg font-extrabold tracking-tight">
              ANIME<span className="text-accent">SAGA</span>
            </span>
          </Link>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Stream your favorite anime series and movies in HD. AnimeSaga does not
            store any files on its server.
          </p>
        </div>
        <div className="flex gap-12">
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
                {c.h}
              </h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-xs text-muted-foreground transition-colors hover:text-accent"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 border-t border-[var(--border)] pt-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} AnimeSaga. All rights reserved.
      </p>
    </footer>
  );
}
