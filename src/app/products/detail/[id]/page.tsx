import { redirect, notFound } from "next/navigation";
import { fastProducts, companyProducts, personProducts, pledgeProducts } from "@/lib/data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailRedirect({ params }: Props) {
  const { id } = await params;
  const pid = parseInt(id, 10);
  if (isNaN(pid)) notFound();

  for (const [category, products] of [
    ["fast", fastProducts] as const,
    ["company", companyProducts] as const,
    ["person", personProducts] as const,
    ["pledge", pledgeProducts] as const,
  ]) {
    if (products.some((p) => p.id === pid)) {
      redirect(`/products/${category}/${pid}`);
    }
  }

  notFound();
}
