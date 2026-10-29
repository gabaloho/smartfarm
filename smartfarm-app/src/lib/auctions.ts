import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

export type AuctionListing = {
  id: string;
  title: string;
  breed: string;
  startingBid: number;
  currentBid: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  endsAt: string;
  status: "LIVE" | "CLOSED";
  createdAt: string;
  updatedAt: string;
};

let auctionTablesReady = false;

async function ensureAuctionTables() {
  if (auctionTablesReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS auction_listings (
      id TEXT PRIMARY KEY,
      vendor_id TEXT NULL,
      title TEXT NOT NULL,
      breed TEXT NOT NULL,
      starting_bid NUMERIC(14,2) NOT NULL,
      current_bid NUMERIC(14,2) NOT NULL,
      highest_bidder_id TEXT NULL,
      ends_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'LIVE',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS auction_bids (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      bidder_id TEXT NOT NULL,
      amount NUMERIC(14,2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_auction_listings_status_ends_at ON auction_listings (status, ends_at)"
  );
  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_auction_bids_listing_id ON auction_bids (listing_id, created_at DESC)"
  );

  auctionTablesReady = true;
}

async function seedAuctionsIfEmpty() {
  const rows = (await prisma.$queryRawUnsafe(
    "SELECT COUNT(*)::int AS count FROM auction_listings"
  )) as Array<{ count: number }>;

  if ((rows[0]?.count ?? 0) > 0) return;

  const now = Date.now();
  const listings = [
    {
      id: randomUUID(),
      title: "Premium Bull Auction",
      breed: "Bunaji",
      startingBid: 1100000,
      currentBid: 1320000,
      endsAt: new Date(now + 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      title: "Ram Bidding Event",
      breed: "Yankasa",
      startingBid: 220000,
      currentBid: 265000,
      endsAt: new Date(now + 5 * 60 * 60 * 1000).toISOString(),
    },
  ];

  for (const listing of listings) {
    await prisma.$executeRaw`
      INSERT INTO auction_listings (id, title, breed, starting_bid, current_bid, ends_at, status)
      VALUES (${listing.id}, ${listing.title}, ${listing.breed}, ${listing.startingBid}, ${
      listing.currentBid
    }, ${listing.endsAt}::timestamptz, 'LIVE')
    `;
  }
}

export async function listAuctions(options?: { status?: "LIVE" | "CLOSED"; page?: number; limit?: number }) {
  await ensureAuctionTables();
  await seedAuctionsIfEmpty();

  await prisma.$executeRawUnsafe(
    "UPDATE auction_listings SET status='CLOSED', updated_at=NOW() WHERE status='LIVE' AND ends_at <= NOW()"
  );

  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(50, Math.max(1, options?.limit ?? 20));
  const offset = (page - 1) * limit;

  const whereSql = options?.status ? `WHERE l.status = '${options.status}'` : "";

  const countRows = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS count FROM auction_listings l ${whereSql}`
  )) as Array<{ count: number }>;
  const totalCount = countRows[0]?.count ?? 0;

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT
      l.id,
      l.title,
      l.breed,
      l.starting_bid,
      l.current_bid,
      l.highest_bidder_id,
      l.ends_at,
      l.status,
      l.created_at,
      l.updated_at,
      u.name AS highest_bidder_name
    FROM auction_listings l
    LEFT JOIN users u ON u.id = l.highest_bidder_id
    ${whereSql}
    ORDER BY l.created_at DESC
    LIMIT $1 OFFSET $2
  `,
    limit,
    offset
  )) as Array<{
    id: string;
    title: string;
    breed: string;
    starting_bid: number;
    current_bid: number;
    highest_bidder_id: string | null;
    highest_bidder_name: string | null;
    ends_at: Date;
    status: "LIVE" | "CLOSED";
    created_at: Date;
    updated_at: Date;
  }>;

  const listings: AuctionListing[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    breed: row.breed,
    startingBid: Number(row.starting_bid),
    currentBid: Number(row.current_bid),
    highestBidderId: row.highest_bidder_id,
    highestBidderName: row.highest_bidder_name,
    endsAt: new Date(row.ends_at).toISOString(),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }));

  return {
    listings,
    page,
    limit,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
}

export async function createAuctionListing(input: {
  vendorId: string | null;
  title: string;
  breed: string;
  startingBid: number;
  endsAt: string;
}) {
  await ensureAuctionTables();
  const id = randomUUID();

  await prisma.$executeRaw`
    INSERT INTO auction_listings (id, vendor_id, title, breed, starting_bid, current_bid, ends_at, status)
    VALUES (${id}, ${input.vendorId}, ${input.title}, ${input.breed}, ${input.startingBid}, ${
    input.startingBid
  }, ${input.endsAt}::timestamptz, 'LIVE')
  `;

  return id;
}

export async function placeAuctionBid(input: {
  listingId: string;
  bidderId: string;
  amount?: number;
}) {
  await ensureAuctionTables();

  return prisma.$transaction(async (tx) => {
    const rows = (await tx.$queryRawUnsafe(
      `
      SELECT id, current_bid, starting_bid, highest_bidder_id, ends_at, status
      FROM auction_listings
      WHERE id = $1
      FOR UPDATE
      `,
      input.listingId
    )) as Array<{
      id: string;
      current_bid: number;
      starting_bid: number;
      highest_bidder_id: string | null;
      ends_at: Date;
      status: "LIVE" | "CLOSED";
    }>;

    const listing = rows[0];
    if (!listing) {
      throw new Error("LISTING_NOT_FOUND");
    }

    const now = Date.now();
    const endMs = new Date(listing.ends_at).getTime();
    if (listing.status !== "LIVE" || endMs <= now) {
      await tx.$executeRawUnsafe(
        "UPDATE auction_listings SET status='CLOSED', updated_at=NOW() WHERE id = $1",
        input.listingId
      );
      throw new Error("AUCTION_CLOSED");
    }

    const currentBid = Number(listing.current_bid);
    const increment = currentBid >= 1_000_000 ? 50_000 : 10_000;
    const minimum = currentBid + increment;
    const bidAmount = Number.isFinite(input.amount) && input.amount ? input.amount : minimum;

    if (bidAmount < minimum) {
      throw new Error(`BID_TOO_LOW:${minimum}`);
    }

    const remainingMs = endMs - now;
    const extendedEndMs = remainingMs <= 120_000 ? endMs + 120_000 : endMs;

    await tx.$executeRawUnsafe(
      `
      UPDATE auction_listings
      SET current_bid = $1,
          highest_bidder_id = $2,
          ends_at = $3::timestamptz,
          updated_at = NOW()
      WHERE id = $4
      `,
      bidAmount,
      input.bidderId,
      new Date(extendedEndMs).toISOString(),
      input.listingId
    );

    await tx.$executeRaw`
      INSERT INTO auction_bids (id, listing_id, bidder_id, amount)
      VALUES (${randomUUID()}, ${input.listingId}, ${input.bidderId}, ${bidAmount})
    `;

    return {
      bidAmount,
      minimumNextBid: bidAmount + increment,
      endsAt: new Date(extendedEndMs).toISOString(),
    };
  });
}
