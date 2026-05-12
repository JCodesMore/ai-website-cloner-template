import Image from "next/image";

import { SERVICES } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ServicesGrid() {
  return (
    <section className="relative z-10 -mt-12 lg:-mt-24 overflow-visible">
      <div className="yo-container">
        <div className="grid lg:grid-cols-12 gap-0 items-center bg-white rounded-md">
          <div className="lg:col-span-4 pb-10 lg:pb-0 px-5">
            <span className="yo-subtitle">Our Services</span>
            <h2 className="yo-headline-split text-[48px] leading-none mt-5">
              Explore our <span className="light">best services</span>
            </h2>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2">
            {SERVICES.map((service) => (
              <a
                key={service.title}
                href={service.href}
                className={cn(
                  "group block p-12 rounded-md transition-colors duration-300",
                  service.active ? "bg-primary/5" : "hover:bg-primary/5",
                )}
              >
                <div className="relative w-fit mb-4">
                  <Image
                    src={service.icon}
                    alt=""
                    width={60}
                    height={60}
                    className="relative z-10"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-4 -bottom-2 w-10 h-10 rounded-full bg-primary/15 z-0"
                  />
                </div>
                <h3 className="text-[24px] font-extrabold leading-[1.2] mb-4 text-heading transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="text-body leading-[1.7]">
                  {service.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="hidden sm:block yo-deco-dot bg-primary bottom-32 left-8 yo-anim-x"
      />
      <span
        aria-hidden="true"
        className="hidden sm:block yo-deco-square top-32 left-16 w-3 h-3 border border-primary yo-anim-drift"
      />
    </section>
  );
}
