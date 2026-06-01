"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/catalog";
import { OrderStatus, useOrdersStore } from "@/store/orders";

const STATUS_OPTIONS: Array<{ value: "ALL" | OrderStatus; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrdersPage() {
  const orders = useOrdersStore((state) => state.orders);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);
  const [activeFilter, setActiveFilter] = useState<"ALL" | OrderStatus>("ALL");

  const filtered = useMemo(() => {
    if (activeFilter === "ALL") return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/jj-logo.png" alt="JJ HALAL FARMS LTD." width={126} height={42} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Track every order from placement to delivery.</p>
          </div>
          <Image src="/assets/promo-popup.png" alt="Promo" width={190} height={96} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="mt-1 text-sm text-gray-600">Track your order history and delivery status.</p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
          >
            Continue shopping
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setActiveFilter(status.value)}
              className={
                activeFilter === status.value
                  ? "rounded-full bg-green-700 px-3 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full bg-white border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              }
            >
              {status.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-600">Your placed orders will appear here.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <article key={order.orderNumber} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Order Number</p>
                    <h2 className="text-lg font-bold text-gray-900">{order.orderNumber}</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-green-700">{formatNaira(order.total)}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    Payment: {order.paymentStatus}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    View details
                  </Link>
                  {order.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order.orderNumber)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
