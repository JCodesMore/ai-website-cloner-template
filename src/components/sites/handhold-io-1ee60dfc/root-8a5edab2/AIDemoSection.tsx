import Image from "next/image";

const IMAGE_BASE = "/sites/handhold-io-1ee60dfc/root-8a5edab2/images";

const ORBS = [
  {
    className:
      "max-2xs:hidden top-[5%] left-[8%] h-17.5 w-15.5 md:h-28.5 md:w-27.25",
  },
  {
    className:
      "max-sm:hidden top-[25%] left-[28%] h-11 w-9.75 md:h-17.5 md:w-15.5",
  },
  {
    className:
      "max-2xs:hidden top-[15%] right-[18%] h-12.5 w-10.5 md:h-19.75 md:w-16.5",
  },
  {
    className:
      "max-2xs:hidden bottom-[12%] left-[4%] h-30 w-29.5 md:bottom-[8%] md:h-48.5 md:w-49",
  },
  {
    className:
      "max-xs:hidden right-[2%] bottom-[12%] h-32.5 w-13 md:bottom-[8%] md:h-52.5 md:w-20.75",
  },
] as const;

export function AIDemoSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-elevated pt-10 md:pt-14">
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="font-sans text-sm font-medium tracking-wide text-content-secondary">
          AI Demo
        </span>
        <h2 className="mt-2 font-serif text-[40px] leading-[40px] font-extralight tracking-[-1.2px] text-black">
          See Handhold in action
        </h2>
        <p className="mt-2 font-sans text-base font-normal text-content-secondary">
          Let our agent walk you through our product
        </p>
        <button
          type="button"
          className="mt-6 rounded-full bg-black px-5 py-2.5 font-sans text-sm text-white"
        >
          Start demo
        </button>
      </div>

      {ORBS.map((orb, index) => (
        <div
          key={index}
          className={`pointer-events-none absolute overflow-hidden rounded-full ${orb.className}`}
        >
          <Image
            src={`${IMAGE_BASE}/demo-orb.webp`}
            alt=""
            width={3024}
            height={1588}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      <div className="pointer-events-none relative top-10 left-1/2 w-230 -translate-x-1/2 md:top-[30px] md:w-245">
        <Image
          src={`${IMAGE_BASE}/demo-bot.webp`}
          alt="Handhold AI demo product mockup"
          width={1960}
          height={1017}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
