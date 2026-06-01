import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validations";

const checkoutRequestSchema = checkoutSchema.extend({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().min(1),
        vendorId: z.string().min(1),
        vendorName: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
        unit: z.string().min(1),
      })
    )
    .min(1, "Cart is empty"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 30000 ? 0 : 1500;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const orderNumber = `JJH-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  const isInstantPaid = data.paymentMethod === "CASH_ON_DELIVERY";

  return NextResponse.json({
    ok: true,
    orderNumber,
    summary: {
      itemCount: data.items.length,
      subtotal,
      deliveryFee,
      discount,
      total,
    },
    payment: {
      method: data.paymentMethod,
      amount: total,
      status: isInstantPaid ? "pending" : "pending",
      nextStep:
        data.paymentMethod === "BANK_TRANSFER"
          ? "Complete bank transfer and include order number as narration."
          : data.paymentMethod === "CASH_ON_DELIVERY"
          ? "Pay cash when your order arrives."
          : "Complete payment using the secure checkout flow.",
    },
  });
}
