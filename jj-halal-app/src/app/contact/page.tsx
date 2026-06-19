import Image from "next/image";

export const metadata = {
  title: "Contact Us | JJ HALAL FARMS LTD.",
  description: "Get in touch with JJ HALAL FARMS LTD. for orders, support, and business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Contact JJ HALAL FARMS LTD.
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                We are here to help with your orders and inquiries.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-2xl">
                Reach out for product questions, delivery support, livestock reservations,
                and marketplace guidance.
              </p>

              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                <a
                  href="tel:08094171618"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 hover:bg-white"
                >
                  Phone: 08094171618
                </a>
                <a
                  href="mailto:info@jjhalalfarms.com"
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-semibold text-gray-800 hover:bg-white"
                >
                  Email: info@jjhalalfarms.com
                </a>
              </div>

              <p className="mt-4 text-sm text-gray-700">
                Address: AT19, Jada Road, PRP, Kaduna
              </p>
            </div>

            <div className="relative min-h-64">
              <Image
                src="/assets/JJ HALAL FARMS.jpeg"
                alt="JJ Halal Farms"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/35 to-transparent" />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
          <p className="mt-2 text-sm text-gray-600">
            We usually respond within one business day.
          </p>

          <form className="mt-5 grid sm:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700">
              Name
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="Your name"
              />
            </label>
            <label className="text-sm text-gray-700">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">
              Subject
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="How can we help?"
              />
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">
              Message
              <textarea
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-emerald-600"
                placeholder="Write your message"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="button"
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Submit Message
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
