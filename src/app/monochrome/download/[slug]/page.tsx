import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";

type ProductSlug = "roof" | "wall" | "panel" | "energy" | "power";

type DownloadProduct = {
  slug: ProductSlug;
  name: string;
  tagline: string;
};

const PRODUCTS: DownloadProduct[] = [
  {
    slug: "roof",
    name: "Roof–1",
    tagline: "エネルギーをつくる屋根",
  },
  {
    slug: "wall",
    name: "Wall–1",
    tagline: "エネルギーをつくる壁",
  },
  {
    slug: "panel",
    name: "Panel–B",
    tagline: "最もミニマルな太陽光パネル",
  },
  {
    slug: "energy",
    name: "Energy–1",
    tagline: "電力コストを下げ、災害時に家族を守るHEMS",
  },
  {
    slug: "power",
    name: "モノクローム電力",
    tagline: "環境に貢献し、電気代がお得になる電力プラン",
  },
];

type Doc = {
  id: string;
  title: string;
  description: string;
  pages: number;
  size: string;
};

const DOCS_BY_SLUG: Record<ProductSlug, Doc[]> = {
  roof: [
    {
      id: "catalog",
      title: "製品カタログ",
      description: "Roof–1の概要と特徴、採用事例の概要をまとめた総合カタログ。",
      pages: 28,
      size: "21.4 MB",
    },
    {
      id: "spec",
      title: "製品仕様書",
      description: "電気特性、機械寸法、適合規格などの技術仕様。",
      pages: 3,
      size: "2.0 MB",
    },
    {
      id: "warranty",
      title: "保証約款",
      description: "出力保証・製品保証・施工保証の条件と適用範囲。",
      pages: 8,
      size: "0.9 MB",
    },
    {
      id: "install",
      title: "施工マニュアル",
      description: "認定施工店向けの標準施工手順と注意事項。",
      pages: 36,
      size: "8.2 MB",
    },
    {
      id: "reform-price",
      title: "リフォーム概算見積もり表",
      description: "屋根面積別の概算費用感を把握いただくための資料。",
      pages: 6,
      size: "0.4 MB",
    },
    {
      id: "cases",
      title: "採用事例集",
      description: "戸建住宅・公共施設等での導入事例をまとめた事例集。",
      pages: 20,
      size: "6.4 MB",
    },
  ],
  wall: [
    {
      id: "catalog",
      title: "製品カタログ",
      description: "Wall–1の概要、外装意匠との適合例をまとめた総合カタログ。",
      pages: 8,
      size: "0.6 MB",
    },
    {
      id: "spec",
      title: "製品仕様書",
      description: "電気特性、機械寸法、防火・防水性能等の技術仕様。",
      pages: 12,
      size: "2.6 MB",
    },
    {
      id: "warranty",
      title: "保証約款",
      description: "出力保証・製品保証・施工保証の条件と適用範囲。",
      pages: 8,
      size: "0.9 MB",
    },
    {
      id: "install",
      title: "施工マニュアル",
      description: "認定施工店向けの外壁施工手順と納まり詳細。",
      pages: 32,
      size: "7.6 MB",
    },
    {
      id: "simulation",
      title: "想定発電量シミュレーション",
      description: "壁面方位別の年間発電量目安と試算条件。",
      pages: 10,
      size: "1.8 MB",
    },
    {
      id: "cases",
      title: "採用事例集",
      description: "中高層住宅・小規模ビル等での導入事例集。",
      pages: 18,
      size: "5.1 MB",
    },
  ],
  panel: [
    {
      id: "catalog",
      title: "製品カタログ",
      description: "Panel–Bの設計思想、ラインアップ、用途事例の総合カタログ。",
      pages: 10,
      size: "10.5 MB",
    },
    {
      id: "spec",
      title: "製品仕様書",
      description: "電気特性、寸法、重量、適合規格などの技術仕様。",
      pages: 10,
      size: "2.0 MB",
    },
    {
      id: "warranty",
      title: "保証約款",
      description: "出力保証・製品保証の条件と適用範囲。",
      pages: 6,
      size: "0.7 MB",
    },
    {
      id: "install",
      title: "施工マニュアル",
      description: "屋根上・地上設置時の標準施工手順。",
      pages: 28,
      size: "6.2 MB",
    },
    {
      id: "system",
      title: "システム構成例",
      description: "パワコン・蓄電池等を含む代表的なシステム構成図と機器選定例。",
      pages: 8,
      size: "1.4 MB",
    },
    {
      id: "cases",
      title: "採用事例集",
      description: "住宅・産業用途での導入事例集。",
      pages: 16,
      size: "4.6 MB",
    },
  ],
  energy: [
    {
      id: "catalog",
      title: "製品カタログ",
      description: "Energy–1の概要、機能、想定ユースケースをまとめたカタログ。",
      pages: 11,
      size: "8.7 MB",
    },
    {
      id: "spec",
      title: "製品仕様書",
      description: "ハードウェア仕様、対応プロトコル、適合規格。",
      pages: 10,
      size: "1.9 MB",
    },
    {
      id: "install",
      title: "設置マニュアル",
      description: "コンセント挿入から初期設定までの手順。",
      pages: 14,
      size: "2.2 MB",
    },
    {
      id: "aif",
      title: "通信仕様 (AIF認証)",
      description: "ECHONET Lite AIF認証取得済みの通信仕様詳細。",
      pages: 12,
      size: "1.6 MB",
    },
    {
      id: "app",
      title: "アプリ操作ガイド",
      description: "iOS / Android向けアプリの操作と画面遷移。",
      pages: 18,
      size: "3.2 MB",
    },
    {
      id: "simulation",
      title: "想定削減シミュレーション",
      description: "家族構成別の電気代削減目安と試算条件。",
      pages: 8,
      size: "1.2 MB",
    },
  ],
  power: [
    {
      id: "price",
      title: "料金表",
      description: "プラン別の基本料金と従量料金、補足条件。",
      pages: 6,
      size: "0.8 MB",
    },
    {
      id: "terms",
      title: "約款",
      description: "供給条件、契約解除、苦情処理等の重要事項。",
      pages: 24,
      size: "1.4 MB",
    },
    {
      id: "flow",
      title: "申込みの流れ",
      description: "切替手続きから供給開始までの流れと必要書類。",
      pages: 6,
      size: "0.7 MB",
    },
    {
      id: "ssp",
      title: "Solar Standard Package紹介",
      description: "Roof–1・Energy–1とのセット利用メリット紹介。",
      pages: 10,
      size: "2.4 MB",
    },
    {
      id: "compare",
      title: "比較資料",
      description: "他社プランとの料金・サービス比較ガイド。",
      pages: 8,
      size: "1.1 MB",
    },
    {
      id: "donation",
      title: "寄付プログラム概要",
      description: "電気料金の一部を環境団体へ寄付するプログラムの説明。",
      pages: 6,
      size: "0.9 MB",
    },
  ],
};

/**
 * Map of (slug → docId → public PDF path) for documents we successfully
 * downloaded from monochrome.so. Cards whose docId is missing here render
 * with `href="#"` and a "（準備中）" suffix to indicate the asset is not yet
 * available in this clone.
 */
const PDF_LINKS: Record<ProductSlug, Partial<Record<string, string>>> = {
  roof: {
    catalog: "/clones/monochrome/seo/pdfs/roof-product-info.pdf",
    spec: "/clones/monochrome/seo/pdfs/roof-spec.pdf",
    "reform-price": "/clones/monochrome/seo/pdfs/roof-reform-price.pdf",
  },
  wall: {
    catalog: "/clones/monochrome/seo/pdfs/wall-product-info.pdf",
  },
  panel: {
    catalog: "/clones/monochrome/seo/pdfs/panel-product-info.pdf",
  },
  energy: {
    catalog: "/clones/monochrome/seo/pdfs/energy-product-info.pdf",
  },
  power: {},
};

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  return {
    title: product
      ? `${product.name} 資料ダウンロード | Monochrome`
      : "Monochrome",
  };
}

function DocIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0 text-neutral-400 group-hover:text-black transition-colors"
    >
      <rect
        x="10"
        y="6"
        width="28"
        height="36"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M16 16H32M16 22H32M16 28H28"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default async function DownloadProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const docs = DOCS_BY_SLUG[product.slug];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section data-reveal className="base-px py-16 md:py-24 bg-beige">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            資料ダウンロード
          </p>
          <h1 className="text-3xl md:text-4xl font-normal mt-3">
            {product.name} 資料ダウンロード
          </h1>
          <p className="mt-3 text-base text-neutral-700">
            以下の資料をPDFでダウンロードいただけます。製品検討、社内共有、施主提案などにご活用ください。
          </p>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {PRODUCTS.map((p) => {
              const isActive = p.slug === product.slug;
              return (
                <Link
                  key={p.slug}
                  href={`/monochrome/download/${p.slug}`}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-neutral-500 hover:text-black",
                  )}
                >
                  {p.name}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Document grid */}
        <section data-reveal className="base-px py-16 md:py-20">
          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docs.map((doc) => {
              const href = PDF_LINKS[product.slug][doc.id];
              const isAvailable = Boolean(href);
              return (
                <a
                  key={doc.id}
                  download={isAvailable ? "" : undefined}
                  target={isAvailable ? "_blank" : undefined}
                  rel={isAvailable ? "noopener" : undefined}
                  href={href ?? "#"}
                  aria-disabled={!isAvailable}
                  className={cn(
                    "border p-6 group flex items-start gap-4 transition-colors",
                    isAvailable
                      ? "border-neutral-200 hover:border-black"
                      : "border-neutral-200 cursor-not-allowed",
                  )}
                >
                  <DocIcon />
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-base font-medium",
                        !isAvailable && "text-neutral-500",
                      )}
                    >
                      {doc.title}
                      {!isAvailable && (
                        <span className="text-xs text-neutral-400 ml-2 font-normal">
                          （準備中）
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 flex items-center gap-3">
                      <span>PDF</span>
                      <span aria-hidden>·</span>
                      <span>{doc.pages} pages</span>
                      <span aria-hidden>·</span>
                      <span>{doc.size}</span>
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Form gate */}
        <section data-reveal className="bg-beige base-px py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-normal">
            ダウンロードには簡単なご入力をお願いします
          </h3>
          <p className="mt-3 text-base text-neutral-700 max-w-2xl mx-auto">
            資料の使用用途を踏まえてご案内したいため、フォームよりご連絡ください。
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href={`/monochrome/contact/${product.slug}`}
              className="button-base button-fill"
            >
              お問い合わせフォームへ
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section data-reveal className="base-px py-16 text-center">
          <Link
            href={`/monochrome/contact/${product.slug}`}
            className="button-base button-outline"
          >
            {product.name} について相談する
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
