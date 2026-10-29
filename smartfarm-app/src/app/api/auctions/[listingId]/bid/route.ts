import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { placeAuctionBid } from "@/lib/auctions";
import { logAuditEvent } from "@/lib/audit";

type Params = {
  params: Promise<{
    listingId: string;
  }>;
};

export async function POST(req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await context.params;
  const body = (await req.json().catch(() => null)) as { amount?: number } | null;

  try {
    const result = await placeAuctionBid({
      listingId,
      bidderId: session.user.id,
      amount: body?.amount,
    });

    await logAuditEvent({
      eventType: "auction.bid.placed",
      actorUserId: session.user.id,
      entityType: "auction",
      entityId: listingId,
      metadata: {
        bidAmount: result.bidAmount,
        minimumNextBid: result.minimumNextBid,
        endsAt: result.endsAt,
      },
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "LISTING_NOT_FOUND") {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      if (error.message === "AUCTION_CLOSED") {
        return NextResponse.json({ error: "Auction is closed" }, { status: 409 });
      }
      if (error.message.startsWith("BID_TOO_LOW:")) {
        const minimum = Number(error.message.replace("BID_TOO_LOW:", ""));
        return NextResponse.json({ error: "Bid amount is too low", minimumBid: minimum }, { status: 409 });
      }
    }

    console.error("Failed to place bid:", error);
    return NextResponse.json({ error: "Unable to place bid right now" }, { status: 500 });
  }
}
