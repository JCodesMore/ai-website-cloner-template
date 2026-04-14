import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";

export function SiteHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[100] w-full bg-[#252525] text-white"
      style={{ height: 94 }}
    >
      <div className="mx-[122px] flex h-full items-center max-[1100px]:mx-6 max-[640px]:mx-4">
        <a
          href="/us/Home/Index"
          className="flex items-center gap-4 no-underline"
          aria-label="HBO Max Help Center home"
        >
          <Image
            src="/icons/hbo-max-logo-white.svg"
            alt=""
            width={67}
            height={43}
            priority
            className="select-none"
          />
          <span className="text-white text-[22px] font-medium leading-none">
            Help Center
          </span>
        </a>

        <div className="ml-auto flex items-center gap-6 text-white text-[16px] font-normal">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            aria-label="Select country"
          >
            <Image
              src="/icons/world.svg"
              alt="Countries"
              width={14}
              height={14}
            />
            <span>United States</span>
            <ChevronDownIcon className="ml-0.5 opacity-80" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
            aria-label="Select language"
          >
            <span>English</span>
            <ChevronDownIcon className="ml-0.5 opacity-80" />
          </button>
        </div>
      </div>
    </header>
  );
}
