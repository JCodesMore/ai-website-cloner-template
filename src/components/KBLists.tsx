import type { HelpLink } from "@/types/help-center";
import { BulletDot } from "@/components/icons";

const featured: HelpLink[] = [
  { text: "HBO Max plans", href: "/us/Answer/Detail/000002547" },
  { text: "Troubleshoot HBO Max", href: "/us/Answer/Detail/000002521" },
];

const howDoI: HelpLink[] = [
  { text: "Sign in to HBO Max", href: "/us/Answer/Detail/000002551" },
  { text: "Manage HBO Max subscription", href: "/us/Answer/Detail/000002529" },
  { text: "Subscribe to HBO Max", href: "/us/Answer/Detail/000002544" },
];

function ListBox({ title, links }: { title: string; links: HelpLink[] }) {
  return (
    <div
      className="flex-1 basis-0 min-w-[280px] bg-white rounded-[8px]"
      style={{ padding: "25px 45px 31px" }}
    >
      <div className="text-[24px] font-medium leading-[28px] text-[#0f0f0f]">
        {title}
      </div>
      <ul className="mt-[18px] flex flex-col gap-[12px] list-none p-0 m-0">
        {links.map((l) => (
          <li key={l.href + l.text} className="flex items-center gap-[10px]">
            <BulletDot className="text-[#545454]" />
            <a
              href={l.href}
              className="text-[16px] leading-[20px] text-[#116fbb] no-underline hover:underline"
            >
              {l.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KBLists() {
  return (
    <div className="hbo-gutter hbo-kb flex flex-row flex-wrap justify-center gap-[25px] pt-[42px] pb-[40px]">
      <ListBox title="Featured articles" links={featured} />
      <ListBox title="How do I...?" links={howDoI} />
    </div>
  );
}
