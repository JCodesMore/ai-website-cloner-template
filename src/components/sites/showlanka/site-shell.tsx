import "./showlanka.css";
import "./showlanka-pages.css";
import type { ReactNode } from "react";
import { Analytics } from "./analytics";
import { PageTransitions, Preloader } from "./page-effects";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/** Chrome shared by every showlanka.com route: preloader, header, footer. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="sl">
      <Preloader />
      <PageTransitions />
      <SiteHeader />
      <main id="main" className="site-main">
        {children}
      </main>
      <SiteFooter />
      <Analytics />
    </div>
  );
}
