#!/usr/bin/env node

import { runPackageManager } from "./lib/codex-pipeline.mjs";

try {
  const result = await runPackageManager(process.argv.slice(2));
  if (!result.ok) {
    if (result.kind === "spawn-error") {
      console.error(`npm failed to launch: ${result.error.message}`);
      process.exitCode = 1;
    } else if (result.kind === "signal") {
      console.error(`npm terminated by ${result.signal}`);
      process.exitCode = 1;
    } else {
      process.exitCode = result.code;
    }
  }
} catch (error) {
  console.error(`npm unavailable: ${error.message}`);
  process.exitCode = 1;
}
