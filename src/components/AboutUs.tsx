import Image from "next/image";

import { CheckIcon, PlayIcon } from "@/components/icons";
import { ABOUT_FEATURES, ABOUT_VIDEO } from "@/lib/content";

export function AboutUs() {
  return (
    <section className="relative overflow-visible bg-[#f8f9fa] pt-32 pb-20 md:pt-40 lg:pt-48 lg:pb-32">
      <div className="yo-container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT — image collage */}
          <div className="relative">
            <div className="relative inline-block text-center lg:text-right">
              <Image
                src="/img/content/about-01.jpg"
                width={400}
                height={609}
                alt=""
                className="inline-block rounded-[10px]"
              />
              {/* about-shape1 — dark filled rectangle */}
              <span
                aria-hidden
                className="absolute -bottom-20 right-[50px] -z-10 hidden h-[140px] w-[190px] rounded-[10px] bg-secondary sm:block"
              />
              {/* about-shape2 — outlined rectangle */}
              <span
                aria-hidden
                className="absolute -bottom-12 right-[55px] -z-10 hidden h-[160px] w-[180px] rounded-[10px] border border-secondary/20 sm:block"
              />
            </div>

            {/* small overlapping photo */}
            <Image
              src="/img/content/about-02.jpg"
              width={300}
              height={262}
              alt=""
              className="absolute right-0 top-1/6 hidden rounded-[10px] sm:block"
            />

            {/* 28+ years experience badge */}
            <div className="absolute bottom-10 left-10 rounded-[10px] bg-white p-7 text-center shadow-[0_6px_25px_rgba(0,0,0,0.06)]">
              <h4 className="text-[80px] font-extrabold leading-none">28+</h4>
              <span className="text-base text-body">Years of experience</span>
            </div>
          </div>

          {/* RIGHT — headline + checklist + video CTA */}
          <div className="pl-0 xl:pl-12">
            <h2 className="yo-headline-split mb-6 text-[40px] leading-none md:text-[48px]">
              Discover a wider{" "}
              <span className="light">world of recreation facility</span>
            </h2>
            <p className="mb-3 text-lg font-medium text-primary">
              Broadband provider offers a higher-speed of data transmission.
            </p>
            <p className="mb-7 text-body">
              We&apos;ve streamlined our plans to give you the fastest internet
              available at your address for one low monthly price.
            </p>

            <ul className="mb-2">
              {ABOUT_FEATURES.map((feature) => (
                <li
                  key={feature.label}
                  className={
                    feature.active
                      ? "-mx-3 mb-4 flex items-center rounded-md bg-primary/5 px-3 py-2"
                      : "mb-4 flex items-center"
                  }
                >
                  <CheckIcon className="size-5 text-primary" />
                  <h4 className="ml-3 text-base font-extrabold">
                    {feature.label}
                  </h4>
                </li>
              ))}
            </ul>

            {/* video CTA */}
            <div className="mt-10 flex items-center gap-6">
              <a
                href={ABOUT_VIDEO.href}
                target="_blank"
                rel="noreferrer"
                className="relative flex h-[100px] w-[120px] items-center justify-center rounded-[10px] border-2 border-primary bg-cover bg-center"
                style={{ backgroundImage: `url(${ABOUT_VIDEO.poster})` }}
                aria-label={`Play video from ${ABOUT_VIDEO.name}`}
              >
                <PlayIcon className="size-7 text-primary" />
              </a>
              <div>
                <h4 className="text-lg font-extrabold">{ABOUT_VIDEO.name}</h4>
                <span className="text-sm text-body">{ABOUT_VIDEO.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* decorative red squiggle, top-right, animates vertically */}
      <Image
        src="/img/content/line-01.png"
        width={149}
        height={379}
        alt=""
        aria-hidden
        className="yo-anim-y absolute right-[5%] top-[-15%] hidden xl:block"
      />
    </section>
  );
}
