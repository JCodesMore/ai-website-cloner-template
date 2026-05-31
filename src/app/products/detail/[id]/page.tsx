"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { fastProducts, companyProducts, personProducts, pledgeProducts } from "@/lib/data";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductDetailRedirect({ params: paramsPromise }: Props) {
  useEffect(() => {
    const doRedirect = async () => {
      const { id } = await paramsPromise;
      const pid = parseInt(id, 10);
      if (isNaN(pid)) notFound();

      for (const [category, products] of [
        ["fast", fastProducts] as const,
        ["company", companyProducts] as const,
        ["person", personProducts] as const,
        ["pledge", pledgeProducts] as const,
      ]) {
        if (products.some((p) => p.id === pid)) {
          window.location.replace(`/products/${category}/${id}`);
          return;
        }
      }

      notFound();
    };
    doRedirect();
  }, [paramsPromise]);

  return null;
}
