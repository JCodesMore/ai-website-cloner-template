import { redirect, notFound } from "next/navigation";
import { getProductById } from "@/lib/repository";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailRedirect({ params }: Props) {
  const { id } = await params;
  const pid = parseInt(id, 10);
  if (isNaN(pid)) notFound();

  const product = await getProductById(id);
  if (!product) notFound();

  redirect(`/products/${product.category || "fast"}/${pid}`);
}
