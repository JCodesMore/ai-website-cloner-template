import { SwirlIcon } from "./icons";

const WORDS = ["Ethics", "Humanism", "Transparency", "Performance"];

function MarqueeRow({
  bg,
  reverse = false,
  textColor = "#11121d",
}: {
  bg: string;
  reverse?: boolean;
  textColor?: string;
}) {
  /* Duplicate enough times so the strip is always wider than viewport */
  const items = Array.from({ length: 5 }, () => WORDS).flat();
  return (
    <div
      className="w-[160vw] -translate-x-[15vw] overflow-hidden py-5"
      style={{ background: bg }}
    >
      <div
        className="flex w-max items-center gap-10 whitespace-nowrap sm:gap-14"
        style={{
          animation: `${reverse ? "marquee-x-reverse" : "marquee-x"} 40s linear infinite`,
          color: textColor,
        }}
      >
        {items.map((w, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-10 font-display font-bold leading-none tracking-[-0.02em] sm:gap-14"
            style={{ fontSize: "clamp(64px, 10vw, 140px)" }}
          >
            {w}
            <SwirlIcon className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <section className="relative flex h-[420px] items-center justify-center overflow-hidden bg-[#11121d]">
      <div
        className="relative flex w-full flex-col gap-1"
        style={{ transform: "rotate(-5deg)" }}
      >
        <MarqueeRow bg="#f3c4c9" />
        <MarqueeRow bg="#d4acc5" reverse />
      </div>
    </section>
  );
}
