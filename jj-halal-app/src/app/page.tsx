import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  { name: "Vegetables", emoji: "🥬", href: "/categories/vegetables", tone: "from-lime-50 to-green-100" },
  { name: "Meat", emoji: "🥩", href: "/categories/meat", tone: "from-orange-50 to-amber-100" },
  { name: "Fish", emoji: "🐟", href: "/categories/fish", tone: "from-sky-50 to-cyan-100" },
  { name: "Fruits", emoji: "🍎", href: "/categories/fruits", tone: "from-rose-50 to-orange-100" },
  { name: "Dairy & Eggs", emoji: "🥚", href: "/categories/dairy-eggs", tone: "from-yellow-50 to-amber-100" },
  { name: "Rice & Pulse", emoji: "🌾", href: "/categories/rice-pulse", tone: "from-stone-50 to-emerald-100" },
];

const PROMOS = [
  {
    title: "Fresh Harvest Week",
    subtitle: "Up to 20% off vegetables and fruits",
    href: "/offers",
    badge: "Limited",
  },
  {
    title: "Halal Meat Combo",
    subtitle: "Family-size packs with same-day delivery",
    href: "/flash-sales",
    badge: "Popular",
  },
  {
    title: "Free Delivery Friday",
    subtitle: "No delivery fee on orders above ₦30,000",
    href: "/offers",
    badge: "Every Friday",
  },
];

const FEATURED = [
  { name: "Fresh Tomatoes", price: "₦2,800", unit: "per basket" },
  { name: "Premium Goat Meat", price: "₦7,500", unit: "per kg" },
  { name: "Whole Catfish", price: "₦5,200", unit: "per piece" },
  { name: "Farm Eggs", price: "₦3,600", unit: "crate of 30" },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_top,#e6f7e9_0%,#f8faf8_45%,#ffffff_100%)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10">
        <div className="rounded-3xl border border-green-100 bg-white/90 p-6 sm:p-10 shadow-[0_25px_80px_-32px_rgba(22,101,52,0.35)]">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                JJ HALAL FARMS LTD.
              </p>
              <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                Fresh halal groceries from farm to your doorstep.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
                Shop vegetables, fish, meat, dairy, and daily essentials with trusted quality,
                clean sourcing, and reliable delivery across Kaduna.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-green-800 transition-colors"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/offers"
                  className="inline-flex items-center justify-center rounded-xl border border-green-700 px-6 py-3 text-sm font-semibold text-green-800 hover:bg-green-50 transition-colors"
                >
                  See Offers
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-6 sm:p-8 text-white">
                <div className="mb-4 overflow-hidden rounded-2xl border border-white/20">
                  <Image
                    src="/assets/daily-needs-hero.jpg"
                    alt="Fresh halal groceries"
                    width={900}
                    height={520}
                    className="h-36 w-full object-cover"
                    priority
                  />
                </div>
                <p className="text-sm opacity-90">Today&apos;s quick stats</p>
                <dl className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">Active Products</dt>
                    <dd className="mt-1 text-2xl font-bold">320+</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">Delivery Zones</dt>
                    <dd className="mt-1 text-2xl font-bold">15</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">Vendors</dt>
                    <dd className="mt-1 text-2xl font-bold">45+</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">Happy Families</dt>
                    <dd className="mt-1 text-2xl font-bold">2,100+</dd>
                  </div>
                </dl>
              </div>
              <div className="absolute -z-10 -bottom-4 -right-4 h-32 w-32 rounded-full bg-amber-300/50 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            <p className="text-sm text-gray-600 mt-1">Pick your essentials in one click.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-green-700 hover:text-green-800">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group rounded-2xl border border-white bg-gradient-to-br ${category.tone} p-4 min-h-28 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="text-2xl">{category.emoji}</div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{category.name}</p>
              <p className="text-xs text-gray-600 mt-1 group-hover:text-green-700">Explore now</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Deals & Promotions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PROMOS.map((promo) => (
            <div key={promo.title} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                {promo.badge}
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{promo.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{promo.subtitle}</p>
              <Link href={promo.href} className="mt-4 inline-block text-sm font-semibold text-green-700 hover:text-green-800">
                Grab Offer
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-3xl bg-gray-900 p-6 sm:p-8 text-white">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">Popular This Week</h2>
              <p className="text-sm text-gray-300 mt-1">Top picks from our customers.</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              Browse catalog
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURED.map((item) => (
              <article key={item.name} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-1 text-emerald-300 text-lg font-bold">{item.price}</p>
                <p className="text-xs text-gray-300">{item.unit}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
