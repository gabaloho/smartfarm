import Link from "next/link";
import Image from "next/image";

const SHOPS = [
  {
    id: 1,
    name: "Gue Smart Farms Limited — Main Store",
    hours: "Mon – Sat: 8 am – 7 pm",
    image: "/assets/gue-smart-farms-banner.svg",
  },
  {
    id: 2,
    name: "Gue Smart Farms Limited — Wuse Branch",
    hours: "Mon – Sat: 9 am – 6 pm",
    image: "/assets/gue-smart-farms-banner.svg",
  },
  {
    id: 3,
    name: "Gue Smart Farms Limited — Maitama Outlet",
    hours: "Mon – Sun: 8 am – 8 pm",
    image: "/assets/gue-smart-farms-banner.svg",
  },
];

export const metadata = {
  title: "Our Shops | Gue Smart Farms Limited",
  description:
    "Find a Gue Smart Farms Limited store near you. Fresh halal groceries available at all our locations.",
};

export default function ShopsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header card */}
        <div className="mb-8 rounded-2xl border border-green-100 bg-white p-5 flex items-center gap-4 shadow-sm">
          <Image
            src="/assets/gue-smart-farms-logo.svg"
            alt="Gue Smart Farms Limited"
            width={126}
            height={42}
            className="h-10 w-auto object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Our Shops</h1>
            <p className="text-sm text-gray-500">
              Certified halal products at every location.
            </p>
          </div>
        </div>

        {/* Shop cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SHOPS.map((shop) => (
            <div
              key={shop.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="relative h-36 w-full">
                <Image
                  src={shop.image}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
              </div>
              <div className="p-4 space-y-2">
                <h2 className="font-semibold text-gray-900 text-sm leading-tight">
                  {shop.name}
                </h2>
                <p className="text-xs text-gray-500">{shop.hours}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-gray-600">
            For current store location details, please{" "}
            <Link href="/contact" className="font-semibold text-green-700 hover:text-green-800">
              contact us
            </Link>
            .
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700 transition-colors"
          >
            Shop Online
          </Link>
        </div>
      </div>
    </div>
  );
}
