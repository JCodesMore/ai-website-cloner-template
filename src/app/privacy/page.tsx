import { PageHero } from "@/components/PageHero";

export const metadata = { title: "Privacy Policy — VertexLink" };

const SECTIONS = [
  {
    h: "Information we collect",
    p: "We collect the information you provide when you sign up — name, email, address, payment details — plus technical data needed to deliver your service: IP address, router identifier, and bandwidth usage.",
  },
  {
    h: "How we use your information",
    p: "We use it to provision and maintain your service, to bill you, to respond to support requests, and to send important service updates. We do not sell personal data to third parties.",
  },
  {
    h: "Cookies and tracking",
    p: "Our site uses essential cookies for sign-in and basket state, plus analytics cookies (which you can decline) to understand how the site is used and improve it.",
  },
  {
    h: "Data retention",
    p: "We retain account and billing data for as long as your account is active, plus seven years after closure for accounting purposes. Network usage logs are retained for 90 days.",
  },
  {
    h: "Your rights",
    p: "You can request a copy of your data, ask us to correct or delete it, or restrict its processing at any time. Email privacy@vertexlink.com and we will respond within 30 days.",
  },
  {
    h: "Contact us",
    p: "Questions about this policy? Reach our data protection officer at privacy@vertexlink.com or write to our registered office at 2108 N St, Ste N, Sacramento, CA 95816.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" />
      <section className="py-24 lg:py-32">
        <div className="yo-container max-w-3xl mx-auto">
          <p className="text-body mb-10 leading-[1.8]">
            This privacy policy explains how VertexLink Inc collects, uses, and protects information about
            people who use our services and visit our website. We take your privacy seriously and we
            keep this policy short, plain, and honest.
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
