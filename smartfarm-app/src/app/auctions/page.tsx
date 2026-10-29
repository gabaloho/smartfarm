"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface AuctionListing {
  id: string;
  title: string;
  breed: string;
  startingBid: number;
  currentBid: number;
  highestBidderName: string | null;
  endsAt: string;
  status: "LIVE" | "CLOSED";
}

function formatRemaining(milliseconds: number): string {
  if (milliseconds <= 0) return "Auction closed";

  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function AuctionsPage() {
  const [listings, setListings] = useState<AuctionListing[]>([]);
  const [now, setNow] = useState<number | null>(() => Date.now());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAuctions() {
      const response = await fetch("/api/auctions?status=LIVE&limit=24", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        listings?: AuctionListing[];
        error?: string;
      };

      if (!mounted) return;

      if (!response.ok) {
        setError(data.error ?? "Failed to load auctions.");
        return;
      }

      setListings(data.listings ?? []);
    }

    loadAuctions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const derivedListings = useMemo(
    () =>
      listings.map((listing) => {
        const remaining = now === null ? null : new Date(listing.endsAt).getTime() - now;
        return {
          ...listing,
          remaining,
          closed: remaining !== null && remaining <= 0,
        };
      }),
    [listings, now]
  );

  function placeBid(listingId: string) {
    setError(null);
    void (async () => {
      const response = await fetch(`/api/auctions/${listingId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        bidAmount?: number;
        endsAt?: string;
      };

      if (!response.ok || !data.bidAmount) {
        setError(data.error ?? "Unable to place bid right now.");
        return;
      }

      setListings((current) =>
        current.map((listing) =>
          listing.id === listingId
            ? {
                ...listing,
                currentBid: data.bidAmount as number,
                highestBidderName: "You",
                endsAt: data.endsAt ?? listing.endsAt,
              }
            : listing
        )
      );
    })();
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            <div className="p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800">
                Timed bidding
              </p>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                Auction sales with countdown timers and clear bid visibility.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-2xl">
                Sellers set a starting price and closing time.
                Buyers can place bids and follow the highest bid until the timer ends.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/marketplace" className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black">
                  View marketplace
                </Link>
                <Link href="/contact" className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                  Ask for auction help
                </Link>
              </div>
            </div>
            <div className="relative min-h-64">
              <Image src="/assets/gue-smart-farms-banner.svg" alt="Auction banner" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-linear-to-r from-gray-900/35 to-transparent" />
            </div>
          </div>
        </div>

        <section className="grid xl:grid-cols-[1fr_300px] gap-5">
          <div className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {derivedListings.map((listing) => (
              <article key={listing.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">{listing.breed}</p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">{listing.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">Starting bid: ₦{listing.startingBid.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-wide text-emerald-700">Current highest bid</p>
                    <p className="mt-1 text-xl font-bold text-emerald-800">₦{listing.currentBid.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Highest bidder</p>
                    <p className="mt-1 font-semibold text-gray-900">{listing.highestBidderName ?? "No bidder yet"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Countdown</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {listing.remaining === null ? "Loading..." : formatRemaining(listing.remaining)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
                    <p className="mt-1 font-semibold text-gray-900">{listing.closed || listing.status === "CLOSED" ? "Closed" : "Live"}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => placeBid(listing.id)}
                    disabled={listing.closed}
                    className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Place bid
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside>
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">How auctions work</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>Sellers can choose regular sale or timed auction.</li>
                <li>Each auction shows the starting bid and closing time.</li>
                <li>When the timer ends, the highest bid wins.</li>
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </div>
  );
}
