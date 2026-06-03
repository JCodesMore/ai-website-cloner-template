"use client";

import { useEffect, useRef } from "react";

export default function ArticleTracker({ articleId }: { articleId: number }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      fetch(`/api/articles/${articleId}/view`, {
        method: "POST",
        keepalive: true,
      }).catch(() => {});
    }

    const interval = setInterval(() => {
      navigator.sendBeacon(`/api/articles/${articleId}/read`);
    }, 30000);

    return () => clearInterval(interval);
  }, [articleId]);

  return null;
}
