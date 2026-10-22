import { expect, test } from "@playwright/test";

const guardedResourceTypes = new Set([
  "document",
  "font",
  "image",
  "media",
  "script",
  "stylesheet",
]);

function isFirstPartyGuardedResource(
  requestUrl: string,
  resourceType: string,
  firstPartyOrigin: string,
) {
  if (!guardedResourceTypes.has(resourceType)) {
    return false;
  }
  try {
    return new URL(requestUrl).origin === firstPartyOrigin;
  } catch {
    return false;
  }
}

test("production template serves a healthy first-party document", async ({ page }) => {
  const baseURL = test.info().project.use.baseURL;
  if (typeof baseURL !== "string") {
    throw new Error("Playwright baseURL must be configured");
  }
  const firstPartyOrigin = new URL(baseURL).origin;
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const requestFailures: string[] = [];
  let successfulStaticResponses = 0;

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });
  page.on("requestfailed", (request) => {
    if (isFirstPartyGuardedResource(request.url(), request.resourceType(), firstPartyOrigin)) {
      requestFailures.push(
        `${request.resourceType()} ${request.url()} failed: ${request.failure()?.errorText ?? "unknown error"}`,
      );
    }
  });
  page.on("response", (response) => {
    const request = response.request();
    let responseUrl: URL;
    try {
      responseUrl = new URL(response.url());
    } catch {
      return;
    }
    if (responseUrl.origin !== firstPartyOrigin) {
      return;
    }
    if (responseUrl.pathname.startsWith("/_next/static/") && response.ok()) {
      successfulStaticResponses += 1;
    }
    if (guardedResourceTypes.has(request.resourceType()) && response.status() >= 400) {
      requestFailures.push(
        `${request.resourceType()} ${response.url()} returned HTTP ${response.status()}`,
      );
    }
  });

  const navigation = await page.goto("/", { waitUntil: "load" });

  expect(navigation, "document navigation must produce an HTTP response").not.toBeNull();
  expect(navigation?.status()).toBe(200);
  await expect(page.getByRole("main")).toBeVisible();
  expect((await page.locator("body").innerText()).trim().length).toBeGreaterThan(0);
  expect(successfulStaticResponses, "at least one Next.js static asset must load").toBeGreaterThan(0);
  expect(pageErrors, "uncaught page errors").toEqual([]);
  expect(consoleErrors, "error-level console messages").toEqual([]);
  expect(requestFailures, "failed first-party document and asset requests").toEqual([]);

  const horizontalOverflow = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    return Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - viewportWidth;
  });
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});
