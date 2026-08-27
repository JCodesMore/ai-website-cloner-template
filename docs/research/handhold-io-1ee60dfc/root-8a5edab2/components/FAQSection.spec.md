# FAQSection Specification

## Overview
- **Target file:** `src/components/sites/handhold-io-1ee60dfc/root-8a5edab2/FAQSection.tsx`
- **Interaction model:** click-driven accordion, single-open-at-a-time. Built with **Radix UI Accordion** on the live site (confirmed via `data-state`, `data-orientation`, `aria-controls`, `data-radix-collection-item` attributes). Use shadcn/ui's `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent` components directly (`@/components/ui/accordion` — install via shadcn if not already present in this project's `src/components/ui/`) — it already ships the correct `accordion-down`/`accordion-up` keyframe transition, so no custom animation extraction is needed.

## DOM Structure
```
<section class="w-full">
  <div class="mx-auto flex w-full max-w-378 flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
    <h2> "Frequently Asked Questions"
    <Accordion type="single" collapsible> — 6 AccordionItem
  </div>
</section>
```

## Computed Styles

### Heading (`<h2>`)
- font-family: Fraunces (serif), font-size: 20px, font-weight: 200 (extralight), line-height: 20px (100%), letter-spacing: -0.6px
- color: `text-content-primary`

### Accordion container
- `grid grid-cols-1 gap-4` — 4px... actually gap between items, single column, full width

### AccordionTrigger (question)
- font-family: Fraunces (serif), font-size: 28px, font-weight: 200 (extralight), line-height: 28px (100%), letter-spacing: -0.84px
- color: `text-content-interactive-primary-base` (black), hover: `text-content-interactive-primary-hover`, active: `text-content-interactive-primary-active`
- cursor: pointer, `transition-colors`, flex row `items-center justify-between gap-4`, includes a chevron/plus icon on the right that rotates on open (standard shadcn accordion chevron behavior — keep default)
- padding: generous vertical padding (~24px) per item, full-width clickable row

### AccordionContent (answer)
- font-family: Inter, font-size: 16px, font-weight: 400, line-height: 24px, color: `text-content-secondary`
- max-width ~800px, padding-top ~12px before text starts

## Assets
None beyond shadcn Accordion primitive (Radix-based, already available via `npx shadcn add accordion` if not present — check `src/components/ui/accordion.tsx` first).

## Text Content (verbatim, 6 items)
1. Q: "How long does it take to set up?" — A: "Handhold can generate the first version of your agents in minutes. You can then refine the agent's behaviour by reviewing the narrative and adding media assets. It's possible to go live within a couple of working days, though most customers go live in about a week"
2. Q: "How do my agents stay up to date?" — A: "Handhold regularly syncs with your knowledge base and website to ensure it always has the latest information. From our back-office portal, you can review questions the agent couldn't answer or didn't have content for, then fill those gaps by updating your knowledge base or creating custom knowledge sources for your agents."
3. Q: "How are the sessions personalised?" — A: "Handhold's AI agents usually start sessions with brief discovery, then tailor the agenda dynamically based on user interactions. By asking for the prospect's company website or business email, Handhold can review their website on the fly and adapt the conversation to the prospect's business context."
4. Q: "What languages does Handhold support?" — A: "Handhold sessions can be run in almost any language. To set up a custom language, contact Handhold Support."
5. Q: "What kind of analytics are available?" — A: "You'll see full transcripts of the interactions between the agent and the prospect. In addition, we provide aggregated statistics on session length and count, engagement metrics (such as drop-off rate), and conversion. All data can be exported in bulk for further analysis."
6. Q: "Is the agent able to show my actual product interface?" — A: "Yes. Handhold demo agents can stream your product interface during a demo session and perform actions using a second cursor. Our onboarding agents run inside your product interface and can guide users through complex workflows using a second cursor."

## Responsive Behavior
- **Desktop (1440px):** questions at 28px, comfortable padding
- **Mobile (390px):** questions may scale down slightly (~22-24px) to avoid wrapping awkwardly, otherwise same single-column accordion
- **Breakpoint:** none critical — accordion is single-column at all widths
