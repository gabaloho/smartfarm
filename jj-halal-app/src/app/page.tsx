import Link from "next/link";
import Image from "next/image";

const SHOP_SECTIONS = [
  {
    title: "Egg Sales",
    subtitle:
      "Retail crates start at 5 crates. Household buyers can order 1 to 4 crates.",
    href: "/products?category=eggs",
    tone: "from-amber-50 to-yellow-100",
    badge: "Quantity based",
  },
  {
    title: "Chicken Sales",
    subtitle:
      "Whole chicken and chicken parts sold per kilogram with automatic pricing.",
    href: "/products?category=chicken",
    tone: "from-rose-50 to-orange-100",
    badge: "KG pricing",
  },
  {
    title: "Cow Sharing",
    subtitle:
      "Share a cow purchase with family or friends and see available spaces easily.",
    href: "/livestock",
    tone: "from-emerald-50 to-green-100",
    badge: "Slot booking",
  },
  {
    title: "Whole Livestock",
    subtitle:
      "Direct sale pages for cows and rams with breed, weight, age, health, and media.",
    href: "/livestock",
    tone: "from-sky-50 to-cyan-100",
    badge: "Profiles",
  },
  {
    title: "Marketplace",
    subtitle:
      "Buy from trusted sellers or post your own livestock for sale in minutes.",
    href: "/marketplace",
    tone: "from-fuchsia-50 to-rose-100",
    badge: "5% commission",
  },
  {
    title: "Auctions",
    subtitle: "Auction listings with timers and clear highest-bid visibility.",
    href: "/auctions",
    tone: "from-stone-50 to-orange-100",
    badge: "Timed bidding",
  },
];

const FEATURED_PRODUCTS = [
  {
    name: "Household Egg Crate",
    price: "₦3,900",
    unit: "1 to 4 crates",
  },
  {
    name: "Chicken Breast",
    price: "₦6,500",
    unit: "per kg",
  },
  {
    name: "Cow Share - Half Slot",
    price: "₦95,000",
    unit: "half slot",
  },
  {
    name: "Whole Ram",
    price: "₦265,000",
    unit: "per head",
  },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_top,#f5f3ea_0%,#fbfaf5_45%,#ffffff_100%)]">
      <section className="w-full">
        <Image
          src="/assets/GONAA FARMS.jpeg"
          alt="GONAA Farms"
          width={1920}
          height={720}
          sizes="100vw"
          className="w-full h-auto"
          priority
        />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-10">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 sm:p-10 shadow-[0_25px_80px_-32px_rgba(22,101,52,0.28)]">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-800 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase">
                Farmer&apos;s Market
              </p>
              <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                Fresh halal food and livestock, all in one easy place.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl">
                Shop eggs, chicken, cows, and rams with clear prices, simple
                checkout, and reliable delivery support across Kaduna.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
                >
                  Shop Farm Products
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center rounded-xl border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
                >
                  View Marketplace
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
                <span className="rounded-full bg-amber-100 px-3 py-1">
                  5% seller service fee
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1">
                  Chicken sold by kg
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-1">
                  Cow sharing options
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-green-700 to-lime-800 p-6 sm:p-8 text-white">
                <div className="mb-4 overflow-hidden rounded-2xl border border-white/20">
                  <Image
                    src="/assets/GONAA FARMS.jpeg"
                    alt="GONAA farms platform"
                    width={900}
                    height={520}
                    className="h-36 w-full object-cover"
                    style={{ objectPosition: "84% 78%" }}
                    priority
                  />
                </div>
                <p className="text-sm opacity-90">Quick facts</p>
                <dl className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">
                      Service location
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">Kaduna</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">
                      Marketplace fee
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">5%</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">
                      Chicken sales
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">KG</dd>
                  </div>
                  <div className="rounded-xl bg-white/15 p-4 backdrop-blur-sm">
                    <dt className="text-xs uppercase tracking-wider opacity-80">
                      Cow sharing
                    </dt>
                    <dd className="mt-1 text-2xl font-bold">Full / Half</dd>
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
            <h2 className="text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Pick what you want to buy and start shopping right away.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SHOP_SECTIONS.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className={`group rounded-2xl border border-white bg-gradient-to-br ${category.tone} p-4 min-h-28 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                {category.badge}
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">
                {category.title}
              </p>
              <p className="text-xs text-gray-600 mt-1 group-hover:text-emerald-700 line-clamp-3">
                {category.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Featured Prices
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURED_PRODUCTS.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.unit}</p>
              <p className="mt-3 text-xl font-bold text-emerald-700">
                {item.price}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
