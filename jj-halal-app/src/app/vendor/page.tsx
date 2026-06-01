"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatNaira } from "@/lib/catalog";
import { OrderStatus, useOrdersStore } from "@/store/orders";
import { useVendorStore } from "@/store/vendor";

const VENDOR_NAME = "JJ HALAL FARMS LTD.";

function orderStatusTone(status: OrderStatus): string {
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

export default function VendorPortalPage() {
  const { data: session } = useSession();

  const products = useVendorStore((state) => state.products);
  const addProduct = useVendorStore((state) => state.addProduct);
  const removeProduct = useVendorStore((state) => state.removeProduct);
  const toggleActive = useVendorStore((state) => state.toggleActive);

  const orders = useOrdersStore((state) => state.orders);
  const updateStatus = useOrdersStore((state) => state.updateStatus);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Meat");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");

  const vendorOrders = useMemo(
    () =>
      orders
        .filter((order) => order.items.some((item) => item.vendorName === VENDOR_NAME))
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [orders]
  );

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive).length;
    const lowStockProducts = products.filter((product) => product.stock <= 10).length;
    const pendingOrders = vendorOrders.filter((order) => order.status === "PENDING").length;
    const revenue = vendorOrders.reduce((sum, order) => {
      const vendorSubtotal = order.items
        .filter((item) => item.vendorName === VENDOR_NAME)
        .reduce((inner, item) => inner + item.quantity * item.unitPrice, 0);
      return sum + vendorSubtotal;
    }, 0);

    return {
      activeProducts,
      lowStockProducts,
      pendingOrders,
      revenue,
    };
  }, [products, vendorOrders]);

  function onAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!name.trim() || !Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) {
      return;
    }

    addProduct({
      name: name.trim(),
      category,
      price: parsedPrice,
      stock: parsedStock,
      unit: unit.trim() || "unit",
      isActive: true,
    });

    setName("");
    setPrice("");
    setStock("");
    setUnit("kg");
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/jj-logo.png" alt="JJ HALAL FARMS LTD." width={126} height={42} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Vendor workspace for inventory, sales, and delivery flow.</p>
          </div>
          <Image src="/assets/promo-popup.png" alt="Vendor promo" width={200} height={96} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-700">Vendor Portal</p>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name ?? "Vendor"}</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your products and fulfill customer orders.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/orders"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Customer View
            </Link>
            <Link
              href="/admin"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Active Products</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.activeProducts}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Low Stock Items</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{metrics.lowStockProducts}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pending Orders</p>
            <p className="mt-2 text-2xl font-bold text-blue-700">{metrics.pendingOrders}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Vendor Revenue</p>
            <p className="mt-2 text-2xl font-bold text-green-700">{formatNaira(metrics.revenue)}</p>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1fr_1fr] gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>

            <form onSubmit={onAddProduct} className="mt-4 grid sm:grid-cols-2 gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Product name"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 sm:col-span-2"
                required
              />
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Price"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                required
              />
              <input
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                placeholder="Stock"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                required
              />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
              >
                <option>Meat</option>
                <option>Fish</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Dairy & Eggs</option>
                <option>Rice & Pulse</option>
                <option>Snacks</option>
                <option>Bakery</option>
              </select>
              <input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder="Unit (kg, piece, crate)"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
                required
              />
              <button
                type="submit"
                className="sm:col-span-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
              >
                Add Product
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {products.map((product) => (
                <article key={product.id} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.category} • {formatNaira(product.price)} per {product.unit} • stock {product.stock}
                      </p>
                    </div>
                    <span
                      className={
                        product.isActive
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800"
                          : "rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700"
                      }
                    >
                      {product.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(product.id)}
                      className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      {product.isActive ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Vendor Orders</h2>
            <div className="mt-4 space-y-2">
              {vendorOrders.length === 0 ? (
                <p className="text-sm text-gray-600">No orders containing your products yet.</p>
              ) : (
                vendorOrders.map((order) => {
                  const vendorItems = order.items.filter((item) => item.vendorName === VENDOR_NAME);
                  const vendorTotal = vendorItems.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  );

                  return (
                    <article key={order.orderNumber} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {vendorItems.length} vendor items • {formatNaira(vendorTotal)}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${orderStatusTone(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateStatus(order.orderNumber, "PROCESSING")}
                          className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Processing
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(order.orderNumber, "SHIPPED")}
                          className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Shipped
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(order.orderNumber, "DELIVERED")}
                          className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          Delivered
                        </button>
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          className="rounded-lg border border-green-300 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-50"
                        >
                          View
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
