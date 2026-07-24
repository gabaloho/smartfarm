"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type KycItem = {
  userId: string;
  accountType: string;
  businessName: string | null;
  businessType: string | null;
  cacNumber: string | null;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
  reviewNotes: string | null;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};

export default function AdminKycQueuePage() {
  const [items, setItems] = useState<KycItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadQueue() {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/admin/kyc-queue?limit=50${statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : ""}`,
        { cache: "no-store" }
      );

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        items?: KycItem[];
      };

      if (!mounted) return;

      if (!response.ok) {
        setError(data.error ?? "Failed to load KYC queue.");
        setItems([]);
      } else {
        setItems(data.items ?? []);
      }

      setIsLoading(false);
    }

    loadQueue();

    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  async function updateStatus(userId: string, status: KycItem["status"]) {
    const response = await fetch(`/api/admin/kyc-queue/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "Failed to update KYC status.");
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.userId === userId
          ? {
              ...entry,
              status,
              reviewedAt: new Date().toISOString(),
            }
          : entry
      )
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide font-semibold text-green-700">Admin</p>
            <h1 className="text-3xl font-bold text-gray-900">KYC Review Queue</h1>
            <p className="mt-1 text-sm text-gray-600">Internal review queue for business account verification.</p>
          </div>
          <Link href="/admin" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
            Back to Admin
          </Link>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            Filter status
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {isLoading && <p className="text-sm text-gray-600">Loading KYC queue...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-3">
          {!isLoading && items.length === 0 && (
            <p className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">No KYC records found.</p>
          )}

          {items.map((item) => (
            <article key={item.userId} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.businessName ?? "Business"}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {item.user.name ?? "User"} • {item.user.email ?? "No email"} • {item.user.phone ?? "No phone"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Legal type: {item.businessType ?? "-"} • CAC: {item.cacNumber ?? "-"}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-800">{item.status}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => updateStatus(item.userId, "IN_REVIEW")} className="rounded-lg border border-blue-300 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50" type="button">
                  Mark In Review
                </button>
                <button onClick={() => updateStatus(item.userId, "APPROVED")} className="rounded-lg border border-green-300 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-50" type="button">
                  Approve
                </button>
                <button onClick={() => updateStatus(item.userId, "REJECTED")} className="rounded-lg border border-red-300 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50" type="button">
                  Reject
                </button>
                <button onClick={() => updateStatus(item.userId, "PENDING")} className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100" type="button">
                  Reset Pending
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
