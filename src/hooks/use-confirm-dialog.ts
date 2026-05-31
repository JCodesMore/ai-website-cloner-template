"use client";

import { useState, useCallback } from "react";

export function useConfirmDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => { setOpen(false); setLoading(false); }, []);

  return { open, loading, setLoading, show, hide };
}
