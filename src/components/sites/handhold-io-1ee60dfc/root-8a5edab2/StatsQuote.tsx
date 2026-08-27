import Image from "next/image";

export function StatsQuote() {
  return (
    <div className="mx-auto flex max-w-[1512px] flex-col gap-12 px-4 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-8">
      <div className="flex gap-8">
        <div>
          <p className="font-serif text-[40px] leading-[40px] font-extralight tracking-[-1.2px] text-black">60%</p>
          <p className="mt-2 max-w-[160px] font-sans text-sm font-normal text-content-secondary">
            reduction in bad fit sales calls
          </p>
        </div>
        <div>
          <p className="font-serif text-[40px] leading-[40px] font-extralight tracking-[-1.2px] text-black">20%</p>
          <p className="mt-2 max-w-[160px] font-sans text-sm font-normal text-content-secondary">
            month-on-month increase in total SQLs
          </p>
        </div>
      </div>
      <div>
        <blockquote className="max-w-[480px] font-sans text-base leading-6 font-normal text-black">
          &ldquo;Our sales reps are less occupied with bad fit leads, creating extra capacity for outbound, and
          Handhold&apos;s agent has been super useful for coverage outside of regular business hours.&rdquo;
        </blockquote>
        <div className="mt-3 flex items-center gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-border-strong">
            <Image
              src="/sites/handhold-io-1ee60dfc/root-8a5edab2/images/alasdair.png"
              alt="Alasdair Reynolds"
              width={40}
              height={40}
              className="size-10 object-cover"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-sans text-sm font-medium text-black">Alasdair Reynolds</span>
            <span className="font-sans text-sm font-normal text-content-secondary">Head of Growth at Parim</span>
          </div>
        </div>
      </div>
    </div>
  );
}
