"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type OpsSummary = {
  pendingPaymentCount: number;
  failedPaymentCount24h: number;
  refundedCount: number;
  stalePendingOrderCount: number;
  paymentFailureEvents24h: number;
  webhookSuccessEvents1h: number;
  generatedAt: string;
};

type AuditEvent = {
  id: string;
  eventType: string;
  actorUserId: string | null;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  createdAt: string;
};

type InventoryEvent = {
  id: string;
  orderId: string;
  eventType: string;
  createdAt: string;
};

export default function AdminOpsPage() {
  const [summary, setSummary] = useState<OpsSummary | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [inventoryEvents, setInventoryEvents] = useState<InventoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadOpsData() {
      setIsLoading(true);
      setError(null);

      const [summaryRes, auditRes, inventoryRes] = await Promise.all([
        fetch("/api/admin/ops/summary", { cache: "no-store" }),
        fetch(`/api/admin/audit-events?limit=30${auditFilter ? `&eventType=${encodeURIComponent(auditFilter)}` : ""}`, {
          cache: "no-store",
        }),
        fetch(`/api/admin/inventory-events?limit=30${inventoryFilter ? `&eventType=${encodeURIComponent(inventoryFilter)}` : ""}`, {
          cache: "no-store",
        }),
      ]);

      const summaryData = (await summaryRes.json().catch(() => ({}))) as Partial<OpsSummary> & {
        error?: string;
      };
      const auditData = (await auditRes.json().catch(() => ({}))) as {
        error?: string;
        events?: AuditEvent[];
      };
      const inventoryData = (await inventoryRes.json().catch(() => ({}))) as {
        error?: string;
        events?: InventoryEvent[];
      };

      if (!mounted) return;

      if (!summaryRes.ok) {
        setError(summaryData.error ?? "Failed to load ops summary.");
      } else {
        setSummary(summaryData as OpsSummary);
      }

      if (!auditRes.ok) {
        setError((current) => current ?? auditData.error ?? "Failed to load audit events.");
      } else {
        setAuditEvents(auditData.events ?? []);
      }

      if (!inventoryRes.ok) {
        setError((current) => current ?? inventoryData.error ?? "Failed to load inventory events.");
      } else {
        setInventoryEvents(inventoryData.events ?? []);
      }

      setIsLoading(false);
    }

    loadOpsData();

    return () => {
      mounted = false;
    };
  }, [auditFilter, inventoryFilter]);

  const cards = useMemo(
    () => [
      { label: "Pending Payments", value: summary?.pendingPaymentCount ?? 0 },
      { label: "Failed Payments (24h)", value: summary?.failedPaymentCount24h ?? 0 },
      { label: "Refunded Orders", value: summary?.refundedCount ?? 0 },
      { label: "Stale Pending Orders", value: summary?.stalePendingOrderCount ?? 0 },
      { label: "Payment Fail Events (24h)", value: summary?.paymentFailureEvents24h ?? 0 },
      { label: "Webhook Success (1h)", value: summary?.webhookSuccessEvents1h ?? 0 },
    ],
    [summary]
  );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-700">Admin Operations</p>
            <h1 className="text-3xl font-bold text-gray-900">Ops Console</h1>
            <p className="mt-1 text-sm text-gray-600">Monitor payments, inventory reversals, and critical audit signals.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
              Back to Admin
            </Link>
            <Link href="/api/health" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">
              Health Endpoint
            </Link>
          </div>
        </div>

        {isLoading && <p className="text-sm text-gray-600 mb-4">Loading ops telemetry...</p>}
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
          {cards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-5">
          <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Audit Events</h2>
              <select
                value={auditFilter}
                onChange={(event) => setAuditFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
              >
                <option value="">All events</option>
                <option value="payment.paystack.failed">Paystack failures</option>
                <option value="payment.stripe.failed">Stripe failures</option>
                <option value="order.updated.by_admin">Admin order changes</option>
                <option value="auction.bid.placed">Auction bids</option>
              </select>
            </div>
            <div className="mt-3 space-y-2">
              {auditEvents.length === 0 ? (
                <p className="text-sm text-gray-600">No matching audit events.</p>
              ) : (
                auditEvents.map((item) => (
                  <div key={item.id} className="rounded-lg bg-gray-50 p-3 text-xs">
                    <p className="font-semibold text-gray-900">{item.eventType}</p>
                    <p className="text-gray-600 mt-0.5">{item.entityType ?? "entity"} {item.entityId ? `(${item.entityId.slice(0, 8)})` : ""}</p>
                    <p className="text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Inventory Reversal Events</h2>
              <select
                value={inventoryFilter}
                onChange={(event) => setInventoryFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
              >
                <option value="">All reversals</option>
                <option value="ORDER_CANCELLED">Order cancelled</option>
                <option value="PAYMENT_FAILED">Payment failed</option>
                <option value="PAYMENT_REFUNDED">Payment refunded</option>
              </select>
            </div>
            <div className="mt-3 space-y-2">
              {inventoryEvents.length === 0 ? (
                <p className="text-sm text-gray-600">No matching inventory events.</p>
              ) : (
                inventoryEvents.map((item) => (
                  <div key={item.id} className="rounded-lg bg-gray-50 p-3 text-xs">
                    <p className="font-semibold text-gray-900">{item.eventType}</p>
                    <p className="text-gray-600 mt-0.5">Order {item.orderId.slice(0, 10)}</p>
                    <p className="text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <p className="mt-5 text-xs text-gray-500">
          Snapshot generated: {summary ? new Date(summary.generatedAt).toLocaleString() : "-"}
        </p>
      </div>
    </div>
  );
}
