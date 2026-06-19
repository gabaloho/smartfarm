import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    title: "Egg Retail Launch",
    subtitle: "Enjoy separate home and bulk prices so you can order what fits your needs.",
    badge: "Limited Time",
    badgeTone: "bg-amber-100 text-amber-800",
    code: "EGGMODE",
    href: "/products?category=eggs",
  },
  {
    id: 2,
    title: "KG Chicken Pricing",
    subtitle: "Chicken breast, wings, thighs, drumstick, and head/feet are priced per kilogram.",
    badge: "Popular",
    badgeTone: "bg-green-100 text-green-800",
    code: "CHICKENKG",
    href: "/products?category=chicken",
  },
  {
    id: 3,
    title: "Cow Sharing Slots",
    subtitle: "Book a full or half slot for festive cow sharing with your family or group.",
    badge: "Popular",
    badgeTone: "bg-blue-100 text-blue-800",
    code: "COWSHARE",
    href: "/livestock",
  },
  {
    id: 4,
    title: "Marketplace Commission",
    subtitle: "For each successful marketplace sale, sellers receive 95% and 5% goes as service fee.",
    badge: "Top Pick",
    badgeTone: "bg-rose-100 text-rose-800",
    code: "5PERCENT",
    href: "/marketplace",
  },
  {
    id: 5,
    title: "Auction Sales",
    subtitle: "Join timed auctions and follow the current highest bid until closing.",
    badge: "Live",
    badgeTone: "bg-purple-100 text-purple-800",
    code: "BIDLIVE",
    href: "/auctions",
  },
  {
    id: 6,
    title: "Delivery Planning",
    subtitle: "Orders can be scheduled for delivery or pickup with clear fee calculation.",
    badge: "Every Friday",
    badgeTone: "bg-stone-100 text-stone-700",
    code: "DELIVER",
    href: "/checkout",
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
            src="/assets/JJ HALAL FARMS LOGO.jpeg"
            alt="JJ HALAL FARMS LTD."
            width={126}
            height={42}
            className="h-10 w-auto object-contain"
            style={{ width: "auto", height: "auto" }}
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Offers &amp; Coupons
            </h1>
            <p className="text-sm text-gray-500">
              Save more on eggs, chicken, livestock, marketplace listings, and delivery.
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
          Offers depend on stock and season. Use eligible codes during checkout.
        </p>
      </div>
    </div>
  );
}
