"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface UserInfo {
  username: string;
  phone?: string;
  createdAt?: string | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        setUser(data.authenticated ? { username: data.username, phone: data.phone, createdAt: data.createdAt } : null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [pathname]);

  return { user, loading };
}
