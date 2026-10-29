import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAuctionListing, listAuctions } from "@/lib/auctions";
import { logAuditEvent } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "20");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(50, Math.max(1, Math.floor(limitRaw))) : 20;

  const statusParam = req.nextUrl.searchParams.get("status")?.toUpperCase();
  const status = statusParam === "LIVE" || statusParam === "CLOSED" ? statusParam : undefined;

  const result = await listAuctions({ status, page, limit });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!vendor && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as {
    title?: string;
    breed?: string;
    startingBid?: number;
    endsAt?: string;
  } | null;

  const title = String(body?.title ?? "").trim();
  const breed = String(body?.breed ?? "").trim();
  const startingBid = Number(body?.startingBid ?? 0);
  const endsAt = String(body?.endsAt ?? "").trim();

  if (!title || !breed || !Number.isFinite(startingBid) || startingBid <= 0 || !endsAt) {
    return NextResponse.json({ error: "Invalid auction payload" }, { status: 400 });
  }

  const parsedEndsAt = Date.parse(endsAt);
  if (!Number.isFinite(parsedEndsAt) || parsedEndsAt <= Date.now()) {
    return NextResponse.json({ error: "Auction end time must be in the future" }, { status: 400 });
  }

  const id = await createAuctionListing({
    vendorId: vendor?.id ?? null,
    title,
    breed,
    startingBid,
    endsAt: new Date(parsedEndsAt).toISOString(),
  });

  await logAuditEvent({
    eventType: "auction.created",
    actorUserId: session.user.id,
    entityType: "auction",
    entityId: id,
    metadata: { title, breed, startingBid },
  });

  return NextResponse.json({ ok: true, id });
}
