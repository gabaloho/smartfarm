import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureOperationalIndexes } from "@/lib/operational-indexes";

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

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureAuditTable();
  await ensureOperationalIndexes();

  const now = Date.now();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

  const [
    pendingPaymentCount,
    failedPaymentCount24h,
    refundedCount,
    stalePendingOrderCount,
    paymentFailureEvents24h,
    webhookSuccessEvents1h,
  ] = await Promise.all([
    prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    prisma.order.count({ where: { paymentStatus: "FAILED", updatedAt: { gte: oneDayAgo } } }),
    prisma.order.count({ where: { paymentStatus: "REFUNDED" } }),
    prisma.order.count({ where: { status: "PENDING", createdAt: { lte: oneHourAgo } } }),
    prisma.$queryRawUnsafe(
      "SELECT COUNT(*)::int AS count FROM audit_events WHERE event_type IN ('payment.paystack.failed','payment.stripe.failed') AND created_at >= $1",
      oneDayAgo.toISOString()
    ) as Promise<Array<{ count: number }>>,
    prisma.$queryRawUnsafe(
      "SELECT COUNT(*)::int AS count FROM audit_events WHERE event_type IN ('payment.paystack.succeeded','payment.stripe.succeeded') AND created_at >= $1",
      oneHourAgo.toISOString()
    ) as Promise<Array<{ count: number }>>, 
  ]);

  return NextResponse.json(
    {
      pendingPaymentCount,
      failedPaymentCount24h,
      refundedCount,
      stalePendingOrderCount,
      paymentFailureEvents24h: paymentFailureEvents24h[0]?.count ?? 0,
      webhookSuccessEvents1h: webhookSuccessEvents1h[0]?.count ?? 0,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "private, max-age=5, stale-while-revalidate=10",
      },
    }
  );
}
