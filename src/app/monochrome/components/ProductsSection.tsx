import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProductColor = {
  label: string;
  hex: string;
};

type Product = {
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  colors: ProductColor[];
  detailHref: string;
  consultHref: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Roof-1",
    tagline: "エネルギーをつくる屋根",
    image: "/clones/monochrome/images/products/roof_1.jpg",
    imageAlt: "Roof-1 product",
    colors: [
      { label: "Black", hex: "#141419" },
      { label: "Silver", hex: "#a3a39c" },
      { label: "Roof-1e", hex: "#0d1f1a" },
    ],
    detailHref: "/monochrome/roof",
    consultHref: "/monochrome/contact",
  },
  {
    name: "Wall-1",
    tagline: "エネルギーをつくる壁",
    image: "/clones/monochrome/images/products/wall_1.jpg",
    imageAlt: "Wall-1 product",
    colors: [{ label: "Black", hex: "#141419" }],
    detailHref: "/monochrome/wall",
    consultHref: "/monochrome/contact",
  },
  {
    name: "Panel-B",
    tagline: "最もミニマルな太陽光パネル",
    image: "/clones/monochrome/images/products/panel_1.jpg",
    imageAlt: "Panel-B product",
    colors: [{ label: "Black", hex: "#141419" }],
    detailHref: "/monochrome/panel",
    consultHref: "/monochrome/contact",
  },
];

export function ProductsSection() {
  return (
    <section
      data-reveal
      id="products"
      className="overflow-clip base-px py-16 md:py-20 lg:py-30 scroll-mt-20"
    >
      <h2 className="text-[2rem] lg:text-[2.125rem] font-normal leading-[1.4] tracking-[0.01em] mb-10 lg:mb-14">
        エネルギーをつくる
      </h2>

      <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-12">
        {PRODUCTS.map((product) => (
          <article key={product.name} className="group flex flex-col">
            <header className="flex items-baseline justify-between mb-4">
              <h3 className="text-[1.5rem] lg:text-[1.75rem] font-normal">
                {product.name}
              </h3>
              <p className="text-sm text-[#141419]/60">{product.tagline}</p>
            </header>

            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f3]">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.02]"
              />
            </div>

            <footer className="flex items-center justify-between mt-4 gap-4">
              <ul className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <li
                    key={color.label}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "w-3 h-3 rounded-full inline-block shrink-0"
                      )}
                      style={{
                        background: color.hex,
                        border:
                          color.hex === "#a3a39c"
                            ? "1px solid #d9d9d4"
                            : "none",
                      }}
                    />
                    <span>{color.label}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={product.detailHref}
                  className="button-base button-outline"
                >
                  詳しく見る
                </Link>
                <Link
                  href={product.consultHref}
                  className="button-base button-fill"
                >
                  相談する
                </Link>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
