"use client";

import { useEffect, useState, type IframeHTMLAttributes } from "react";

/**
 * The source lazy-loads its third-party iframes (Smush lazyload), so they never
 * hold up `window.load`, which drives the preloader and entry animations.
 */
export function DeferredIframe({ src, ...props }: IframeHTMLAttributes<HTMLIFrameElement> & { src: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onLoad = () => setActive(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(onLoad, 0);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return <iframe {...props} src={active ? src : undefined} />;
}
