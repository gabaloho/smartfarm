import Link from "next/link";
import Image from "next/image";

const SAMPLE_LISTINGS = [
  {
    title: "Broiler chickens",
    seller: "Aisha Farms",
    location: "Kaduna North",
    price: "₦7,800 / kg",
    finalPrice: "₦7,410",
    commission: "₦390",
  },
  {
    title: "Ram listing",
    seller: "Kano Livestock Market",
    location: "Tudun Wada",
    price: "₦300,000",
    finalPrice: "₦285,000",
    commission: "₦15,000",
  },
  {
    title: "Weaner cow",
    seller: "Farm Connect",
    location: "Zaria",
    price: "₦980,000",
    finalPrice: "₦931,000",
    commission: "₦49,000",
  },
];

export const metadata = {
  title: "Marketplace | JJ HALAL FARMS LTD.",
  description:
    "Buy and sell livestock with clear pricing and trusted seller details.",
};

export default function MarketplacePage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl border border-fuchsia-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-800">
                User-to-user sales
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Buy and sell livestock with confidence.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-2xl">
                Registered users can advertise and sell chickens, cows, rams, and other farm animals.
                For every successful sale, the seller receives 95% and JJ HALAL FARMS keeps a 5% service fee.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth/register?type=vendor" className="rounded-xl bg-fuchsia-700 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-800">
                  Become a seller
                </Link>
                <Link href="/contact" className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                  Contact support
                </Link>
              </div>
            </div>
            <div className="relative min-h-64">
              <Image
                src="/assets/JJ HALAL FARMS.jpeg"
                alt="Marketplace banner"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/35 to-transparent" />
            </div>
          </div>
        </div>

        <section className="mb-8">
          <aside className="max-w-md rounded-3xl border border-emerald-100 bg-emerald-50/80 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Service fee</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">5% marketplace fee</h2>
            <p className="mt-3 text-sm text-gray-600">
              When a sale is completed, the seller gets 95% of the price and 5% goes to JJ HALAL FARMS LTD.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between rounded-xl bg-white px-4 py-3">
                <span className="text-gray-600">Seller keeps</span>
                <span className="font-semibold text-gray-900">95%</span>
              </div>
              <div className="flex justify-between rounded-xl bg-white px-4 py-3">
                <span className="text-gray-600">Marketplace fee</span>
                <span className="font-semibold text-gray-900">5%</span>
              </div>
            </div>
          </aside>
        </section>

        <section>
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sample marketplace listings</h2>
              <p className="mt-1 text-sm text-gray-600">Examples of livestock listings and how payout is shared.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {SAMPLE_LISTINGS.map((item) => (
              <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-gray-500">{item.location}</p>
                <h3 className="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">Sold by {item.seller}</p>
                <p className="mt-4 text-xl font-bold text-fuchsia-700">{item.price}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Seller receives</span><span className="font-semibold">{item.finalPrice}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Commission</span><span className="font-semibold">{item.commission}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
