import Link from "next/link";
import {
  CATALOG_CATEGORIES,
  filterCatalogProducts,
  formatNaira,
} from "@/lib/catalog";
import { AddToCartButton } from "@/components/catalog/add-to-cart-button";

export const metadata = {
  title: "Search | GONAA FARMS LTD.",
  description: "Search farm products and livestock quickly.",
};

type SearchParams = {
  q?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const products = filterCatalogProducts({
    query,
    sort: "popular",
  });

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Search</h1>
          <p className="mt-1 text-sm text-gray-600">
            Find eggs, chicken, livestock, and marketplace items quickly.
          </p>

          <form
            action="/search"
            method="get"
            className="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products or livestock"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
            />
            <button
              type="submit"
              className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATALOG_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
              >
                {category.emoji} {category.name}
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-5">
          {query ? (
            <p className="mb-3 text-sm text-gray-600">
              {products.length} result{products.length === 1 ? "" : "s"} for
              &quot;{query}&quot;
            </p>
          ) : (
            <p className="mb-3 text-sm text-gray-600">
              Showing popular items. Enter a keyword to narrow your results.
            </p>
          )}

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No matching items found
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Try a different keyword or browse the full products page.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    {product.isFeatured && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                    {product.category.replace("-", " ")}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-4 text-xl font-bold text-green-700">
                    {formatNaira(product.price)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    per {product.unit}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/products?q=${encodeURIComponent(product.name)}`}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      View details
                    </Link>
                    <AddToCartButton product={product} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
