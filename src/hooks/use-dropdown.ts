"use client";

import { useState, useRef, useCallback } from "react";

export function useDropdown(closeDelay = 150) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const onMouseEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  return { open, setOpen, onMouseEnter, onMouseLeave };
}
