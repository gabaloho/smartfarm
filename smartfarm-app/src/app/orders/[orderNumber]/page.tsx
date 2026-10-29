"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatNaira } from "@/lib/catalog";
import type { ApiOrder } from "@/lib/order-response";

export default function OrderDetailsPage() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOrder() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${params.orderNumber}`, { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        order?: ApiOrder;
      };

      if (!mounted) return;

      if (!response.ok || !data.order) {
        setError(data.error ?? "We could not load this order.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }

      setIsLoading(false);
    }

    if (params.orderNumber) {
      loadOrder();
    }

    return () => {
      mounted = false;
    };
  }, [params.orderNumber]);

  if (isLoading) {
    return <div className="p-8 text-sm text-gray-600">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-600">{error ?? "We could not find this order in your account history."}</p>
          <Link
            href="/orders"
            className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <Image src="/assets/gue-smart-farms-logo.svg" alt="Gue Smart Farms Limited" width={122} height={40} className="h-9 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
          <Image src="/assets/gue-smart-farms-banner.svg" alt="Order banner" width={180} height={70} className="hidden sm:block h-12 w-24 rounded-md object-cover" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs text-gray-500">Order Number</p>
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
          </div>
          <Link
            href="/orders"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Back to orders
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item) => (
                <article key={`${order.orderNumber}-${item.productId}`} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-xs text-gray-500 mt-1">Vendor: {item.vendorName}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{formatNaira(item.unitPrice * item.quantity)}</p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {item.quantity} x {formatNaira(item.unitPrice)} per {item.unit}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Status</span><span className="font-semibold">{order.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Payment</span><span className="font-semibold">{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Method</span><span className="font-semibold">{order.paymentMethod ?? "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">{formatNaira(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span className="font-semibold">{formatNaira(order.deliveryFee)}</span></div>
              <div className="border-t border-gray-200 pt-2 flex justify-between"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-green-700">{formatNaira(order.total)}</span></div>
            </div>

            <h3 className="mt-5 font-semibold text-gray-900">Delivery Address</h3>
            <p className="mt-2 text-sm text-gray-600">
              {order.address
                ? `${order.address.label}: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}${order.address.postalCode ? `, ${order.address.postalCode}` : ""}`
                : "No delivery address saved for this order."}
            </p>

            {order.notes && (
              <>
                <h3 className="mt-4 font-semibold text-gray-900">Notes</h3>
                <p className="mt-1 text-sm text-gray-600">{order.notes}</p>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
