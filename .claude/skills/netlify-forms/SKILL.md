---
name: netlify-forms
description: Serverless form handling on Netlify-hosted sites — detects HTML forms at deploy time, stores submissions, filters spam, and sends notifications. Use when adding a contact form, lead-capture form, file-upload form, or newsletter signup to a Netlify site; wiring AJAX form submission; setting up a custom thank-you page; adding a honeypot or reCAPTCHA to a form; getting forms working in Next.js, Nuxt, SvelteKit, Astro, or Gatsby; reading form submissions via the Netlify API; or debugging missing submissions and forms that silently fail to register.
---

# Netlify Forms

Mark a form for detection with `data-netlify="true"` (or the bare `netlify` attribute — equivalent) on the `<form>` tag. Forms are detected by **parsing the final built HTML at deploy time** — there is no runtime API call or backend code. Client-side/JS-rendered/SSR forms are NOT in the built HTML and are never detected on their own; they require a static skeleton file (see below).

Prerequisite: form detection must be enabled once in the Netlify UI (Forms > **Enable form detection**). Takes effect on the next deploy.

## Static HTML form

```html
<form name="contact" method="POST" data-netlify="true">
  <p><label>Your Name: <input type="text" name="name" /></label></p>
  <p><label>Your Email: <input type="email" name="email" /></label></p>
  <p><label>Message: <textarea name="message"></textarea></label></p>
  <p><button type="submit">Send</button></p>
</form>
```

- `name` sets the form name in the UI and **must be unique per site**.
- At deploy, Netlify strips the `data-netlify`/`netlify` attribute and injects `<input type="hidden" name="form-name" value="contact" />`.
- Add an `<input name="email">` so the notification email's `Reply-to` is set to the submitter.

## JS-rendered / SSR / framework forms (Next.js, Nuxt, SvelteKit, Astro, Gatsby)

Two required pieces:

**1. Static skeleton file `public/__forms.html`** — a hidden copy of each form with `data-netlify="true"`, a hidden `form-name` input, and every field the component submits, with names matching **exactly** (Netlify validates field names against the registered form). Without this file, submissions silently fail.

```html
<!-- public/__forms.html -->
<form name="pizzaOrder" data-netlify="true" hidden>
  <input type="hidden" name="form-name" value="pizzaOrder" />
  <input name="order" type="text" />
</form>
```

**2. The rendered form** carries a matching hidden `form-name` input:

```jsx
<form name="pizzaOrder" method="post" data-netlify="true" onSubmit={handleSubmit}>
  <input type="hidden" name="form-name" value="pizzaOrder" />
  <input name="order" type="text" onChange={handleChange} />
  <input type="submit" />
</form>
```

**⚠️ SSR POST target:** In SSR apps, `fetch("/")` is intercepted by the SSR catch-all function and never reaches form processing. POST to the static skeleton file itself — `/__forms.html` — not `/` or an arbitrary path.

**⚠️ Astro on-demand routes:** Routes with `export const prerender = false` or `output: "server"` are never scanned at build time, so their forms are never registered. Put the form on a prerendered page, or rely on the static skeleton file.

**Next.js Runtime v5 (Next.js 13.5+):** extract form definitions to the static skeleton file and submit via AJAX rather than full-page navigation. See https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview#v5-breaking-changes

## AJAX submission

```js
const handleSubmit = event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  fetch("/__forms.html", {   // static sites may POST to "/"; SSR must target the skeleton file
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
    .then(() => alert("Thank you for your submission"))  // or navigate("/thank-you")
    .catch(error => alert(error));
};
document.querySelector("form").addEventListener("submit", handleSubmit);
```

- **Body MUST be URL-encoded. JSON is NOT supported.**
- If the rendered form has no hidden `form-name` input, you MUST include a `form-name` field in the POST body.
- The honeypot field name and `g-recaptcha-response` (if used) must be in the body — automatic with `FormData()`.

## File uploads

Add `type="file"`; optionally `enctype="multipart/form-data"` on the `<form>`. For AJAX file uploads, **do NOT set a `Content-Type` header** — let the browser set it (with the multipart boundary).

```js
document.forms.fileForm.addEventListener("submit", event => {
  event.preventDefault();
  fetch("/", { body: new FormData(event.target), method: "POST" })  // no headers
    .then(() => { /* success */ });
});
```

Limits: one file per field (use multiple fields for multiple files) · 8 MB max request size · 30 s upload timeout · after form deletion, uploaded files stay at their direct URL for 24 h. PII uploads need extra security (Very Good Security integration).

## Custom success page

Add an `action` path relative to site root, starting with `/`. **Use extensionless paths** — Netlify serves `thank-you.html` at `/thank-you`; the `.html` path returns 404.

```html
<form name="contact" action="/thank-you" method="POST" data-netlify="true"></form>
```

Custom success *alert* is only possible via AJAX (substitute the redirect with your own logic).

## Spam prevention

All submissions are filtered by Akismet. Passed → **Verified submissions**; flagged → **Spam submissions**. Honeypot/reCAPTCHA failures are rejected and appear in neither list.

**Honeypot:** add `netlify-honeypot="bot-field"` to the `<form>` and include a CSS-hidden field of that name. Any value entered → submission quietly rejected.

```html
<form name="contact" method="POST" netlify-honeypot="bot-field" data-netlify="true">
  <p class="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
  <!-- real fields -->
</form>
```

**Netlify reCAPTCHA 2:** add `data-netlify-recaptcha="true"` to the `<form>` AND an empty `<div data-netlify-recaptcha="true"></div>` where it renders. Only ONE Netlify-provided challenge per page — for multiple, use custom reCAPTCHA. For JS-rendered forms, also add the `div` to the static skeleton file.

**Custom reCAPTCHA 2:** your own reCAPTCHA snippet + `data-netlify-recaptcha="true"` on the `<form>`, plus env vars:
- `SITE_RECAPTCHA_KEY` — site key (scopes: Builds + Runtime)
- `SITE_RECAPTCHA_SECRET` — secret (scope: Runtime)

## Email notifications & subject line

Default sender: `formresponses@netlify.com`. Set subject via a hidden `subject` input **or** the Netlify UI (Forms > Submission notifications) — **not both; the HTML value always overrides the UI.**

```html
<input type="hidden" name="subject" value="New lead from %{formName} (%{submissionId})" />
```

Variables: `%{formName}`, `%{siteName}`, `%{submissionId}`. Forms created before **May 5, 2023** carry a `[Netlify]` subject prefix — remove it by adding the `data-remove-prefix` attribute to the `subject` input.

Set up notifications (email/webhook/Slack) in the UI: Forms > Submission notifications > **Add notification**.

## Reading submissions via the API

Use only documented surfaces. Do NOT invent `api.netlify.com` endpoints or read tokens from local CLI config files. Reference: https://open-api.netlify.com/#tag/submission/operation/listFormSubmissions

- **Page through results using the `Link` header** — code that reads only the first response silently drops the rest.
- `listFormSubmissions` returns data from old/removed fields no longer shown in the UI.
- Query spam with `?state=spam`.

## Submission summary (field order matters)

The UI summary is derived from field **type**, not name:
- **Title**: first non-hidden text `<input>` that isn't email-like (`type="email"`, or name matching `email`/`mail`/`from`/`twitter`/`sender`); falls back to a field named `title` or `subject`.
- **Body**: first `<textarea>`.

Field order in the HTML affects what appears in the summary.

## Debugging missing submissions

- **First suspect: Akismet false positive.** A missing legitimate submission is usually spam-flagged — check the **Spam** list (or API `?state=spam`) and mark it verified. Do NOT build a custom recovery function or disable spam filtering as a first resort.
- Test submissions get flagged as spam: use a real email (not `test@test.com`), write full sentences, don't hammer from one IP.
- No submissions at all: confirm form detection is enabled (Forms > Form detection) and redeploy.
- SSR/JS forms silently failing: verify the static skeleton file exists with exactly-matching field names and that AJAX targets the skeleton file, not `/`.
- Missing old-field data: the UI shows only fields from the last deployed form version. Mark old fields `hidden` instead of removing them to keep them visible; old data remains available via `listFormSubmissions`.
- Still stuck: Netlify Support Guide on how to debug your form — https://answers.netlify.com/t/common-issue-how-to-debug-your-form/92

## Constraints

- Deleting a form is permanent: future submissions return `404`, past submissions become unavailable. Export CSV first.
- Submitted code is sanitized (`<script>` → escaped entities).
- For PII, export and delete data regularly.
- Data is stored in Netlify's database, not accessible except via UI/API/CSV.

<!-- system: agent-context/forms/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (forms)

These are org conventions and field-learned guardrails, not docs facts — they
are merged into the rendered skill by ctx-gen and are never generated.
Extracted from the previous hand-written netlify-forms skill; owned by the
skills maintainer.

1. In SSR apps (Next.js, Nuxt, SvelteKit, etc.), `fetch("/")` is intercepted
   by the SSR catch-all function and never reaches Netlify's form processing.
   POST the AJAX submission to the static skeleton file itself (e.g.
   `/__forms.html`), not to an arbitrary path.
2. Use only documented surfaces: do not curl `https://api.netlify.com/...`
   with an invented endpoint shape, and do not read tokens out of local CLI
   config files (`~/Library/Preferences/netlify/config.json`).
3. When reading submissions via the API, page through results (`Link`
   header); code that reads only the first response silently drops the rest.
4. For JS-rendered and SSR forms, always create the static skeleton file
   `public/__forms.html`: a hidden copy of each form with
   `data-netlify="true"`, a hidden `form-name` input, and every field the
   component submits — names matching exactly (Netlify validates field names
   against the registered form). Without this file, submissions silently fail.
5. Astro routes rendered on demand (`export const prerender = false`, or
   `output: "server"` routes) are never scanned at build time, so their forms
   are never registered. Put the form on a prerendered page or rely on the
   static skeleton file.
6. A "missing" legitimate submission is usually an Akismet false positive:
   check the Spam list (or the API with `?state=spam`) and mark it verified.
   Do not build a custom recovery function or disable spam filtering as a
   first resort.
7. For custom success pages, use extensionless `action` paths (`/thank-you`,
   not `/thank-you.html`) — Netlify serves `thank-you.html` at `/thank-you`
   and the `.html` path returns 404.
