"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileShell } from "./MobileShell";

/**
 * Wraps page content with the mobile shell (bottom-tab nav + drawers + toasts)
 * on mobile viewports. On desktop, renders children unchanged so the existing
 * Navbar + Footer keep working.
 */
export function ResponsiveShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  // First paint: render desktop layout to avoid hydration mismatch.
  if (isMobile === null) return <>{children}</>;

  if (isMobile) {
    return <MobileShell>{children}</MobileShell>;
  }

  return <>{children}</>;
}
