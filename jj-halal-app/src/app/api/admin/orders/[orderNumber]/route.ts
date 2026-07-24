import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { restockOrderItemsOnce } from "@/lib/order-lifecycle";
import { logAuditEvent } from "@/lib/audit";

type Params = {
  params: Promise<{
    orderNumber: string;
  }>;
};

const ALLOWED_STATUSES = new Set<OrderStatus>([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

const ALLOWED_PAYMENT_STATUSES = new Set<PaymentStatus>(["PENDING", "PAID", "FAILED", "REFUNDED"]);

export async function POST(req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    status?: string;
    paymentStatus?: string;
  } | null;

  const nextStatus = body?.status?.toUpperCase();
  const nextPaymentStatus = body?.paymentStatus?.toUpperCase();

  if (!nextStatus && !nextPaymentStatus) {
    return NextResponse.json({ error: "No update provided" }, { status: 400 });
  }

  const { orderNumber } = await context.params;
  const existing = await prisma.order.findUnique({
    where: { orderNumber },
    select: { id: true, status: true, paymentStatus: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (nextStatus && !ALLOWED_STATUSES.has(nextStatus as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (nextPaymentStatus && !ALLOWED_PAYMENT_STATUSES.has(nextPaymentStatus as PaymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id: existing.id },
    data: {
      ...(nextStatus ? { status: nextStatus as OrderStatus } : {}),
      ...(nextPaymentStatus ? { paymentStatus: nextPaymentStatus as PaymentStatus } : {}),
      ...(nextStatus === "DELIVERED" ? { deliveredAt: new Date() } : {}),
    },
  });

  if (nextStatus === "CANCELLED") {
    await restockOrderItemsOnce({
      orderId: existing.id,
      eventType: "ORDER_CANCELLED",
    });
  }

  if (nextPaymentStatus === "FAILED") {
    await restockOrderItemsOnce({
      orderId: existing.id,
      eventType: "PAYMENT_FAILED",
    });
  }

  if (nextPaymentStatus === "REFUNDED") {
    await restockOrderItemsOnce({
      orderId: existing.id,
      eventType: "PAYMENT_REFUNDED",
    });
  }

  await logAuditEvent({
    eventType: "order.updated.by_admin",
    actorUserId: session.user.id,
    entityType: "order",
    entityId: existing.id,
    metadata: {
      orderNumber,
      previousStatus: existing.status,
      nextStatus: nextStatus ?? null,
      previousPaymentStatus: existing.paymentStatus,
      nextPaymentStatus: nextPaymentStatus ?? null,
    },
  });

  return NextResponse.json({ ok: true });
}
