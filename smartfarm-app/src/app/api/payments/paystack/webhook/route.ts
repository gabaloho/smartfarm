import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPaystackSignatureValid } from "@/lib/payments";
import { restockOrderItemsOnce } from "@/lib/order-lifecycle";
import { logAuditEvent } from "@/lib/audit";
import { registerWebhookEvent } from "@/lib/webhook-idempotency";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!isPaystackSignatureValid(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    event?: string;
    data?: {
      id?: number | string;
      status?: string;
      reference?: string;
      paid_at?: string;
    };
  };

  if (!payload.data?.reference) {
    return NextResponse.json({ ok: true });
  }

  const reference = payload.data.reference;
  const eventId = payload.data.id
    ? `paystack:${String(payload.data.id)}`
    : `paystack:${payload.event ?? "event"}:${reference}:${payload.data.status ?? "unknown"}`;

  const webhookEvent = await registerWebhookEvent({
    id: eventId,
    source: "paystack",
    rawPayload: rawBody,
  });

  if (webhookEvent.isDuplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const existing = await prisma.order.findFirst({
    where: { paymentRef: reference },
    select: { id: true, paymentStatus: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  if (payload.event === "charge.success" && existing.paymentStatus !== "PAID") {
    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus: "PAID",
        status: existing.status === "PENDING" ? "CONFIRMED" : existing.status,
      },
    });

    await logAuditEvent({
      eventType: "payment.paystack.succeeded",
      entityType: "order",
      entityId: existing.id,
      metadata: { reference },
    });
  }

  if (payload.event === "charge.failed" && existing.paymentStatus !== "FAILED") {
    await prisma.order.update({
      where: { id: existing.id },
      data: { paymentStatus: "FAILED", status: existing.status === "PENDING" ? "CANCELLED" : existing.status },
    });

    await restockOrderItemsOnce({ orderId: existing.id, eventType: "PAYMENT_FAILED" });
    await logAuditEvent({
      eventType: "payment.paystack.failed",
      entityType: "order",
      entityId: existing.id,
      metadata: { reference },
    });
  }

  return NextResponse.json({ ok: true });
}
