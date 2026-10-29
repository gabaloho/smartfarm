"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { formatNaira } from "@/lib/catalog";

type VendorProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  categories: string[];
};

type VendorOrder = {
  orderNumber: string;
  createdAt: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: "PAYSTACK" | "STRIPE" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | null;
  vendorTotal: number;
  itemCount: number;
};

const CATEGORY_TO_ID: Record<string, string> = {
  Eggs: "eggs",
  Chicken: "chicken",
  Livestock: "livestock",
  Marketplace: "marketplace",
  Auctions: "auctions",
  Delivery: "delivery",
  Meat: "chicken",
};

function orderStatusTone(status: VendorOrder["status"]): string {
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

  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Chicken");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/vendor/products", { cache: "no-store" }),
        fetch("/api/vendor/orders", { cache: "no-store" }),
      ]);

      const productsData = (await productsRes.json().catch(() => ({}))) as {
        error?: string;
        products?: VendorProduct[];
      };
      const ordersData = (await ordersRes.json().catch(() => ({}))) as {
        error?: string;
        orders?: VendorOrder[];
      };

      if (!mounted) return;

      if (!productsRes.ok) {
        setError(productsData.error ?? "Failed to load vendor products.");
      } else {
        setProducts(productsData.products ?? []);
      }

      if (!ordersRes.ok) {
        setError(ordersData.error ?? "Failed to load vendor orders.");
      } else {
        setOrders(ordersData.orders ?? []);
      }

      setIsLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const activeProducts = products.filter((product) => product.isActive).length;
    const lowStockProducts = products.filter((product) => product.stock <= 10).length;
    const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
    const revenue = orders.reduce((sum, order) => sum + order.vendorTotal, 0);

    return {
      activeProducts,
      lowStockProducts,
      pendingOrders,
      revenue,
    };
  }, [products, orders]);

  async function onAddProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (!name.trim() || !Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) {
      setError("Enter valid product name, price, and stock.");
      return;
    }

    const categoryId = CATEGORY_TO_ID[category] ?? "chicken";

    const response = await fetch("/api/vendor/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: `${name.trim()} by ${session?.user?.name ?? "vendor"}`,
        unit: unit.trim() || "unit",
        price: parsedPrice,
        stock: parsedStock,
        minOrder: 1,
        categoryIds: [categoryId],
        images: [],
        tags: [],
        isHalal: true,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      product?: VendorProduct;
    };

    if (!response.ok || !data.product) {
      setError(data.error ?? "Failed to add product.");
      return;
    }

    setProducts((current) => [data.product as VendorProduct, ...current]);
    setName("");
    setPrice("");
    setStock("");
    setUnit("kg");
  }

  async function toggleProduct(productId: string) {
    const response = await fetch(`/api/vendor/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle" }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string; isActive?: boolean };
    if (!response.ok || typeof data.isActive !== "boolean") {
      setError(data.error ?? "Failed to update product.");
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === productId ? { ...item, isActive: data.isActive as boolean } : item))
    );
  }

  async function removeProduct(productId: string) {
    const response = await fetch(`/api/vendor/products/${productId}`, { method: "DELETE" });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to remove product.");
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== productId));
  }

  async function updateOrderStatus(orderNumber: string, status: "PROCESSING" | "SHIPPED" | "DELIVERED") {
    const response = await fetch(`/api/vendor/orders/${orderNumber}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to update order status.");
      return;
    }

    setOrders((current) =>
      current.map((order) => (order.orderNumber === orderNumber ? { ...order, status } : order))
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/gue-smart-farms-logo.svg" alt="Gue Smart Farms Limited" width={126} height={42} className="h-9 w-auto object-contain" style={{ width: "auto", height: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Manage your products, stock, and customer orders in one place.</p>
          </div>
          <Image src="/assets/promo-popup.png" alt="Vendor promo" width={200} height={96} className="hidden sm:block h-16 w-32 rounded-lg object-cover" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-700">Seller account</p>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {session?.user?.name ?? "Vendor"}</h1>
            <p className="mt-1 text-sm text-gray-600">Add items, update stock, and follow incoming orders.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/orders" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Customer View
            </Link>
            <Link href="/admin" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
              Admin page
            </Link>
          </div>
        </div>

        {isLoading && <p className="text-sm text-gray-600 mb-4">Loading vendor dashboard...</p>}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

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
            <h2 className="text-lg font-semibold text-gray-900">Your products</h2>

            <form onSubmit={onAddProduct} className="mt-4 grid sm:grid-cols-2 gap-2">
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Product name" className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 sm:col-span-2" required />
              <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price" className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600" required />
              <input value={stock} onChange={(event) => setStock(event.target.value)} placeholder="Stock" className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600" required />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600">
                <option>Meat</option>
                <option>Eggs</option>
                <option>Chicken</option>
                <option>Livestock</option>
                <option>Marketplace</option>
                <option>Auctions</option>
                <option>Delivery</option>
              </select>
              <input value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="Unit (kg, piece, crate)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600" required />
              <button type="submit" className="sm:col-span-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
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
                        {product.categories[0] ?? "General"} • {formatNaira(product.price)} per {product.unit} • stock {product.stock}
                      </p>
                    </div>
                    <span className={product.isActive ? "rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800" : "rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-700"}>
                      {product.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => toggleProduct(product.id)} className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                      {product.isActive ? "Pause" : "Activate"}
                    </button>
                    <button type="button" onClick={() => removeProduct(product.id)} className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Orders for your products</h2>
            <div className="mt-4 space-y-2">
              {orders.length === 0 ? (
                <p className="text-sm text-gray-600">You have not received any orders yet.</p>
              ) : (
                orders.map((order) => (
                  <article key={order.orderNumber} className="rounded-xl border border-gray-200 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.itemCount} vendor items • {formatNaira(order.vendorTotal)}
                        </p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${orderStatusTone(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => updateOrderStatus(order.orderNumber, "PROCESSING")} className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        Processing
                      </button>
                      <button type="button" onClick={() => updateOrderStatus(order.orderNumber, "SHIPPED")} className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        Shipped
                      </button>
                      <button type="button" onClick={() => updateOrderStatus(order.orderNumber, "DELIVERED")} className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                        Delivered
                      </button>
                      <Link href={`/orders/${order.orderNumber}`} className="rounded-lg border border-green-300 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-50">
                        View
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
