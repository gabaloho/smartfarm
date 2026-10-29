import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function ensureAuditTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      actor_user_id TEXT NULL,
      entity_type TEXT NULL,
      entity_id TEXT NULL,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureAuditTable();

  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(200, Math.max(1, Math.floor(limitRaw))) : 50;
  const offset = (page - 1) * limit;
  const eventType = req.nextUrl.searchParams.get("eventType")?.trim() ?? "";

  const whereClause = eventType ? "WHERE event_type = $1" : "";
  const queryArgs = eventType ? [eventType, limit, offset] : [limit, offset];

  const countRows = (await prisma.$queryRawUnsafe(
    eventType
      ? "SELECT COUNT(*)::int AS count FROM audit_events WHERE event_type = $1"
      : "SELECT COUNT(*)::int AS count FROM audit_events",
    ...(eventType ? [eventType] : [])
  )) as Array<{ count: number }>;

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, event_type, actor_user_id, entity_type, entity_id, metadata, created_at
    FROM audit_events
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${eventType ? 2 : 1} OFFSET $${eventType ? 3 : 2}
    `,
    ...queryArgs
  )) as Array<{
    id: string;
    event_type: string;
    actor_user_id: string | null;
    entity_type: string | null;
    entity_id: string | null;
    metadata: unknown;
    created_at: Date;
  }>;

  const totalCount = countRows[0]?.count ?? 0;
    return NextResponse.json(
      {
        events: rows.map((row) => ({
          id: row.id,
          eventType: row.event_type,
          actorUserId: row.actor_user_id,
          entityType: row.entity_type,
          entityId: row.entity_id,
          metadata: row.metadata,
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
