import Link from "next/link";
import Image from "next/image";

const DIRECT_SALES = [
  {
    name: "Registered Cow",
    breed: "Bunaji",
    weight: "410 kg",
    age: "3.5 years",
    health: "Vaccinated and vet checked",
    price: "₦980,000",
    media: "Images and video available",
  },
  {
    name: "Registered Ram",
    breed: "Yankasa",
    weight: "68 kg",
    age: "2 years",
    health: "Healthy, active, and tagged",
    price: "₦265,000",
    media: "Images and video available",
  },
];

const SHARING_OPTIONS = [
  {
    name: "Full Slot",
    summary: "For groups that want one full share of the cow purchase.",
    slots: 8,
    remaining: 2,
    price: "₦185,000",
  },
  {
    name: "Half Slot",
    summary: "Lower entry option for families sharing a festive animal.",
    slots: 16,
    remaining: 5,
    price: "₦95,000",
  },
];

const PROFILE_FIELDS = [
  "Breed",
  "Weight",
  "Age",
  "Health condition",
  "Price",
  "Images and videos",
  "Reservation or contact option",
];

export const metadata = {
  title: "Livestock Sales | Gue Smart Farms Limited",
  description:
    "Whole livestock sales and cow-sharing options for festive and group purchases.",
};

export default function LivestockPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
            <div className="p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Direct livestock sales
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Buy whole animals or join a shared cow purchase.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-2xl">
                Browse cows and rams, check key details, and reserve with confidence.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products?category=livestock" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                  Browse livestock catalog
                </Link>
                <Link href="/contact" className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                  Talk to our team
                </Link>
              </div>
            </div>
            <div className="relative min-h-64">
              <Image
                src="/assets/gue-smart-farms-banner.svg"
                alt="Livestock banner"
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
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Whole livestock sales</h2>
              <p className="mt-1 text-sm text-gray-600">Each listing includes key animal details to help you choose confidently.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {DIRECT_SALES.map((animal) => (
              <article key={animal.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{animal.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{animal.breed}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-700">{animal.price}</p>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Weight</p>
                    <p className="mt-1 font-semibold text-gray-900">{animal.weight}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Age</p>
                    <p className="mt-1 font-semibold text-gray-900">{animal.age}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Health condition</p>
                    <p className="mt-1 font-semibold text-gray-900">{animal.health}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3 sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Media</p>
                    <p className="mt-1 font-semibold text-gray-900">{animal.media}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/checkout" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                    Reserve or buy
                  </Link>
                  <Link href="/contact" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                    Talk to our team
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <div className="flex items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cow sharing plans</h2>
              <p className="mt-1 text-sm text-gray-600">Choose the plan that fits your family or group budget.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {SHARING_OPTIONS.map((slot) => (
              <article key={slot.name} className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{slot.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{slot.summary}</p>
                  </div>
                  <p className="text-lg font-bold text-amber-800">{slot.price}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Total slots</p>
                    <p className="mt-1 font-semibold text-gray-900">{slot.slots}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Remaining</p>
                    <p className="mt-1 font-semibold text-gray-900">{slot.remaining}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-amber-500"
                    style={{ width: `${((slot.slots - slot.remaining) / slot.slots) * 100}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">What you can check before buying</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROFILE_FIELDS.map((field) => (
              <div key={field} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
                {field}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
