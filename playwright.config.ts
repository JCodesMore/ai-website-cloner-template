import { defineConfig } from "@playwright/test";

import { resolveE2EPort } from "./scripts/lib/playwright-server.mjs";

function quoteShellArgument(value: string) {
  if (process.platform === "win32") {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

const port = resolveE2EPort();
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  use: {
    baseURL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: {
    command: `${quoteShellArgument(process.execPath)} scripts/start-playwright-server.mjs`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
