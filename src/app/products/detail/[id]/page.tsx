import { redirect, notFound } from "next/navigation";
import { productDetails, fastProducts, companyProducts, personProducts, pledgeProducts } from "@/lib/data";

interface Props { params: Promise<{ id: string }> }

export default async function ProductDetailRedirect({ params }: Props) {
  const { id } = await params;
  const pid = Number(id);

  // Try full detail first (has category)
  const detail = productDetails.find(x => x.id === pid);
  if (detail) {
    redirect(`/products/${detail.category}/${id}`);
  }

  // Fallback: find which listing this product belongs to
  for (const [category, products] of Object.entries({ fast: fastProducts, company: companyProducts, person: personProducts, pledge: pledgeProducts })) {
    if (products.some(p => p.id === pid)) {
      redirect(`/products/${category}/${id}`);
    }
  }

  notFound();
}

