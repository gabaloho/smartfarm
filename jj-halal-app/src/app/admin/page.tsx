"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { CATALOG_CATEGORIES, CATALOG_PRODUCTS, formatNaira } from "@/lib/catalog";
import { CustomerOrder, OrderStatus, useOrdersStore } from "@/store/orders";

function statusClasses(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-indigo-100 text-indigo-800";
    case "SHIPPED":
      return "bg-cyan-100 text-cyan-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function sortRecentOrders(orders: CustomerOrder[]): CustomerOrder[] {
  return [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export default function AdminDashboardPage() {
  const orders = useOrdersStore((state) => state.orders);
  const updateStatus = useOrdersStore((state) => state.updateStatus);
  const markPaid = useOrdersStore((state) => state.markPaid);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
    const deliveredOrders = orders.filter((order) => order.status === "DELIVERED").length;
    const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
    const grossRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const estimatedCommission = grossRevenue * 0.05;

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      paidOrders,
      grossRevenue,
      estimatedCommission,
    };
  }, [orders]);

  const recentOrders = useMemo(() => sortRecentOrders(orders).slice(0, 8), [orders]);

  const topProducts = useMemo(() => {
    const quantities = new Map<string, { name: string; quantity: number }>();

    for (const order of orders) {
      for (const item of order.items) {
        const current = quantities.get(item.productId);
        if (!current) {
          quantities.set(item.productId, { name: item.productName, quantity: item.quantity });
        } else {
          quantities.set(item.productId, {
            name: current.name,
            quantity: current.quantity + item.quantity,
          });
        }
      }
    }

    return [...quantities.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [orders]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/JJ HALAL FARMS LOGO.jpeg" alt="JJ HALAL FARMS LTD." width={126} height={42} className="h-9 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Monitor sales, orders, and store activity from one page.</p>
          </div>
          <Image src="/assets/JJ HALAL FARMS.jpeg" alt="Admin banner" width={200} height={90} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-700">Admin</p>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Quick view of orders, payments, top products, and store performance.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              View Catalog
            </Link>
            <Link
              href="/orders"
              className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Customer Orders
            </Link>
          </div>
        </div>

        <section className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{metrics.pendingOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Delivered</p>
            <p className="mt-2 text-2xl font-bold text-green-700">{metrics.deliveredOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Paid Orders</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{metrics.paidOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Gross Revenue</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{formatNaira(metrics.grossRevenue)}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Estimated Commission</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{formatNaira(metrics.estimatedCommission)}</p>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1fr_320px] gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <div className="mt-4 space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No customer orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <article key={order.orderNumber} className="rounded-xl border border-gray-200 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items.length} items • {formatNaira(order.total)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatus(order.orderNumber, "CONFIRMED")}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(order.orderNumber, "PROCESSING")}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Process
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(order.orderNumber, "SHIPPED")}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Ship
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(order.orderNumber, "DELIVERED")}
                        className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        Deliver
                      </button>
                      {order.paymentStatus !== "paid" && (
                        <button
                          type="button"
                          onClick={() => markPaid(order.orderNumber)}
                          className="rounded-lg border border-green-300 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="space-y-5">
            <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Catalog Snapshot</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Categories</span><span className="font-semibold">{CATALOG_CATEGORIES.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Products</span><span className="font-semibold">{CATALOG_PRODUCTS.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Featured</span><span className="font-semibold">{CATALOG_PRODUCTS.filter((item) => item.isFeatured).length}</span></div>
              </div>
            </aside>

            <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Management Areas</h2>
              <div className="mt-3 grid gap-2 text-sm text-gray-700">
                <span className="rounded-lg bg-gray-50 px-3 py-2">Products and inventory</span>
                <span className="rounded-lg bg-gray-50 px-3 py-2">Users and seller approvals</span>
                <span className="rounded-lg bg-gray-50 px-3 py-2">Orders and payment records</span>
                <span className="rounded-lg bg-gray-50 px-3 py-2">Auctions and bidding activity</span>
                <span className="rounded-lg bg-gray-50 px-3 py-2">Commission reports</span>
                <span className="rounded-lg bg-gray-50 px-3 py-2">Analytics and delivery status</span>
              </div>
            </aside>

            <aside className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <div className="mt-3 space-y-2">
                {topProducts.length === 0 ? (
                  <p className="text-sm text-gray-600">Top products will appear after orders are placed.</p>
                ) : (
                  topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                      <p className="font-semibold text-gray-900">{index + 1}. {product.name}</p>
                      <p className="text-gray-600">{product.quantity} sold</p>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
