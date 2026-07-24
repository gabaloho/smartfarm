import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStripeCheckoutSession, initializePaystackTransaction } from "@/lib/payments";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { orderNumber?: string } | null;
  const orderNumber = String(body?.orderNumber ?? "").trim();
  if (!orderNumber) {
    return NextResponse.json({ error: "Order number is required" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      userId: session.user.id,
    },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      paymentMethod: true,
      paymentRef: true,
      paymentStatus: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ ok: true, status: "paid" });
  }

  if (!order.paymentMethod || (order.paymentMethod !== PaymentMethod.PAYSTACK && order.paymentMethod !== PaymentMethod.STRIPE)) {
    return NextResponse.json({ ok: true, status: "manual" });
  }

  if (!order.paymentRef) {
    return NextResponse.json({ error: "Payment reference missing for this order" }, { status: 409 });
  }

  try {
    if (order.paymentMethod === PaymentMethod.PAYSTACK) {
      const initialized = await initializePaystackTransaction({
        email: session.user.email,
        amountNaira: order.total,
        reference: order.paymentRef,
        orderNumber: order.orderNumber,
      });

      return NextResponse.json({
        ok: true,
        status: "redirect",
        method: "PAYSTACK",
        authorizationUrl: initialized.authorizationUrl,
      });
    }

    const stripeSession = await createStripeCheckoutSession({
      email: session.user.email,
      amountNaira: order.total,
      paymentRef: order.paymentRef,
      orderNumber: order.orderNumber,
    });

    return NextResponse.json({
      ok: true,
      status: "redirect",
      method: "STRIPE",
      authorizationUrl: stripeSession.checkoutUrl,
    });
  } catch (error) {
    console.error("Payment initialization failed:", error);
    return NextResponse.json(
      {
        error: "Unable to initialize payment right now. Please choose Bank Transfer or try again shortly.",
      },
      { status: 502 }
    );
  }
}
