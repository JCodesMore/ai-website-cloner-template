---
name: netlify-access-control
description: 'Picks the right Netlify site-protection layer and disambiguates the three unrelated "auth" concepts users conflate — app-user login (Netlify Identity), site-load gating (Password Protection / project visibility), and dashboard SAML SSO. Use it when asked to password-protect a site or Deploy Preview, make a project private/public, restrict a site to your team, require SSO to view a site, set up company-wide app SSO, or invite users to a private project. Also use it for SSO-session symptoms on protected sites: "logged out mid-session", 401s after about an hour, or token expiry/refresh questions. Not for wiring auth code — route app-login setup to netlify-identity.'
---

# Netlify access control — pick the protection layer

This skill routes you to the correct protection layer. It does not teach each one. **These settings have no public API, CLI command, or MCP tool.** Never curl `api.netlify.com` or read local auth tokens to inspect or change them — give the user the dashboard path and checklist. On failure, report what you tried and stop.

## First: disambiguate "auth" — three unrelated layers

Users constantly conflate these. Identify which one is meant before recommending anything.

1. **Netlify Identity** — "who is this user *inside my app*." Issues `nf_jwt`. → route to the **netlify-identity** skill; not covered here.
2. **Password Protection / project visibility** — "can this request load the site at all." Covered here.
3. **Team/Org SAML SSO** — "can you log in to the Netlify *dashboard*." Gates dashboard access; also underlies team-login site protection.

Sessions are separate. The same provider (e.g. Google) can appear twice unrelated — Identity OAuth for app users vs. SAML IdP for team members.

**Double-login footgun:** a Password-Protection/team-login perimeter session and an Identity app session have **no bridge** — no shared cookie, no header forwarding, no JWT exchange. Don't try to wire them together. For the combined layered pattern and its tradeoffs, see `references/two-layer-pattern.md`.

**Want company-wide app SSO with a single sign-in (no double login)?** Recommend the **Auth0 extension** federating to the corporate IdP *before* the two-layer stack.

## Decision guide (this skill's job)

- Restrict entire site to your team, invite by email → **Private project** (Credit-based) or **Team login protection** (Password Protection).
- Share with anyone holding one shared password → **Basic password protection** (Pro) or **Password** visibility (Pro, Credit-based).
- Keep production public, protect previews only → scope **Previews only** / **Non-production deploys only**.
- Require SSO to *view a site* → Organization/Team SSO with **Only SSO allowed (strict)**, then Password Protection with **Team login protection**.
- Protect specific pages/sections with multiple passwords → **Basic authentication with custom HTTP headers** (formerly Selective password protection): https://docs.netlify.com/manage/security/secure-access-to-sites/basic-authentication-with-custom-http-headers/
- Authenticate your own end users → **Netlify Identity** / **OAuth provider tokens** / **Role-based access control with JWT** → route to netlify-identity.
- Block malicious/automated traffic or AI crawlers → **Advanced Web Security** (WAF / Firewall Traffic Rules / rate limiting) or **User Agent Blocker** extension: https://docs.netlify.com/build/build-with-ai/block-ai-crawlers/

## Key distinction: Private vs Password

- **Private** already requires Netlify credentials — no shared password. Invite by email; recommended for team-only access.
- **Password** = one universal shared password anyone can use (including managing team members, who must also enter it). No SSO.
- **Team login protection** = same mechanism as Private: a visitor must log in as a member of your Netlify team, and **Reviewers** you invite can get in too (unlimited and not counted toward the member count on legacy plans; Pro or higher on Credit-based plans). **Git Contributors cannot log in** — invite them as Reviewers rather than upgrading them to Developer.

## SSO-session symptom: 401s after ~1 hour

If a user reports being "logged out mid-session" or 401s on an SSO-protected site: **SSO auth tokens expire after 1 hour**, after which requests return `401`. Sites with SSO protection return the header **`Netlify-Site-Protection-Expires-In`** — seconds until the request's token expires. Refresh proactively:

```js
// Client-side. Checks the Netlify SSO protection header and reloads before expiry.
const res = await fetch(window.location.href, { method: "HEAD" });
const secondsLeft = Number(res.headers.get("Netlify-Site-Protection-Expires-In"));
// Tokens last 1 hour (3600s). Reload a bit early to avoid a 401.
if (!Number.isNaN(secondsLeft) && secondsLeft < 60) {
  window.location.reload();
}
```

## UI paths (the only path — no API)

**Credit-based plans (Free, Personal, Pro)** — project-level "Password Protection" is replaced by **Project visibility**:
- Per project: Project configuration > General > Visitor access > **Project visibility** — `https://app.netlify.com/projects/{site_name}/configuration/general/#project-visibility`. Edit visibility → (Customize if a team default exists) → **Public** / **Password** (Pro only) / **Private** → set **Preview access** (Production and previews / Previews only) → Save.
- Team default: Team settings > General > Visitor access > **Default project visibility** — `https://app.netlify.com/teams/{team_name}/settings/general#default-project-visibility`. Options: Private for new projects / Private for all projects / Public for new projects.
- No per-team default *password* here; set a password per project.

**Enterprise / Open Source / legacy (non-Credit-based)** — use **Password Protection** UI:
- Per site: Project configuration > General > Visitor access > **Password Protection** — `https://app.netlify.com/projects/{site_name}/configuration/general#visitor-access`. Configure → Basic or Team login → scope (All deploys / Non-production deploys only) → Save.
- Team default: Team settings > Access & security > Visitor access > **Default Password Protection settings** — `https://app.netlify.com/teams/{team_name}/settings/access#default-site-protection-settings`. Applies to all sites without their own settings.

**Legacy → Credit-based mapping:** No protection→Public · Basic protection→Password · Team protection→Private · All deploys→Production and previews · Non-production deploys only→Previews only.

## Constraints & footguns

- **Site-specific Password Protection overrides team defaults.**
- **Who can change these settings:** project visibility — Organization Owners (on certain Enterprise plans), Team Owners, and Developers with access to that project; **Internal Builders cannot publish to production, so they cannot make a project public**. Password Protection — a Developer changes it per site, a Team Owner sets the team default.
- **Advanced Web Security runs before password/login prompts** — a blocked IP hits an error page before ever seeing the prompt. Internal order: Firewall Traffic Rules → WAF → Rate limiting.
- **Third-party webhooks (Slack, Stripe, etc.) cannot reach a private project** — receiving webhooks requires the project to be **public**.
- **Make public** requires at least one successful **production deploy**.
- **Protecting only non-production deploys** with Password Protection is **Enterprise only**.
- **Plan gating:** Basic password protection for the whole site → all Pro plans; all Password Protection options → Enterprise. Project visibility (public/private, private-by-default) → Credit-based Free/Personal/Pro only; password-protected visibility → Pro only. On Free/Personal a private project is visible only to the Team Owner (single-seat); Pro allows unlimited members.
- **Team default changes by creation date:** teams created on/after **July 28, 2026** default to **Private for new projects**; earlier teams default to **Public**.
- **Renamed:** "site-wide password protection" (old name of a Password Protection option); "Selective password protection" → Basic authentication with custom HTTP headers.

Reference: https://docs.netlify.com/manage/security/secure-access-to-sites/overview/ · https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/ · https://docs.netlify.com/manage/security/secure-access-to-sites/project-visibility/

<!-- Advanced Web Security (WAF, Firewall Traffic Rules, rate limiting) specifics — limits, config keys, plan gating — not in source; referenced by URL only. -->
<!-- Exact per-tier matrix of basic vs team-login options across plans is only partially stated in sources. -->

<!-- system: agent-context/access-control/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (access-control)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. This is a routing/disambiguation skill: keep it narrow — its job is
   picking the right protection layer, not teaching each one.
2. The combined Password-Protection + Identity pattern lives in this skill's
   `references/two-layer-pattern.md`.
3. "Auth" on Netlify is three unrelated layers users constantly conflate:
   Netlify Identity ("who is this user inside my app" — issues `nf_jwt`),
   Password Protection / project visibility ("can this request load the site
   at all"), and Team/Org SAML SSO ("can you log in to the Netlify
   dashboard"). Sessions are separate; the same provider (Google) can appear
   in two unrelated places — Identity OAuth for app users, SAML IdP for team
   members. Disambiguate before recommending anything.
4. The double login is real: a Password-Protection/team-login perimeter
   session and an Identity app session have no bridge — no shared cookie, no
   header forwarding, no JWT exchange. Don't burn iterations wiring them
   together; tradeoffs live in `references/two-layer-pattern.md`.
5. These settings have no public API, CLI command, or MCP tool. Never curl
   `api.netlify.com` or read local auth tokens to inspect or change them —
   hand the user the dashboard path and checklist; on failure, report what
   you tried and stop.
6. Identity setup, auth code, and OAuth providers for app users belong to the
   netlify-identity skill — route there; this skill only picks the layer.
7. For company-wide app-level SSO with a single sign-in (no double login),
   the Auth0 extension — federating to the corporate IdP — is the
   recommendation before the two-layer stack.
8. The description's triggers must include the SSO-session symptoms users
   actually report — "logged out mid-session", 401s on an SSO-protected
   site, token expiry/refresh — not only setup phrasing. The
   `Netlify-Site-Protection-Expires-In` guidance is unreachable if the
   skill never triggers on the symptom.
9. Team login protection excludes Git Contributors, and the answer to that is
   **Reviewers**, never a Developer seat. Reviewers can open team-login-
   protected deploys: unlimited and not counted toward the member count on
   legacy plans, Pro or higher on Credit-based plans. Every answer about Git
   Contributor access must name the Reviewer path — recommending an upgrade to
   Developer sells a paid seat per person to solve something the product
   already solves for free. Stating the exclusion without the remedy is the
   failure mode this rule exists to prevent; it has happened. Never frame the
   permitted roles as a closed list ("only X, Y and Z get in") — even with the
   Reviewer path added after it, a closed list reads as Reviewers being shut
   out, and agents repeat it. Naming roles is optional; the question is
   usually only about Git Contributors.
10. Say who can change these settings, not only how to change them. Project
   visibility: Organization Owners (on certain Enterprise plans), Team Owners,
   and Developers with access to that project — and Internal Builders cannot
   make a project public, because they cannot publish to production. Password
   Protection: a Developer per site, a Team Owner for the team default. A
   checklist handed to someone without the role is a dead end.
