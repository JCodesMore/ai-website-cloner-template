# Netlify Database — operational footguns

Real-world failure modes that don't show up in a happy-path build but bite in production or previews.

## An unclaimed legacy-extension database is on a deletion timer

The old `@netlify/neon` extension flow provisioned each database as an *unclaimed* Neon resource that the user had to claim into their own Neon account within a short grace period (about a week). If that window closes without the claim being completed, the database is **automatically deleted — along with all its data**. So if you land on an `@netlify/neon` project and see any sign the claim was never finished (no linked Neon account, a dashboard banner warning that the database is unclaimed or will be deleted), treat it as urgent: tell the user their data is at risk and that they must complete the claim in the Netlify/Neon dashboard to keep it, then plan a move to Netlify Database (GA). Claiming is a dashboard/account action the user performs — never try to claim, rescue, or back up the database through side-channel API calls, and don't assume the data is safe just because the app still reads from it today. (This claim step is specific to the legacy extension; Netlify Database (GA) never needs claiming.)

## Create the database client once, at module scope — never per request

Put `const db = getDatabase()` (or the Drizzle `export const db = drizzle({ schema })`) at the top level of the module and import that shared instance where you need it. Calling `getDatabase()` or constructing a new client *inside* a handler opens a fresh Postgres connection on every request; under load that exhausts the connection limit (the limit scales with compute size, but per-invocation clients blow through any of them) and requests start failing with "too many connections" errors. Instantiate once, reuse across invocations.

## Scale-to-zero cold starts

Netlify Database scales database compute to zero after a period of inactivity (a few minutes idle by default) and restarts it on the next query. The practical consequence: the **first query after an idle period is slower** while the compute wakes up, then subsequent queries run at full speed again. This is expected scale-to-zero behavior — not a bug, a misconfiguration, or a connection leak — and it shows up most on low-traffic sites and preview branches.

When you see an occasional slow first query, don't treat it as an error to engineer away:

- **Don't hand-roll a keep-alive pinger** — a cron job or scheduled function that queries the database on an interval purely to keep it warm. That defeats scale-to-zero, and standing up a background workaround against a managed primitive is exactly the kind of side-channel this skill tells you to avoid.
- **Don't switch drivers or stand up an external connection pooler** to "fix" the latency. Keep using `getDatabase()`.
- **Don't set an aggressively short query timeout** that trips on the wake-up. Allow enough headroom for the first query, and let the module-scope client (above) keep the connection warm within a running instance.

The warmed-up latency is what matters for a running instance; the first-query wake-up is inherent to scale-to-zero and needs no code change. If cold-start latency genuinely matters for a workload, surface it to the user as a capacity/plan conversation rather than engineering around it.

## A preview branch is a live copy of production data — including any PII

Preview branches are forked from production, so real user records (names, emails, whatever production holds) exist in the preview database. Deploy preview URLs are **public-by-link** unless you enable access protection — anyone with the preview link can read that production-derived data through the app. Before sharing a preview link outside your team, enable Password Protection / SSO on the deploy (see `netlify-access-control/SKILL.md`), or seed the preview with non-production data. Never assume a preview is private just because it isn't the production URL.
