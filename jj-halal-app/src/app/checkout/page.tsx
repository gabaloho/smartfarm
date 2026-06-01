"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { formatNaira } from "@/lib/catalog";

const DELIVERY_FEE = 1500;
const FREE_DELIVERY_THRESHOLD = 30000;

type PaymentMethod = "PAYSTACK" | "STRIPE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrder = useOrdersStore((state) => state.addOrder);

  const [label, setLabel] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Kaduna");
  const [stateName, setStateName] = useState("Kaduna");
  const [country, setCountry] = useState("Nigeria");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAYSTACK");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0),
    [items]
  );
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (status === "loading") {
    return <div className="p-8 text-sm text-gray-600">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to continue checkout.</p>
          <Link
            href="/auth/login?callbackUrl=/checkout"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Go to products
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/checkout/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod,
        couponCode,
        notes,
        newAddress: {
          label,
          street,
          city,
          state: stateName,
          country,
          postalCode,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          vendorId: item.product.vendorId,
          vendorName: item.product.vendorName,
          quantity: item.quantity,
          unitPrice: item.product.salePrice ?? item.product.price,
          unit: item.product.unit,
        })),
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      orderNumber?: string;
      summary?: {
        subtotal: number;
        deliveryFee: number;
        discount: number;
        total: number;
      };
      payment?: {
        method: PaymentMethod;
        amount: number;
        status: "pending" | "paid";
      };
    };

    setIsSubmitting(false);

    if (!response.ok || !data.orderNumber || !data.payment || !data.summary) {
      setError(data.error ?? "Failed to place order.");
      return;
    }

    addOrder({
      orderNumber: data.orderNumber,
      createdAt: new Date().toISOString(),
      status: "PENDING",
      paymentStatus: data.payment.status,
      paymentMethod: data.payment.method,
      subtotal: data.summary.subtotal,
      deliveryFee: data.summary.deliveryFee,
      discount: data.summary.discount,
      total: data.summary.total,
      notes: notes || undefined,
      address: {
        label,
        street,
        city,
        state: stateName,
        country,
        postalCode: postalCode || undefined,
      },
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPrice: item.product.salePrice ?? item.product.price,
        vendorName: item.product.vendorName,
      })),
    });

    clearCart();
    const query = new URLSearchParams({
      order: data.orderNumber,
      method: data.payment.method,
      amount: String(data.payment.amount),
      status: data.payment.status,
    });
    router.push(`/payment?${query.toString()}`);
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/jj-logo.png" alt="JJ HALAL FARMS LTD." width={126} height={42} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Secure checkout for fresh halal essentials.</p>
          </div>
          <Image src="/assets/promo-popup.png" alt="Checkout promo" width={190} height={96} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-5">Checkout</h1>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Delivery address</h2>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" required />
                <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" required />
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" required />
                <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" required />
                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" required />
                <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code (optional)" className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900">Payment method</h2>
              <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  { value: "PAYSTACK", label: "Paystack" },
                  { value: "STRIPE", label: "Stripe" },
                  { value: "BANK_TRANSFER", label: "Bank Transfer" },
                  { value: "CASH_ON_DELIVERY", label: "Cash on Delivery" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 rounded-lg border border-gray-300 p-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value as PaymentMethod)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </section>

            <section className="grid sm:grid-cols-2 gap-3">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code (optional)"
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Delivery notes (optional)"
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-600"
              />
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </button>
          </form>

          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Items</span><span>{items.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">{formatNaira(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className="font-semibold">{formatNaira(deliveryFee)}</span></div>
              <div className="border-t border-gray-200 pt-2 flex justify-between"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-green-700">{formatNaira(total)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
