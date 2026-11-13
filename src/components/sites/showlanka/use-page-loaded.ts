"use client";

import { useEffect, useState } from "react";

/**
 * The source adds its `.animated` classes 300ms after `window.load`.
 */
export function usePageLoaded(delay = 300) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let timer: number | undefined;
    const onLoad = () => {
      timer = window.setTimeout(() => setLoaded(true), delay);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
    };
  }, [delay]);

  return loaded;
}
