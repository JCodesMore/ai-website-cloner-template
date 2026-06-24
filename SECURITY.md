# Security Policy

## Supported versions

This is a project template, not a versioned library. Security fixes are applied to the `master` branch. If you generated a project from this template, pull the relevant fixes into your own copy.

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, report privately via [GitHub's "Report a vulnerability"](https://github.com/JCodesMore/ai-website-cloner-template/security/advisories/new) (Security → Advisories). If that is unavailable, reach out to a maintainer through the [Discord community](https://discord.gg/hrTSX5yTpB).

When reporting, please include:

- A description of the issue and its impact
- Steps to reproduce (or a proof of concept)
- Affected files or dependencies, if known

We'll acknowledge your report as soon as we can and keep you updated on the fix.

## Scope

The template ships a Next.js scaffold and AI-agent instructions. Relevant security concerns include:

- Vulnerabilities in bundled dependencies (`npm audit`)
- Issues in the helper scripts under `scripts/`
- Configuration defaults that could weaken the security of a generated project

## Responsible use

This template reverse-engineers websites. As noted in the [README](README.md#not-intended-for), it must **not** be used for phishing, impersonation, passing off others' designs as your own, or violating any site's terms of service. Misuse is the responsibility of the user, not this project.
