---
name: netlify-ai-gateway
description: Use Netlify AI Gateway to call OpenAI, Anthropic Claude, Google Gemini, TypeSafe (Jev), or OpenRouter-hosted models (xAI/DeepSeek/Meta/Mistral/Qwen) from Netlify Functions or Edge Functions without managing provider accounts or API keys. Reach for this when adding an AI feature to a Netlify app — a chatbot, text summarizer, image generator, joke/content generator, form-submission routing or analysis, or any LLM call — or when wiring the OpenAI/Anthropic/Gemini/TypeSafe/OpenRouter SDK into a Netlify Function, choosing which env vars to use, streaming long generations, or debugging why gateway calls fail at build time or return 401.
---

# Netlify AI Gateway

Call AI models from Netlify compute using the provider's official SDK. The gateway injects provider credentials automatically — instantiate the SDK with no args and it works.

**Use the provider SDK with injected env credentials.** Do not hand-roll a raw `fetch()` against the gateway URL, and do not wire calls to `NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_URL` as your default path — those are for third-party/unsupported libraries only (see below).

## Footguns (read first)

- **Not browser-callable.** Gateway calls belong in Functions or Edge Functions — never in client-side code. The browser has no injected credentials.
- **Runtime-only credentials.** Never call the gateway from build scripts, prerender/SSG, or build plugins — those get no credentials and fail. Do AI work at request time; cache to Netlify Blobs if output must look precomputed.
- **60-second sync timeout.** A gateway call in a synchronous function is bound by the 60s function timeout. Stream long generations (SDK streaming + `ReadableStream`), or use a background function that persists output for the client to fetch. Never leave a slow generation unstreamed.
- **Requires one production deploy.** The gateway does not activate until a project has at least one production deploy. Even for local dev, run `netlify deploy --prod` once first.
- **Don't hardcode model lists.** Available models change. Check the live providers endpoint (`https://api.netlify.com/api/v1/ai-gateway/providers/detailed`) rather than baking in a static list.
- **OpenRouter SDK needs 1.2.43+.** Earlier versions ignore `OPENROUTER_BASE_URL`, call openrouter.ai directly, and fail with `401 Missing Authentication header`.

## Where code goes

Write normal Function/handler code — there is no AI-specific file type. A function at `netlify/functions/joke.js` exporting `config = { path: "/api/joke" }` is served at `/api/joke` under both `netlify dev` and production.

## Provider SDKs (instantiate with no args)

The gateway injects each provider's own env vars, so the official SDK works with zero config.

Anthropic Claude:
```js
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic(); // uses ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL

const message = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

OpenAI:
```js
import OpenAI from 'openai';
const openai = new OpenAI(); // uses OPENAI_API_KEY, OPENAI_BASE_URL

const completion = await openai.chat.completions.create({
  model: 'gpt-5',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

Google Gemini:
```js
import { GoogleGenAI } from '@google/genai';
const genAI = new GoogleGenAI({}); // uses GEMINI_API_KEY, GOOGLE_GEMINI_BASE_URL

const result = await genAI.models.generateContent({
  model: 'gemini-2.5-pro',
  contents: 'Hello!'
});
```

TypeSafe (Jev) — structured decisions (e.g. routing/classifying form submissions):
```ts
import type { Config, Context } from '@netlify/functions';
import { choice, TypeSafeClient } from '@typesafe-ai/sdk';

export default async (req: Request, context: Context) => {
  const body = await req.json().catch(() => undefined);
  if (body === undefined)
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });

  const client = new TypeSafeClient(); // uses TYPESAFE_API_KEY, TYPESAFE_BASE_URL
  const { answers } = await client.systemOne({
    state: body,
    questions: {
      team: choice('Route this contact form submission', {
        sales: null,
        support: null,
        spam: null,
      }),
    },
  });

  return Response.json({ team: answers.team.choice, requestId: context.requestId });
};

export const config: Config = { path: '/api/route', method: 'POST' };
```
`systemOne` defaults to the `jev-latest` model. Each question is a `choice(prompt, options)` mapping named options to `null`; the result is at `answers.<question>.choice`. POST a JSON body (e.g. `{"message":"Can someone help us upgrade to 200 seats?"}`) with `Content-Type: application/json`.

OpenRouter (SDK 1.2.43+ required — see footguns):
```js
import { OpenRouter } from '@openrouter/sdk';
const openRouter = new OpenRouter(); // uses OPENROUTER_API_KEY, OPENROUTER_BASE_URL

const result = await openRouter.chat.send({
  chatRequest: {
    model: 'x-ai/grok-4.5',
    messages: [{ role: 'user', content: 'Hello!' }]
  }
});
```

Models available through OpenRouter can be called with either the OpenRouter SDK or the OpenAI SDK using OpenRouter model-ID notation (e.g. `deepseek/deepseek-v4-flash-0731`) — just pass the ID as the `model`.

Model IDs above (`gpt-5`, `claude-sonnet-4-5-20250929`, `gemini-2.5-pro`, `x-ai/grok-4.5`, etc.) are examples that change — check the live providers endpoint.

## Env vars — which to use

**Default:** supported provider SDKs consume their injected provider-specific vars automatically. Instantiate the SDK with no args as shown above (`new OpenAI()`, `new Anthropic()`, `new GoogleGenAI({})`, `new TypeSafeClient()`, `new OpenRouter()`) and the corresponding pair is read for you:

- OpenAI: `OPENAI_API_KEY`, `OPENAI_BASE_URL`
- Anthropic: `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`
- Google Gemini: `GEMINI_API_KEY`, `GOOGLE_GEMINI_BASE_URL`
- OpenRouter: `OPENROUTER_API_KEY`, `OPENROUTER_BASE_URL`
- TypeSafe: `TYPESAFE_API_KEY`, `TYPESAFE_BASE_URL`

**Explicit-config path:** `NETLIFY_AI_GATEWAY_KEY` and `NETLIFY_AI_GATEWAY_URL` are always injected and never collide with user-set provider vars. Use this pair only when a third-party or unsupported library needs explicit key/base-URL configuration — pass them as constructor arguments. It is not the default; supported SDKs should use their provider-specific vars above.

**Precedence:** Netlify never overrides a key or base URL you set at project or team level. If you set your own provider key, the gateway defers to it. For Gemini specifically, injection is skipped if `GOOGLE_API_KEY` or `GOOGLE_VERTEX_BASE_URL` is set (Vertex/Google-API-key setups win).

To stop all injection, disable AI Features: https://docs.netlify.com/build/build-with-ai/manage-ai-for-your-team/manage-ai-features/#disable-ai-features

## Full example (Vite + React + Function)

Detect gateway availability by checking for an injected var, then call the SDK.

Install the client first: `npm install openai`. Then create `netlify/functions/joke.js`:
```js
import process from "process";
import OpenAI from "openai";

export default async () => {
  if (!process.env.OPENAI_BASE_URL)
    return Response.json({ error: "AI Gateway not active — deploy to prod once on a credit-based plan" });

  try {
    const client = new OpenAI();
    const res = await client.responses.create({
      model: "gpt-5-mini",
      input: [{ role: "user", content: "Give me a short dad joke about coffee" }],
      reasoning: { effort: "minimal" },
    });
    return Response.json({
      joke: res.output_text?.trim() || "Out of jokes",
      model: res.model,
      tokens: { input: res.usage.input_tokens, output: res.usage.output_tokens },
    });
  } catch (e) {
    return Response.json({ error: `${e}` }, { status: 500 });
  }
};

export const config = { path: "/api/joke" };
```

`src/App.jsx` fetches `/api/joke`:
```jsx
import { useState } from "react";

export default function App() {
  const [joke, setJoke] = useState();
  const [loading, setLoading] = useState(false);

  const getJoke = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/joke");
      setJoke(res.ok ? await res.json() : { error: res.status });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={getJoke} disabled={loading}>
        {loading ? "Thinking..." : "Get joke"}
      </button>
      <pre>{JSON.stringify(joke, null, 2)}</pre>
    </>
  );
}
```

## Local development

Two options — both need at least one prior production deploy:

1. **Netlify CLI:** `netlify dev` gives full gateway support.
2. **Vite plugin:** access the gateway locally without `netlify dev`. Add `@netlify/vite-plugin` and run your native dev command (`npm run dev`):
```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import netlify from "@netlify/vite-plugin";

export default defineConfig({ plugins: [react(), netlify()] })
```

Setup flow:
```shell
npm install -g netlify-cli@latest
netlify login
npm create vite@latest dad-jokes -- --template react --no-interactive
cd dad-jokes && npm install
netlify init
netlify deploy --prod --open   # required: activates the gateway
```

## Billing, limits, constraints

- **Plans:** Credit-based plans only (Free, Personal, Pro). Enterprise: contact your Account Manager. Legacy plans must switch first. Enabled by default unless you disabled AI Features or set your own provider keys.
- **Cost:** tokens → USD (provider-published rates) → credits. **$1 USD = 180 credits.**
- **Rate limits** (per minute, per team, across all projects): Free 90, Personal 450, Pro 1,800, Enterprise 9,000 credits.
- **Context window:** input limited to 200k tokens.
- **Prompt caching:** Anthropic — only the default 5-min ephemeral cache; OpenAI — per-account `prompt_cache_key` set for you; Gemini — explicit context caching unsupported.
- **No pass-through headers** (can't enable header-gated experimental features), **no batch inference**, **no OpenAI priority processing**.
- **OpenRouter ZDR only:** Netlify routes only to providers with a Zero Data Retention policy. A model listed in the OpenRouter directory but with no ZDR-guaranteeing host is not served. Browse ZDR-eligible models: https://openrouter.ai/models?zdr=true
- **Privacy:** The gateway does not store prompts or model outputs.

**Cost controls:** Set up rate-limiting rules on AI-calling Functions/Edge Functions to prevent visitor abuse and runaway cost: https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/ — and configure auto-recharge or credit packs: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/configure-auto-recharge/ · https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/buy-credit-packs/

Monitor usage: https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/monitor-usage-for-credit-based-plans

## References

- Overview: https://docs.netlify.com/build/ai-gateway/overview.md
- Quickstart: https://docs.netlify.com/build/ai-gateway/quickstart-for-ai-gateway.md
- Examples: https://docs.netlify.com/build/ai-gateway/examples.md — including the AI SEO Image Generator (Gemini image generation): https://github.com/netlify/examples/tree/main/examples/ai-seo-image-generator and a TanStack Start chat app: https://github.com/netlify-templates/tanstack-template

<!-- Gap: exact directly-served model names (Anthropic/OpenAI/Gemini/TypeSafe) are not statically enumerable — rendered at build time from the live providers endpoint. -->

<!-- system: agent-context/ai-gateway/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (ai-gateway)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Use the provider SDK with the injected env credentials — don't hand-roll
   a raw `fetch()` against the gateway, even though raw REST is a supported
   surface. The body must not present raw REST or the
   `NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_URL` pair as a
   recommended path — but it MUST still document the pair as facts: always
   injected, never collide with user-set provider vars, and the right choice
   when a third-party or unsupported library needs explicit configuration.
   Demote the recommendation; keep the knowledge.
2. The gateway is not browser-callable: calls belong in functions or edge
   functions, never client-side code.
3. Model availability changes: don't hardcode model lists; check the live
   providers endpoint.
4. Gateway credentials are runtime-only: never call the gateway from build
   scripts, prerender/SSG, or build plugins — those calls get no credentials
   and fail. Do AI work at request time and cache the result (e.g. to
   Netlify Blobs) if it must look precomputed.
5. Gateway calls in a synchronous function are bound by the 60-second
   timeout: stream long generations (SDK streaming + `ReadableStream`), or
   use a background function that persists output for the client to fetch —
   never leave a slow generation unstreamed and assume it finishes.
6. When asked which env vars to use — even asked explicitly for the gateway
   pair — open with the default before answering the literal question:
   supported provider SDKs consume their injected provider-specific vars
   (`OPENAI_API_KEY`/`OPENAI_BASE_URL`, etc.) using exactly the per-provider
   instantiation the body shows — restate the body's setup, don't invent
   constructor details here. Then give `NETLIFY_AI_GATEWAY_KEY` /
   `NETLIFY_AI_GATEWAY_URL` as the explicit-config path for third-party
   or unsupported libraries. Answering with the gateway pair alone presents
   hand-wiring as the default, which it is not.
