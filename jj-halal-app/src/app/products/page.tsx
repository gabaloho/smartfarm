import Link from "next/link";
import Image from "next/image";
import {
  CATALOG_CATEGORIES,
  filterCatalogProducts,
  formatNaira,
} from "@/lib/catalog";
import { AddToCartButton } from "@/components/catalog/add-to-cart-button";

type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  halal?: string;
};

function toNumber(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const min = toNumber(params.min);
  const max = toNumber(params.max);
  const sort = params.sort === "price-asc" || params.sort === "price-desc" ? params.sort : "popular";
  const halalOnly = params.halal === "1";

  const products = filterCatalogProducts({
    query,
    category: category || undefined,
    minPrice: min,
    maxPrice: max,
    sort,
    halalOnly,
  });

  const activeCategory = CATALOG_CATEGORIES.find((item) => item.slug === category);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-6 grid lg:grid-cols-[1fr_280px] gap-4">
          <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-white">
            <Image
              src="/assets/JJ HALAL FARMS.jpeg"
              alt="JJ HALAL farms banner"
              width={1400}
              height={420}
              className="h-44 w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/65 via-gray-900/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 p-5 sm:p-6 flex flex-col justify-center">
              <p className="mt-3 text-sm sm:text-base text-white max-w-md">
                  Shop eggs, chicken, livestock, marketplace listings, and delivery services in one place.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm">
            <Image
              src="/assets/promo-popup.png"
              alt="Promo offer"
              width={640}
              height={640}
              className="h-44 w-full object-cover"
            />
          </div>
        </section>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            <p className="mt-1 text-sm text-gray-600">
              {activeCategory
                ? `Showing ${activeCategory.name.toLowerCase()} products`
                : "Browse the farm catalog, livestock sales, and marketplace-ready listings"}
            </p>
          </div>
          <Link
            href="/offers"
            className="hidden sm:inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            View Offers
          </Link>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-5">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <h2 className="font-semibold text-gray-900">Filters</h2>

            <form className="mt-4 space-y-3" action="/products" method="get">
              <div>
                <label htmlFor="q" className="block text-xs font-semibold text-gray-500 mb-1">
                  Search
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  placeholder="Egg crates, chicken parts, cows, rams..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-semibold text-gray-500 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={category}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                >
                  <option value="">All categories</option>
                  {CATALOG_CATEGORIES.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="min" className="block text-xs font-semibold text-gray-500 mb-1">
                    Min Price
                  </label>
                  <input
                    id="min"
                    name="min"
                    defaultValue={min ?? ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="max" className="block text-xs font-semibold text-gray-500 mb-1">
                    Max Price
                  </label>
                  <input
                    id="max"
                    name="max"
                    defaultValue={max ?? ""}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sort" className="block text-xs font-semibold text-gray-500 mb-1">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                >
                  <option value="popular">Most popular</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="halal" value="1" defaultChecked={halalOnly} />
                Halal products only
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-green-700 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Apply
                </button>
                <Link
                  href="/products"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Reset
                </Link>
              </div>
            </form>
          </aside>

          <section>
            <p className="text-sm text-gray-600 mb-3">{products.length} products found</p>

            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900">No products match your filters</h3>
                <p className="text-sm text-gray-600 mt-2">Try adjusting category, price range, or search query.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {product.isFeatured && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">{product.category.replace("-", " ")}</p>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    <p className="mt-4 text-xl font-bold text-green-700">{formatNaira(product.price)}</p>
                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                      <span>per {product.unit}</span>
                      {product.oldPrice && (
                        <span className="line-through text-gray-400">{formatNaira(product.oldPrice)}</span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800">
                        Halal
                      </span>
                      <AddToCartButton product={product} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
