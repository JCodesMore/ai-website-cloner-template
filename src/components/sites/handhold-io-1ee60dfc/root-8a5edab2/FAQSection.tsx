import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How long does it take to set up?",
    answer:
      "Handhold can generate the first version of your agents in minutes. You can then refine the agent's behaviour by reviewing the narrative and adding media assets. It's possible to go live within a couple of working days, though most customers go live in about a week",
  },
  {
    question: "How do my agents stay up to date?",
    answer:
      "Handhold regularly syncs with your knowledge base and website to ensure it always has the latest information. From our back-office portal, you can review questions the agent couldn't answer or didn't have content for, then fill those gaps by updating your knowledge base or creating custom knowledge sources for your agents.",
  },
  {
    question: "How are the sessions personalised?",
    answer:
      "Handhold's AI agents usually start sessions with brief discovery, then tailor the agenda dynamically based on user interactions. By asking for the prospect's company website or business email, Handhold can review their website on the fly and adapt the conversation to the prospect's business context.",
  },
  {
    question: "What languages does Handhold support?",
    answer:
      "Handhold sessions can be run in almost any language. To set up a custom language, contact Handhold Support.",
  },
  {
    question: "What kind of analytics are available?",
    answer:
      "You'll see full transcripts of the interactions between the agent and the prospect. In addition, we provide aggregated statistics on session length and count, engagement metrics (such as drop-off rate), and conversion. All data can be exported in bulk for further analysis.",
  },
  {
    question: "Is the agent able to show my actual product interface?",
    answer:
      "Yes. Handhold demo agents can stream your product interface during a demo session and perform actions using a second cursor. Our onboarding agents run inside your product interface and can guide users through complex workflows using a second cursor.",
  },
]

export function FAQSection() {
  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-378 flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        <h2 className="font-serif text-[20px] leading-[20px] font-extralight tracking-[-0.6px] text-content-primary">
          Frequently Asked Questions
        </h2>
        <Accordion className="grid grid-cols-1 gap-4">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="items-center gap-4 py-6 font-serif text-[22px] leading-[24px] font-extralight tracking-[-0.66px] text-content-primary transition-colors hover:text-[var(--surface-interactive-primary-hover)] hover:no-underline lg:text-[28px] lg:leading-[28px] lg:tracking-[-0.84px]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-[800px] pt-3 font-sans text-base leading-6 font-normal text-content-secondary">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
