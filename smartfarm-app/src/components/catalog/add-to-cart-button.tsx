"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { CatalogProduct } from "@/lib/catalog";

interface AddToCartButtonProps {
  product: CatalogProduct;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.oldPrice ?? null,
      thumbnail: null,
      unit: product.unit,
      vendorId: "jj-halal-main-vendor",
      vendorName: "Gue Smart Farms Limited",
      stock: 99,
      minOrder: 1,
      maxOrder: 20,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  }

  return (
    <button
      onClick={onAdd}
      className="rounded-lg border border-green-700 px-3 py-1.5 text-sm font-semibold text-green-700 hover:bg-green-50"
      aria-label={`Add ${product.name} to cart`}
      type="button"
    >
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
