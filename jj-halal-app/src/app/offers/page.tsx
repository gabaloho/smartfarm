import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    title: "Fresh Harvest Week",
    subtitle: "Up to 20% off all vegetables and fruits",
    badge: "Limited Time",
    badgeTone: "bg-amber-100 text-amber-800",
    code: "HARVEST20",
    href: "/categories/vegetables",
  },
  {
    id: 2,
    title: "Free Delivery Friday",
    subtitle: "No delivery fee on orders above ₦30,000 every Friday",
    badge: "Every Friday",
    badgeTone: "bg-green-100 text-green-800",
    code: "FREEFRI",
    href: "/products",
  },
  {
    id: 3,
    title: "Halal Meat Bundle",
    subtitle: "Family-size packs with 15% off and same-day delivery",
    badge: "Popular",
    badgeTone: "bg-blue-100 text-blue-800",
    code: "MEATFAM15",
    href: "/categories/meat",
  },
  {
    id: 4,
    title: "Dairy & Eggs Deal",
    subtitle: "Buy 2 crates of eggs, get 1 free — this week only",
    badge: "This Week",
    badgeTone: "bg-rose-100 text-rose-800",
    code: "EGG2GET1",
    href: "/categories/dairy-eggs",
  },
  {
    id: 5,
    title: "New Customer Discount",
    subtitle: "10% off your first order — no minimum spend",
    badge: "New Users",
    badgeTone: "bg-purple-100 text-purple-800",
    code: "WELCOME10",
    href: "/products",
  },
  {
    id: 6,
    title: "Bulk Rice & Pulse",
    subtitle: "Save ₦500 on every 10 kg bag of rice or beans",
    badge: "Bulk Deal",
    badgeTone: "bg-stone-100 text-stone-700",
    code: "BULKGRAIN",
    href: "/categories/rice-pulse",
  },
];

export const metadata = {
  title: "Offers & Coupons | JJ HALAL FARMS LTD.",
  description:
    "Browse the latest deals, discount codes, and seasonal promotions from JJ HALAL FARMS LTD.",
};

export default function OffersPage() {
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
            <h1 className="text-xl font-bold text-gray-900">
              Offers &amp; Coupons
            </h1>
            <p className="text-sm text-gray-500">
              Fresh savings on every halal essential.
            </p>
          </div>
        </div>

        {/* Offer cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {OFFERS.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-gray-900 leading-tight">
                  {offer.title}
                </h2>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${offer.badgeTone}`}
                >
                  {offer.badge}
                </span>
              </div>
              <p className="text-sm text-gray-600">{offer.subtitle}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-green-300 bg-green-50 px-3 py-1.5">
                  <Tag size={13} className="text-green-600" />
                  <span className="font-mono text-sm font-bold text-green-800 tracking-wide">
                    {offer.code}
                  </span>
                </div>
                <Link
                  href={offer.href}
                  className="ml-auto text-sm font-semibold text-green-700 hover:text-green-800 hover:underline"
                >
                  Shop now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Offers are subject to availability. Codes applied at checkout.
        </p>
      </div>
    </div>
  );
}
