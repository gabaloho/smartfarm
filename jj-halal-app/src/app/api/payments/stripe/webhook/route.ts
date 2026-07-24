import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { constructStripeEvent } from "@/lib/payments";
import { restockOrderItemsOnce } from "@/lib/order-lifecycle";
import { logAuditEvent } from "@/lib/audit";
import { registerWebhookEvent } from "@/lib/webhook-idempotency";

function readOrderReferenceFromEvent(event: {
  type: string;
  data: { object: Record<string, unknown> };
}): string | null {
  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed" || event.type === "charge.refunded") {
    const obj = event.data.object;
    const metadata = (obj.metadata as Record<string, unknown> | undefined) ?? {};
    const fromMetadata = typeof metadata.paymentRef === "string" ? metadata.paymentRef : null;
    const paymentIntentId = typeof obj.id === "string" ? obj.id : null;
    return fromMetadata ?? paymentIntentId;
  }

  if (event.type === "checkout.session.completed") {
    const obj = event.data.object;
    const metadata = (obj.metadata as Record<string, unknown> | undefined) ?? {};
    const fromMetadata = typeof metadata.paymentRef === "string" ? metadata.paymentRef : null;
    const clientRef = typeof obj.client_reference_id === "string" ? obj.client_reference_id : null;
    const paymentIntent = typeof obj.payment_intent === "string" ? obj.payment_intent : null;
    return fromMetadata ?? clientRef ?? paymentIntent;
  }

  return null;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = constructStripeEvent(rawBody, signature);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 401 }
    );
  }

  const stripeEventId = String((event as { id?: string }).id ?? "").trim();
  if (!stripeEventId) {
    return NextResponse.json({ error: "Missing Stripe event id" }, { status: 400 });
  }

  const webhookEvent = await registerWebhookEvent({
    id: stripeEventId,
    source: "stripe",
    rawPayload: rawBody,
  });

  if (webhookEvent.isDuplicate) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const paymentRef = readOrderReferenceFromEvent(event as unknown as { type: string; data: { object: Record<string, unknown> } });
  if (!paymentRef) {
    return NextResponse.json({ ok: true });
  }

  const existing = await prisma.order.findFirst({
    where: {
      OR: [{ paymentRef }, { paymentRef: `stripe_${paymentRef}` }],
    },
    select: { id: true, paymentStatus: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ ok: true });
  }

  if (event.type === "payment_intent.succeeded" || event.type === "checkout.session.completed") {
    if (existing.paymentStatus === "PAID") {
      return NextResponse.json({ ok: true });
    }

    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus: "PAID",
        status: existing.status === "PENDING" ? "CONFIRMED" : existing.status,
      },
    });

    await logAuditEvent({
      eventType: "payment.stripe.succeeded",
      entityType: "order",
      entityId: existing.id,
      metadata: { paymentRef, stripeEventType: event.type },
    });
    return NextResponse.json({ ok: true });
  }

  if (event.type === "payment_intent.payment_failed") {
    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus: "FAILED",
        status: existing.status === "PENDING" ? "CANCELLED" : existing.status,
      },
    });

    await restockOrderItemsOnce({ orderId: existing.id, eventType: "PAYMENT_FAILED" });
    await logAuditEvent({
      eventType: "payment.stripe.failed",
      entityType: "order",
      entityId: existing.id,
      metadata: { paymentRef, stripeEventType: event.type },
    });
    return NextResponse.json({ ok: true });
  }

  if (event.type === "charge.refunded") {
    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus: "REFUNDED",
        status: "REFUNDED",
      },
    });

    await restockOrderItemsOnce({ orderId: existing.id, eventType: "PAYMENT_REFUNDED" });
    await logAuditEvent({
      eventType: "payment.stripe.refunded",
      entityType: "order",
      entityId: existing.id,
      metadata: { paymentRef, stripeEventType: event.type },
    });
  }

  return NextResponse.json({ ok: true });
}
