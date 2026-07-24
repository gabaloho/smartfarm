import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toApiOrder } from "@/lib/order-response";
import { restockOrderItemsOnce } from "@/lib/order-lifecycle";
import { logAuditEvent } from "@/lib/audit";

type Params = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(_req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderNumber } = await context.params;
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              unit: true,
            },
          },
          vendor: {
            select: {
              shopName: true,
            },
          },
        },
      },
      address: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: toApiOrder(order) });
}

export async function POST(req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { action?: string } | null;
  if (body?.action !== "cancel") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const { orderNumber } = await context.params;
  const existing = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 409 });
  }

  await prisma.order.update({
    where: { id: existing.id },
    data: { status: "CANCELLED" },
  });

  await restockOrderItemsOnce({
    orderId: existing.id,
    eventType: "ORDER_CANCELLED",
  });

  await logAuditEvent({
    eventType: "order.cancelled.by_customer",
    actorUserId: session.user.id,
    entityType: "order",
    entityId: existing.id,
    metadata: { orderNumber },
  });

  return NextResponse.json({ ok: true });
}
