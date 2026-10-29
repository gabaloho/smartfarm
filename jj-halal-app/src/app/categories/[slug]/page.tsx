import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CATALOG_CATEGORIES,
  filterCatalogProducts,
  formatNaira,
} from "@/lib/catalog";
import { AddToCartButton } from "@/components/catalog/add-to-cart-button";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATALOG_CATEGORIES.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const products = filterCatalogProducts({ category: slug, sort: "popular" });

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-white mb-4">
          <Image
            src="/assets/gue-smart-farms-banner.svg"
            alt="Category banner"
            width={1400}
            height={360}
            className="h-36 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/55 to-transparent" />
          <div className="absolute inset-y-0 left-0 p-5 flex items-center gap-3">
            <Image src="/assets/gue-smart-farms-logo.svg" alt="Gue Smart Farms Limited" width={90} height={32} className="h-8 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
            <span className="text-white text-sm font-semibold">{category.name} Collection</span>
          </div>
        </div>

        <div className="rounded-3xl border border-green-100 bg-white p-6 sm:p-8 mb-6">
          <p className="text-sm font-semibold text-green-700">Category</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span>{category.emoji}</span>
            {category.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{category.description}</p>
          <Link
            href={`/products?category=${category.slug}`}
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            View all in this category
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="mt-3 text-lg font-bold text-green-700">{formatNaira(product.price)}</p>
              <p className="text-xs text-gray-500">per {product.unit}</p>
              <div className="mt-4">
                <AddToCartButton product={product} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
