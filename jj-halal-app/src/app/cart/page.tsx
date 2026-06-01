"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCartStore } from "@/store/cart";
import { formatNaira } from "@/lib/catalog";

const FREE_DELIVERY_THRESHOLD = 30000;
const STANDARD_DELIVERY_FEE = 1500;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product.salePrice ?? item.product.price) * item.quantity, 0),
    [items]
  );
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 rounded-2xl border border-green-100 bg-white p-4 flex items-center justify-between gap-3">
          <div>
            <Image src="/assets/jj-logo.png" alt="JJ HALAL FARMS LTD." width={120} height={40} className="h-9 w-auto object-contain" style={{ width: "auto" }} />
            <p className="mt-2 text-xs text-gray-600">Review your halal picks before checkout.</p>
          </div>
          <Image src="/assets/banner.jpeg" alt="Cart banner" width={180} height={72} className="hidden sm:block h-14 w-28 rounded-lg object-cover" />
        </div>

        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-sm text-gray-600 mt-1">Review your items before checkout.</p>
          </div>
          {items.length > 0 && (
            <button
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              onClick={clearCart}
              type="button"
            >
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-600">Add some products from the catalog to get started.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            <section className="space-y-3">
              {items.map((item) => {
                const unitPrice = item.product.salePrice ?? item.product.price;
                return (
                  <article key={item.product.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="mt-1 text-xs text-gray-500">{formatNaira(unitPrice)} per {item.product.unit}</p>
                        <p className="mt-1 text-sm font-semibold text-green-700">
                          {formatNaira(unitPrice * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-sm font-semibold text-red-600 hover:text-red-700"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 inline-flex items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-gray-700 hover:bg-gray-100"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.min(item.quantity + 1, item.product.maxOrder ?? item.product.stock)
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="font-semibold text-gray-900">{formatNaira(deliveryFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-green-700">{formatNaira(total)}</span>
                </div>
              </div>

              {subtotal < FREE_DELIVERY_THRESHOLD && subtotal > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  Add {formatNaira(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery.
                </p>
              )}

              <Link
                href="/checkout"
                className="mt-4 inline-flex w-full justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
