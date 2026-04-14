import Image from "next/image";
import type { TopicCategory } from "@/types/help-center";

const topics: TopicCategory[] = [
  {
    title: "Sign Up & Get Started",
    titleHref: "/us/Category/Detail/Sign_Up_Get_Started",
    iconSrc: "/icons/getstarted.svg",
    iconAlt: "",
    items: [
      { text: "Install HBO Max on supported devices", href: "/us/Answer/Detail/000002506" },
      { text: "HBO Max plans", href: "/us/Answer/Detail/000002547" },
      { text: "Subscribe to HBO Max", href: "/us/Answer/Detail/000002544" },
    ],
    viewAllHref: "/us/Category/Detail/Sign_Up_Get_Started",
  },
  {
    title: "Watch HBO Max",
    titleHref: "/us/Category/Detail/Watch_Max",
    iconSrc: "/icons/watchmax.svg",
    iconAlt: "",
    items: [
      { text: "Troubleshoot HBO Max", href: "/us/Answer/Detail/000002521" },
      { text: "HBO Max downloads", href: "/us/Answer/Detail/000002523" },
      { text: "HBO Max on too many devices", href: "/us/Answer/Detail/000002519" },
    ],
    viewAllHref: "/us/Category/Detail/Watch_Max",
  },
  {
    title: "Account & Sign In",
    titleHref: "/us/Category/Detail/Account_Sign_In",
    iconSrc: "/icons/accountsignin.svg",
    iconAlt: "",
    items: [
      { text: "Sign in to HBO Max", href: "/us/Answer/Detail/000002551" },
      { text: "Provider not listed", href: "/us/Answer/Detail/000002542" },
      { text: "Connect HBO Max provider", href: "/us/Answer/Detail/000002540" },
    ],
    viewAllHref: "/us/Category/Detail/Account_Sign_In",
  },
  {
    title: "Billing & Subscription",
    titleHref: "/us/Category/Detail/Billing_Subscription",
    iconSrc: "/icons/billingsubscription.svg",
    iconAlt: "",
    items: [
      { text: "Manage HBO Max subscription", href: "/us/Answer/Detail/000002529" },
      { text: "Cancel HBO Max subscription", href: "/us/Answer/Detail/000002537" },
      { text: "Change payment method", href: "/us/Answer/Detail/000002533" },
    ],
    viewAllHref: "/us/Category/Detail/Billing_Subscription",
  },
];

function TopicCard({ t }: { t: TopicCategory }) {
  return (
    <section className="flex flex-col min-w-0 flex-1 basis-0">
      <div
        className="flex h-full flex-col text-center bg-white rounded-[8px] hbo-card-shadow"
        style={{ padding: "30px 30px 23px 32px" }}
      >
        <a href={t.titleHref} className="no-underline flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-full bg-black mb-[18px]"
            style={{ width: 70, height: 70 }}
          >
            <Image src={t.iconSrc} alt={t.iconAlt} width={36} height={36} />
          </div>
          <h2 className="m-0 font-medium text-[18px] leading-[22px] text-[#0f0f0f]">
            {t.title}
          </h2>
        </a>

        <div className="flex flex-col gap-[12px] mt-[22px] mb-[20px] text-[16px] leading-[20px]">
          {t.items.map((item) => (
            <a
              key={item.href + item.text}
              href={item.href}
              className="text-[#545454] no-underline hover:text-[#116fbb] hover:underline"
            >
              {item.text}
            </a>
          ))}
        </div>

        <a
          href={t.viewAllHref}
          className="mt-auto pt-1 text-[16px] font-medium text-[#116fbb] no-underline hover:underline"
        >
          View all
        </a>
      </div>
    </section>
  );
}

export function TopicsSection() {
  return (
    <div className="w-full">
      <h2 className="hbo-gutter m-0 text-[24px] font-medium text-[#0f0f0f]">
        Topics
      </h2>
      <section className="hbo-gutter hbo-categories flex flex-row flex-wrap items-stretch justify-center gap-[25px] pt-[30px] pb-[18px]">
        <div className="hbo-cat-group flex flex-row items-stretch gap-[25px] flex-1 basis-0 min-w-[260px]">
          <TopicCard t={topics[0]} />
          <TopicCard t={topics[1]} />
        </div>
        <div className="hbo-cat-group flex flex-row items-stretch gap-[25px] flex-1 basis-0 min-w-[260px]">
          <TopicCard t={topics[2]} />
          <TopicCard t={topics[3]} />
        </div>
      </section>
    </div>
  );
}
