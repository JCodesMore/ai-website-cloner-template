import {
  EnvelopeIcon,
  MapPinIcon,
  PaperPlaneIcon,
  PhoneIcon,
} from "@/components/icons";
import { PageHero } from "@/components/PageHero";
import { FOOTER_CONTACT } from "@/lib/content";

export const metadata = {
  title: "Contact Us — VertexLink",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact Us" />

      <section className="py-24 lg:py-32">
        <div className="yo-container">
          <div className="grid lg:grid-cols-3 gap-6 mb-20">
            {[
              { Icon: PhoneIcon, label: "Phone Number", value: FOOTER_CONTACT.phone },
              { Icon: EnvelopeIcon, label: "Email Address", value: FOOTER_CONTACT.email },
              { Icon: MapPinIcon, label: "Office Address", value: FOOTER_CONTACT.location },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="bg-light rounded-[10px] p-8 flex items-start gap-5 hover:shadow-soft transition-shadow"
              >
                <div className="size-14 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h5 className="text-base font-extrabold mb-1">{label}</h5>
                  <p className="text-body">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="yo-subtitle">Get In Touch</span>
              <h2 className="yo-headline-split text-[36px] md:text-[44px] lg:text-[48px] leading-none mt-5 mb-6">
                Let&apos;s start a <span className="light">conversation</span>
              </h2>
              <p className="text-body mb-4">
                Tell us about your home, your business, or the team you&apos;re trying to connect — we&apos;ll
                reply within one working day with a tailored plan.
              </p>
              <p className="text-body">
                Or call us during office hours and we&apos;ll route you straight to a human, not a queue.
              </p>
            </div>

            <form action="#" method="post" className="grid sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="h-12 px-5 rounded-full border border-black/10 outline-none focus:border-primary"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="h-12 px-5 rounded-full border border-black/10 outline-none focus:border-primary"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="h-12 px-5 rounded-full border border-black/10 outline-none focus:border-primary"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="h-12 px-5 rounded-full border border-black/10 outline-none focus:border-primary"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows={6}
                className="sm:col-span-2 px-5 py-4 rounded-[20px] border border-black/10 outline-none focus:border-primary resize-y"
              />
              <button
                type="submit"
                className="yo-btn yo-btn-primary sm:col-span-2 mx-auto inline-flex items-center gap-2"
              >
                Send Message <PaperPlaneIcon className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
