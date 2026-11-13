"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Inline <script> that exists only in the server HTML, where the browser runs it while parsing.
 * Client renders return null: React can't execute a script it creates and warns when it tries.
 */
export function InlineScript({ id, code }: { id: string; code: string }) {
  const isServerHtml = useSyncExternalStore(subscribe, () => false, () => true);
  if (!isServerHtml) return null;
  return <script id={id} dangerouslySetInnerHTML={{ __html: code }} />;
}
