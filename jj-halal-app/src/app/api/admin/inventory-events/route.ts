import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureOperationalIndexes } from "@/lib/operational-indexes";

async function ensureInventoryEventTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS order_inventory_events (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(order_id, event_type)
    )
  `);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureInventoryEventTable();
  await ensureOperationalIndexes();

  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(200, Math.max(1, Math.floor(limitRaw))) : 50;
  const offset = (page - 1) * limit;
  const eventType = req.nextUrl.searchParams.get("eventType")?.trim() ?? "";

  const countRows = (await prisma.$queryRawUnsafe(
    eventType
      ? "SELECT COUNT(*)::int AS count FROM order_inventory_events WHERE event_type = $1"
      : "SELECT COUNT(*)::int AS count FROM order_inventory_events",
    ...(eventType ? [eventType] : [])
  )) as Array<{ count: number }>;

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, order_id, event_type, created_at
    FROM order_inventory_events
    ${eventType ? "WHERE event_type = $1" : ""}
    ORDER BY created_at DESC
    LIMIT $${eventType ? 2 : 1} OFFSET $${eventType ? 3 : 2}
    `,
    ...(eventType ? [eventType, limit, offset] : [limit, offset])
  )) as Array<{
    id: string;
    order_id: string;
    event_type: string;
    created_at: Date;
  }>;

  const totalCount = countRows[0]?.count ?? 0;

  return NextResponse.json(
    {
      events: rows.map((row) => ({
        id: row.id,
        orderId: row.order_id,
        eventType: row.event_type,
        createdAt: new Date(row.created_at).toISOString(),
      })),
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
    {
      headers: {
        "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
      },
    }
  );
}
