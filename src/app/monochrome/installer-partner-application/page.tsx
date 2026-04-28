import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ArrowRightIcon } from "../components/icons";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "施工パートナー募集について | Monochrome",
};

type NewsItem = {
  date: string;
  badge: string;
  title: string;
  href: string;
};

const NEWS: NewsItem[] = [
  {
    date: "2026.4.27",
    badge: "プレスリリース",
    title:
      "モノクローム、HEMS「Energy–1」がみらいエコ住宅2026事業（GX志向型住宅）に対応",
    href: "/monochrome/press/202604-aif",
  },
  {
    date: "2026.4.22",
    badge: "プレスリリース",
    title: "モノクローム、シリーズB資金調達を実施",
    href: "/monochrome/press/202604-funding-b",
  },
  {
    date: "2026.4.14",
    badge: "採用情報",
    title: "採用情報",
    href: "/monochrome/press/recruit",
  },
];

const sectionCls = "mt-16 base-px max-w-3xl mx-auto";
const h2Cls =
  "text-2xl font-normal mb-6 border-b border-neutral-200 pb-3";
const bodyCls = "text-base leading-[1.8] text-neutral-800";

function NewsReleases() {
  return (
    <section data-reveal className="bg-dark text-white py-16 md:py-20 base-px mt-24">
      <h3 className="mb-2 text-base font-normal">ニュースリリース</h3>
      <div data-reveal-stagger>
      {NEWS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group grid items-baseline gap-3 border-t border-white/10 py-4 md:gap-6",
            "grid-cols-[80px_1fr_24px] md:grid-cols-[100px_140px_1fr_24px]",
          )}
        >
          <span className="text-sm text-white/60">{item.date}</span>
          <span className="hidden w-fit items-center rounded-full border border-white/40 px-3 py-0.5 text-xs md:inline-flex">
            {item.badge}
          </span>
          <span className="text-sm leading-[1.6]">{item.title}</span>
          <span className="justify-self-end text-white/60 transition-colors group-hover:text-white">
            <ArrowRightIcon />
          </span>
        </Link>
      ))}
      </div>
      <div className="border-t border-white/10" aria-hidden />
    </section>
  );
}

export default function InstallerPartnerApplicationPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section data-reveal className="base-px py-20 md:py-28 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-normal">
            施工パートナー募集について
          </h1>
          <p className="text-base text-neutral-600 mt-6 leading-relaxed">
            モノクロームでは、建材一体型太陽光パネル「Roof–1」「Wall–1」「Panel–B」、関連する太陽光・蓄電池システムの施工・現場管理を担っていただくビジネスパートナーを募集しています。本ページでは募集区分・対応条件・登録基準についてご案内します。
          </p>
        </section>

        {/* 1. 募集区分について */}
        <section data-reveal className={sectionCls}>
          <h2 className={h2Cls}>募集区分について</h2>
          <p className={bodyCls}>
            施工・管理体制に応じて、以下の2つの区分で募集を行っています。
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <div className="border border-neutral-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                施工パートナー
              </h3>
              <p className={bodyCls}>
                モノクロームと連携し、施工体制を構築し、自社施工または認定施工店の手配・管理を行っていただくパートナー
              </p>
              <div className="mt-5 flex flex-col gap-4">
                <div className="border-l-2 border-neutral-300 pl-4">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    屋根・外装施工パートナー
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-700">
                    Roof–1・Wall–1の施工または現場管理。研修受講後、施工IDが発行されます。
                  </p>
                </div>
                <div className="border-l-2 border-neutral-300 pl-4">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    電気施工パートナー
                  </p>
                  <p className="text-sm leading-relaxed text-neutral-700">
                    太陽光・蓄電池システムの電気工事（モノクローム独自IDは不要）
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                販売代理店・導入検討をご希望の事業者様
              </h3>
              <p className={bodyCls}>
                製品の導入をご検討中の建設会社・工務店・設計事務所の方は、製品お問い合わせフォームよりお気軽にご相談ください。
              </p>
            </div>
          </div>
        </section>

        {/* 2. 対象条件（詳細） */}
        <section data-reveal className={sectionCls}>
          <h2 className={h2Cls}>対象条件（詳細）</h2>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                屋根・外装施工パートナー
              </h3>
              <ul className="list-disc pl-6 space-y-1.5 text-base leading-[1.8] text-neutral-800">
                <li>建設業許可保有または取得予定</li>
                <li>法人格保有</li>
                <li>屋根・外装工事の施工体制</li>
                <li>品質・安全管理体制</li>
                <li>研修受講と施工ID取得</li>
                <li>案件情報の共有・連携対応</li>
                <li>
                  デジタルツール（Slack、Google Sheets、電子署名等）の活用
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                電気施工パートナー
              </h3>
              <ul className="list-disc pl-6 space-y-1.5 text-base leading-[1.8] text-neutral-800">
                <li>太陽光・蓄電池の施工経験</li>
                <li>自社職人または管理体制</li>
                <li>情報共有・連携対応</li>
                <li>デジタルツールの活用</li>
                <li>※Huawei・Tesla経験者歓迎</li>
                <li>※モノクローム独自IDは不要</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-3">
                対象外となるケース
              </h3>
              <ul className="list-disc pl-6 space-y-1.5 text-base leading-[1.8] text-neutral-800">
                <li>販売・紹介のみのご希望</li>
                <li>自社施工体制をお持ちでない場合</li>
                <li>情報収集のみのご相談</li>
              </ul>
              <p className="mt-3 text-sm text-neutral-600">
                販売・紹介のご相談はお問い合わせフォームへお願いします。
              </p>
            </div>
          </div>
        </section>

        {/* 3. 研修および施工IDについて */}
        <section data-reveal className={sectionCls}>
          <h2 className={h2Cls}>研修および施工IDについて</h2>
          <p className={bodyCls}>
            屋根・外装施工パートナーは、研修受講と施工ID取得が必須です。研修内容は製品仕様、施工方法、安全プロトコル、品質基準を含みます。研修は有償です。費用や日程はお申し込み後にご案内します。電気工事はID不要です。
          </p>
        </section>

        {/* 4. お申し込み後の流れ */}
        <section data-reveal className={sectionCls}>
          <h2 className={h2Cls}>お申し込み後の流れ</h2>
          <p className={bodyCls}>
            お申し込みは、施工体制・対応エリア・案件状況に基づき審査いたします。詳細確認のため追加でご連絡する場合があります。対応エリアや条件によっては、登録に至らない場合がございます。お申し込みからご連絡まで、約1ヶ月のお時間を頂戴します。
          </p>
        </section>

        {/* 5. お申し込み */}
        <section data-reveal className={sectionCls}>
          <h2 className={h2Cls}>お申し込み</h2>
          <a
            href="https://www.monochrome.so/mc-certified-installer"
            target="_blank"
            rel="noreferrer"
            className="button-base button-fill"
          >
            施工パートナー申込フォーム
          </a>
        </section>

        <NewsReleases />
      </main>
      <SiteFooter />
    </>
  );
}
