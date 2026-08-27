import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We're seeing a very positive impact. Sales reps are less occupied with bad fit leads, creating extra capacity for outbound & Handhold's agent has been super useful for coverage outside of regular business hours. The team is a pleasure to work with & ships improvements rapidly.",
    name: "Alasdair Reynolds",
    title: "Head of Growth at Parim",
    avatar: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/alasdair.png",
  },
  {
    quote:
      "Our demo agent helps leads quickly validate whether Parcel Tracker is the right fit for them, so when they appear in our CRM, our sales team has the context required to bring them over the line.",
    name: "Arthur Zargaryan",
    title: "CEO at Parcel Tracker",
    avatar: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/arthur.png",
  },
  {
    quote:
      "Handhold helps our website visitors discover the depth of Finbite's platform in their own language. It's an efficient tool for capturing leads and gathering user insights in every region we operate.",
    name: "Anette Tenison Lõhmus",
    title: "Marketing Manager at Finbite",
    avatar: "/sites/handhold-io-1ee60dfc/root-8a5edab2/images/anette.png",
  },
];

function TestimonialCard({ quote, name, title, avatar }: Testimonial) {
  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-surface-elevated p-8">
      <p className="text-[16px] leading-[24px] font-normal text-black">{quote}</p>
      <div className="flex flex-row items-center gap-3">
        <div className="size-12 shrink-0 overflow-hidden rounded-full border border-border-strong">
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="size-12 object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-black">{name}</span>
          <span className="text-[14px] font-normal text-content-secondary">{title}</span>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto flex w-full max-w-378 flex-col gap-8 px-4 lg:px-8">
      <h4 className="font-serif text-[20px] leading-[20px] font-extralight tracking-[-0.6px] text-content-secondary">
        What our customers say about us
      </h4>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
