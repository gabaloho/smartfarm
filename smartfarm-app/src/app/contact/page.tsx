import Image from "next/image";
import ContactForm from "./contact-form";

export const metadata = {
  title: "Contact Us | Gue Smart Farms Limited",
  description: "Get in touch with Gue Smart Farms Limited for orders, support, and business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Contact Gue Smart Farms Limited
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                We are here to help with your orders and inquiries.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-2xl">
                Reach out for product questions, delivery support, livestock reservations,
                and marketplace guidance.
              </p>
              <p className="mt-4 text-sm text-gray-700">
                Use the message form below to contact our team.
              </p>
            </div>

            <div className="relative min-h-64">
              <Image
                src="/assets/gue-smart-farms-banner.svg"
                alt="Gue Smart Farms"
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

          <ContactForm />
        </section>
      </div>
    </div>
  );
}
