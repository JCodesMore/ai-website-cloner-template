import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Terms & Conditions — VertexLink" };

const SECTIONS = [
  {
    h: "1. Agreement",
    p: "By signing up for VertexLink services you agree to these terms. If you do not agree, you may cancel within 14 days for a full refund.",
  },
  {
    h: "2. Service availability",
    p: "We target 99.9% uptime, measured monthly. Scheduled maintenance is announced at least 48 hours in advance and is not counted against the SLA.",
  },
  {
    h: "3. Acceptable use",
    p: "You agree not to use our services to send spam, host malware, infringe copyright, or run services that damage other users on the network.",
  },
  {
    h: "4. Payment",
    p: "Plans are billed monthly in advance. Failed payments may result in suspension after a 7-day grace period; reconnection fees may apply.",
  },
  {
    h: "5. Cancellation",
    p: "You can cancel at the end of any billing month with 30 days' notice via email to support@vertexlink.com.",
  },
  {
    h: "6. Limitation of liability",
    p: "VertexLink's liability is limited to the value of one month of your subscription, except where mandated otherwise by law.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" />
      <section className="py-24 lg:py-32">
        <div className="yo-container max-w-3xl mx-auto">
          <p className="text-body mb-10 leading-[1.8]">
            These terms govern your use of VertexLink internet, TV, and home-security services. They are
            written to be readable — not legalese — but they do form a binding agreement between you
            and VertexLink Inc.
          </p>
          {SECTIONS.map((s) => (
            <div key={s.h} className="mb-8">
              <h2 className="text-2xl font-extrabold mb-3">{s.h}</h2>
              <p className="text-body leading-[1.8]">{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
