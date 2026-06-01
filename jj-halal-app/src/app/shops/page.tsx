import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";

const SHOPS = [
  {
    id: 1,
    name: "JJ HALAL FARMS LTD. — Main Store",
    address: "14 Farm Road, Garki, Abuja, FCT",
    phone: "+234 801 234 5678",
    hours: "Mon – Sat: 8 am – 7 pm",
    image: "/assets/banner.jpeg",
  },
  {
    id: 2,
    name: "JJ HALAL FARMS LTD. — Wuse Branch",
    address: "22 Wuse Market Street, Wuse II, Abuja",
    phone: "+234 802 345 6789",
    hours: "Mon – Sat: 9 am – 6 pm",
    image: "/assets/banner.jpeg",
  },
  {
    id: 3,
    name: "JJ HALAL FARMS LTD. — Maitama Outlet",
    address: "5 Adetokunbo Ademola Crescent, Maitama, Abuja",
    phone: "+234 803 456 7890",
    hours: "Mon – Sun: 8 am – 8 pm",
    image: "/assets/banner.jpeg",
  },
];

export const metadata = {
  title: "Our Shops | JJ HALAL FARMS LTD.",
  description:
    "Find a JJ HALAL FARMS LTD. store near you. Fresh halal groceries available at all our locations.",
};

export default function ShopsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header card */}
        <div className="mb-8 rounded-2xl border border-green-100 bg-white p-5 flex items-center gap-4 shadow-sm">
          <Image
            src="/assets/jj-logo.png"
            alt="JJ HALAL FARMS LTD."
            width={126}
            height={42}
            className="h-10 w-auto object-contain"
            style={{ width: "auto" }}
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
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin size={13} className="mt-0.5 shrink-0 text-green-600" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={13} className="shrink-0 text-green-600" />
                  <a href={`tel:${shop.phone}`} className="hover:text-green-700">
                    {shop.phone}
                  </a>
                </div>
                <p className="text-xs text-gray-500">{shop.hours}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
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
