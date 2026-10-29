import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

type Params = {
  params: Promise<{
    orderNumber: string;
  }>;
};

const ALLOWED_STATUS = new Set(["PROCESSING", "SHIPPED", "DELIVERED"]);

export async function POST(req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const { orderNumber } = await context.params;
  const body = (await req.json().catch(() => null)) as { status?: string } | null;
  const status = String(body?.status ?? "").toUpperCase();

  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      items: {
        some: { vendorId: vendor.id },
      },
    },
    select: {
      id: true,
      orderNumber: true,
      status: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: status as "PROCESSING" | "SHIPPED" | "DELIVERED",
      ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
    },
  });

  await logAuditEvent({
    eventType: "vendor.order.status.updated",
    actorUserId: session.user.id,
    entityType: "order",
    entityId: order.id,
    metadata: {
      orderNumber: order.orderNumber,
      previousStatus: order.status,
      nextStatus: status,
      vendorId: vendor.id,
    },
  });

  return NextResponse.json({ ok: true });
}
