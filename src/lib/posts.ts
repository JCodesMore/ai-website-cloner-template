export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: Section[];
};

type Section =
  | { type: "body"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "callout"; variant: "tip" | "info" | "warning"; text: string }
  | { type: "code"; text: string }
  | { type: "list"; items: string[] };

export const POSTS: Post[] = [
  {
    slug: "how-we-automated-client-onboarding-in-3-days",
    title: "How We Automated a Full Client Onboarding Flow in 3 Days",
    description:
      "From intake form to welcome email to CRM entry — completely automated. Here's the exact system we built and the tools we used.",
    date: "Apr 7, 2025",
    readTime: "6 min read",
    category: "Case Study",
    content: [
      {
        type: "body",
        text: "When a consulting firm came to us, their onboarding process looked like this: a client fills out a Typeform, someone on the team manually copies the data into their CRM, writes a welcome email, creates a Notion project page, and sends a Slack message to the delivery team. Every new client cost about 45 minutes of admin work — before any real work began.",
      },
      {
        type: "body",
        text: "We rebuilt it in 3 days. Here's exactly what we built and how.",
      },
      {
        type: "h2",
        text: "The Problem With Manual Onboarding",
      },
      {
        type: "body",
        text: "Manual onboarding doesn't just waste time — it introduces errors. Data gets mistyped moving from form to CRM. Welcome emails go out late. Delivery teams get notified via Slack at random times instead of immediately. The experience feels inconsistent to the client and chaotic internally.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "If your onboarding involves copying data between more than two tools, it can almost certainly be automated. The rule of thumb: if a human is acting as a data pipe, replace them with a real one.",
      },
      {
        type: "h2",
        text: "The System We Built",
      },
      {
        type: "body",
        text: "The trigger is a Typeform submission. From there, a Make scenario handles everything:",
      },
      {
        type: "list",
        items: [
          "Parse the form data and normalize field names",
          "Create a new contact in Pipedrive with all form fields mapped",
          "Create a Notion project page from a template, pre-filled with client details",
          "Send a personalized welcome email via Gmail",
          "Post a structured Slack message to #new-clients with a link to the Notion page",
          "Add a row to a Google Sheet master tracker",
        ],
      },
      {
        type: "code",
        text: `# Make scenario flow
Typeform → Watch Responses
  ↓
Tools → Parse JSON (normalize fields)
  ↓
Pipedrive → Create Contact + Deal
  ↓
Notion → Create Page from Template
  ↓
Gmail → Send Welcome Email
  ↓
Slack → Post Message (#new-clients)
  ↓
Google Sheets → Add Row (master tracker)`,
      },
      {
        type: "h2",
        text: "The Results",
      },
      {
        type: "body",
        text: "After going live, the team's onboarding time dropped from 45 minutes to under 2 minutes — the time it takes to review the Slack notification. Zero data entry errors in the first month. New clients receive their welcome email within 90 seconds of submitting the form.",
      },
      {
        type: "callout",
        variant: "info",
        text: "This entire system runs on a Make Starter plan (under $20/month). The ROI was recovered in the first week.",
      },
      {
        type: "h2",
        text: "What Made This Fast to Build",
      },
      {
        type: "body",
        text: "Three things: Typeform's clean webhook payload (no scrubbing needed), Pipedrive's well-documented API, and Notion's template duplication endpoint. When your tools have good APIs, automation is fast. When they don't, you use Make's built-in modules and skip the API entirely.",
      },
      {
        type: "h2",
        text: "Want This For Your Business?",
      },
      {
        type: "body",
        text: "We can scope and build your onboarding automation in a single week. Book a scoping call and we'll map out the exact system before any work begins.",
      },
    ],
  },
  {
    slug: "5-automation-mistakes-that-slow-businesses-down",
    title: "The 5 Automation Mistakes That Slow Businesses Down",
    description:
      "Common patterns we see in manual and poorly-built workflows — and exactly how we fix them.",
    date: "Mar 24, 2025",
    readTime: "5 min read",
    category: "Guide",
    content: [
      {
        type: "body",
        text: "After building automation systems for dozens of businesses, we've seen the same mistakes come up again and again. Most of them aren't about the tools — they're about how workflows are designed before a single automation is built.",
      },
      {
        type: "h2",
        text: "Mistake #1: Automating a Broken Process",
      },
      {
        type: "body",
        text: "The most expensive mistake: taking a chaotic manual process and automating it exactly as-is. If your current workflow has five redundant steps and two approval gates that nobody actually uses, your automation will have the same. It'll just fail faster.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Before building any automation, map the process on paper. Remove every step that doesn't add value. Only then should you start connecting tools.",
      },
      {
        type: "h2",
        text: "Mistake #2: Single-Tool Thinking",
      },
      {
        type: "body",
        text: "\"We already have Zapier, can't we just add another Zap?\" Sometimes yes. But single-tool automations break when you need conditional logic, error handling, or more than 3 steps. Most real business workflows require a proper automation platform — Make, n8n — not a chain of simple Zaps.",
      },
      {
        type: "h2",
        text: "Mistake #3: No Error Handling",
      },
      {
        type: "body",
        text: "An automation without error handling is a time bomb. When an API is down, when a field is missing, when a webhook fires with unexpected data — your system should catch it, log it, and alert you. Not silently fail.",
      },
      {
        type: "code",
        text: `# Bad: no error handling
Typeform → Pipedrive → Gmail
(if Pipedrive is down, the lead is lost)

# Good: with error handling
Typeform → Pipedrive
  ↓ on error: log to Airtable + Slack alert
  ↓ on success: Gmail + Notion + Slack`,
      },
      {
        type: "h2",
        text: "Mistake #4: Automating Too Much Too Fast",
      },
      {
        type: "body",
        text: "We've seen businesses try to automate their entire operation in one project. The result is a complex, fragile system that nobody on the team understands. Better approach: start with the one workflow that costs the most time, get it running cleanly, then expand.",
      },
      {
        type: "h2",
        text: "Mistake #5: No Documentation",
      },
      {
        type: "body",
        text: "Six months after launch, your team won't remember why the automation sends two emails instead of one, or why it skips leads from a certain country. Every FLO system ships with a runbook — a plain-English document that describes what the system does, why, and what to do when something goes wrong.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "A good runbook takes 2 hours to write and saves dozens of hours of confusion over the life of the system.",
      },
    ],
  },
  {
    slug: "why-most-zapier-setups-break",
    title: "Why Most Zapier Setups Break (And What to Do Instead)",
    description:
      "Single-tool automations often hit walls. Here's how to build systems that last.",
    date: "Mar 11, 2025",
    readTime: "4 min read",
    category: "Deep Dive",
    content: [
      {
        type: "body",
        text: "Zapier is a great tool for simple automations. But most businesses outgrow it — not because Zapier is bad, but because they're using it in ways it wasn't designed for.",
      },
      {
        type: "h2",
        text: "Why Zapier Works Great at First",
      },
      {
        type: "body",
        text: "Zapier's strength is its breadth. 6,000+ app integrations, no-code interface, and a gentle learning curve. For a two-step automation — form submission creates a CRM contact — it's perfect. The problem starts when businesses try to stretch it further.",
      },
      {
        type: "h2",
        text: "Where It Starts to Break",
      },
      {
        type: "list",
        items: [
          "Multi-step workflows with conditional logic (Zapier's Paths feature is limited)",
          "High-volume workflows that hit task limits on lower plans",
          "Loops and iterators over arrays of data",
          "Error handling and retry logic",
          "Workflows that need to run for longer than 30 seconds",
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Zapier's free and Starter plans cap at 100–750 tasks/month. A single mid-size business can blow through that in a week.",
      },
      {
        type: "h2",
        text: "What to Use Instead (and When)",
      },
      {
        type: "body",
        text: "The answer depends on complexity and volume. Here's our general framework:",
      },
      {
        type: "code",
        text: `Simple, low-volume (< 500 tasks/month)
→ Zapier Starter is fine

Medium complexity, moderate volume
→ Make (better logic, lower cost per operation)

High complexity, large volume, or custom code needed
→ n8n (self-hosted, unlimited, full JS support)`,
      },
      {
        type: "h2",
        text: "The Real Fix: System Design",
      },
      {
        type: "body",
        text: "The tool choice matters less than the system design. A well-architected Make scenario will outlast a poorly-designed n8n workflow. Before picking a tool, map your process, define your error states, and know your volume. Then choose the tool that fits.",
      },
      {
        type: "callout",
        variant: "tip",
        text: "If you're on Zapier and hitting limits or complexity walls, a migration to Make typically cuts your automation cost by 60–80% and unlocks far more logic options.",
      },
    ],
  },
  {
    slug: "what-is-business-automation",
    title: "What Is Business Automation? A Plain-English Guide",
    description:
      "No jargon, no hype. What automation actually means for a service business, and what it can realistically do for you.",
    date: "Feb 28, 2025",
    readTime: "5 min read",
    category: "Beginner",
    content: [
      {
        type: "body",
        text: "\"Automation\" gets thrown around a lot. AI automation. Workflow automation. Marketing automation. Process automation. Most of it sounds the same and means something slightly different. Here's a plain-English breakdown of what business automation actually is and what it can do for a service business.",
      },
      {
        type: "h2",
        text: "The Simple Definition",
      },
      {
        type: "body",
        text: "Business automation is connecting your tools so that when something happens in one place, the right things happen everywhere else — without anyone having to do it manually.",
      },
      {
        type: "body",
        text: "A client fills out your intake form. Your CRM gets updated. Your team gets notified. A welcome email goes out. A project gets created. All of that, automatically, in seconds.",
      },
      {
        type: "h2",
        text: "What It's NOT",
      },
      {
        type: "list",
        items: [
          "It's not AI replacing your team (most automation is simple logic, not AI)",
          "It's not a software product you buy and install",
          "It's not one tool — it's the connections between your existing tools",
          "It's not set-and-forget forever (systems need maintenance as your business changes)",
        ],
      },
      {
        type: "h2",
        text: "The Three Layers of Automation",
      },
      {
        type: "body",
        text: "Every automation system has three parts: a trigger (something happens), logic (decisions get made), and actions (things happen in other tools).",
      },
      {
        type: "code",
        text: `Trigger  → A lead submits your intake form
Logic    → Is the budget > $5k? Is the timeline < 3 months?
Actions  → If yes: create deal, send proposal, notify team
           If no: add to nurture list, send resources email`,
      },
      {
        type: "callout",
        variant: "tip",
        text: "The logic layer is where most businesses underinvest. Simple triggers and actions are easy. Conditional routing, enrichment, and scoring — that's where automation starts saving serious time.",
      },
      {
        type: "h2",
        text: "Is Your Business Ready for Automation?",
      },
      {
        type: "body",
        text: "You're ready if: you have a repeatable process that happens at least weekly, you use more than two software tools, and at least one person on your team spends time moving data between those tools. That describes almost every service business with more than 3 people.",
      },
    ],
  },
  {
    slug: "make-vs-zapier-vs-n8n",
    title: "Make vs Zapier vs n8n: Which Automation Platform Is Right for You?",
    description:
      "A practical comparison of the three most popular automation platforms — with clear recommendations based on your business size and needs.",
    date: "Feb 14, 2025",
    readTime: "7 min read",
    category: "Comparison",
    content: [
      {
        type: "body",
        text: "Make, Zapier, and n8n are the three platforms we use most at FLO. Each has a clear sweet spot. Here's how to decide which one is right for your business.",
      },
      {
        type: "h2",
        text: "Zapier",
      },
      {
        type: "body",
        text: "Zapier is the most accessible of the three. Its app library (6,000+) is unmatched, the UI requires no learning curve, and it works out of the box for straightforward automations.",
      },
      {
        type: "list",
        items: [
          "Best for: simple 2–3 step automations, teams new to automation",
          "Pricing: $20–$100/month on paid plans, task-based billing",
          "Limits: complex logic, loops, high volume, and longer runs are painful",
          "When to avoid: anything with conditional branching deeper than 2 levels",
        ],
      },
      {
        type: "h2",
        text: "Make",
      },
      {
        type: "body",
        text: "Make (formerly Integromat) is our default recommendation for most businesses. It's visual like Zapier but dramatically more powerful. Scenarios can handle loops, iterators, error routes, filters, and complex data transformation — all without code.",
      },
      {
        type: "list",
        items: [
          "Best for: most service businesses, medium-to-high complexity workflows",
          "Pricing: operation-based (much cheaper than Zapier at scale)",
          "Strengths: visual debugging, error handling, complex logic, routers",
          "Learning curve: 1–2 days to get comfortable",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        text: "Switching from Zapier to Make typically reduces automation costs by 60–80% while unlocking significantly more functionality.",
      },
      {
        type: "h2",
        text: "n8n",
      },
      {
        type: "body",
        text: "n8n is the developer-friendly option. It's open source, can be self-hosted (free), and supports JavaScript directly inside workflow nodes. It's our choice when a client needs custom logic, large data volumes, or wants full control over their automation infrastructure.",
      },
      {
        type: "list",
        items: [
          "Best for: technical teams, high volume, custom code requirements",
          "Pricing: free (self-hosted) or $20+/month (cloud)",
          "Strengths: full JS support, no task limits (self-hosted), HTTP flexibility",
          "Learning curve: steeper — most effective with developer involvement",
        ],
      },
      {
        type: "h2",
        text: "Quick Decision Guide",
      },
      {
        type: "code",
        text: `Simple workflow, non-technical team, low volume
→ Zapier

Medium complexity, service business, growth stage
→ Make (our default recommendation)

High volume, custom logic, technical team, or budget-sensitive
→ n8n (self-hosted)`,
      },
      {
        type: "body",
        text: "At FLO, we match the platform to the workflow, not the other way around. Most of our builds use Make — but we'll always use the tool that best fits your needs.",
      },
    ],
  },
  {
    slug: "crm-automation-guide",
    title: "The Complete Guide to CRM Automation for Service Businesses",
    description:
      "How to stop manually updating your CRM and let your automation stack keep it current automatically.",
    date: "Jan 30, 2025",
    readTime: "6 min read",
    category: "Guide",
    content: [
      {
        type: "body",
        text: "A CRM is only as useful as the data inside it. And for most service businesses, that data is incomplete, outdated, or duplicated — because entering it manually is slow, boring, and easy to skip.",
      },
      {
        type: "body",
        text: "CRM automation fixes this at the source. Here's how.",
      },
      {
        type: "h2",
        text: "What Should Your CRM Track Automatically?",
      },
      {
        type: "list",
        items: [
          "New leads from every source (form, ad, referral, cold outreach)",
          "Deal stage changes triggered by real actions (proposal sent, call booked)",
          "Email opens and link clicks (via your email tool's API)",
          "Meeting notes summarized and attached to the contact",
          "Invoice status from your billing tool",
          "Project status from your delivery tool",
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "If your team is manually updating deal stages, you're one busy week away from a CRM full of stale data. Automation ties deal stage changes to real events.",
      },
      {
        type: "h2",
        text: "The CRM Automation Stack",
      },
      {
        type: "body",
        text: "For most service businesses, we build CRM automation using three layers:",
      },
      {
        type: "code",
        text: `Capture Layer
  Typeform / Webflow / Facebook Ads
  → create contact automatically

Enrichment Layer
  Clearbit / Apollo / manual LinkedIn data
  → enrich contact with company + role data

Update Layer
  Calendly booking → move deal to "Call Booked"
  Proposal tool → move deal to "Proposal Sent"
  Stripe payment → move deal to "Won" + create project`,
      },
      {
        type: "h2",
        text: "Which CRMs We Work With",
      },
      {
        type: "body",
        text: "We build CRM automation for Pipedrive, HubSpot, Close, and Airtable (used as a lightweight CRM). Each has different API strengths — Pipedrive and HubSpot have the best automation support; Airtable is the most flexible for custom data structures.",
      },
      {
        type: "h2",
        text: "The Result",
      },
      {
        type: "body",
        text: "When your CRM is fed by automation rather than manual entry, it becomes your single source of truth. You can trust the data, build reports from it, and make decisions based on it. That's when a CRM starts paying for itself.",
      },
    ],
  },
];
