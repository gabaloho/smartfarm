import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PaymentMethod } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { slugify } from "@/lib/utils";
import { getRequestIp, limitRequest } from "@/lib/rate-limit";

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

const INTERNAL_VENDOR_EMAIL = "seller@jjhalalfarms.com";

async function ensureInternalVendor() {
  const existingVendor = await prisma.vendor.findFirst({
    where: {
      OR: [{ slug: "jj-halal-farms" }, { user: { email: INTERNAL_VENDOR_EMAIL } }],
    },
    select: { id: true },
  });

  if (existingVendor) {
    return existingVendor.id;
  }

  const systemUser = await prisma.user.upsert({
    where: { email: INTERNAL_VENDOR_EMAIL },
    create: {
      email: INTERNAL_VENDOR_EMAIL,
      name: "JJ HALAL FARMS LTD.",
      role: "VENDOR",
      emailVerified: new Date(),
      isActive: true,
    },
    update: {
      role: "VENDOR",
      isActive: true,
      emailVerified: new Date(),
    },
    select: { id: true },
  });

  const createdVendor = await prisma.vendor.create({
    data: {
      userId: systemUser.id,
      shopName: "JJ HALAL FARMS LTD.",
      slug: "jj-halal-farms",
      sellerCategory: "Farm",
      commission: 5,
      isVerified: true,
      isActive: true,
    },
    select: { id: true },
  });

  return createdVendor.id;
}

async function ensureProduct(productName: string, productUnit: string, price: number, vendorId: string) {
  const slug = slugify(productName).slice(0, 70) || `product-${randomUUID().slice(0, 8)}`;
  const existing = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const product = await prisma.product.create({
    data: {
      name: productName,
      slug,
      unit: productUnit,
      price,
      stock: 9999,
      minOrder: 1,
      images: [],
      tags: [],
      isActive: true,
      isHalal: true,
      vendorId,
    },
    select: { id: true },
  });

  return product.id;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getRequestIp(req.headers);
  const throttle = limitRequest({
    key: `checkout:${session.user.id}:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!throttle.ok) {
    return NextResponse.json(
      { error: "Too many checkout attempts. Please wait and try again." },
      {
        status: 429,
        headers: throttle.retryAfterSeconds ? { "Retry-After": String(throttle.retryAfterSeconds) } : undefined,
      }
    );
  }

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

  const addressId = await (async () => {
    if (data.addressId) {
      const existingAddress = await prisma.address.findFirst({
        where: {
          id: data.addressId,
          userId: session.user.id,
        },
        select: { id: true },
      });
      return existingAddress?.id ?? null;
    }

    if (data.newAddress) {
      const created = await prisma.address.create({
        data: {
          label: data.newAddress.label,
          street: data.newAddress.street,
          city: data.newAddress.city,
          state: data.newAddress.state,
          country: data.newAddress.country,
          postalCode: data.newAddress.postalCode,
          userId: session.user.id,
        },
        select: { id: true },
      });

      return created.id;
    }

    return null;
  })();

  const vendorId = await ensureInternalVendor();

  const productIds = await Promise.all(
    data.items.map((item) => ensureProduct(item.productName, item.unit, item.unitPrice, vendorId))
  );

  const paymentMethod = data.paymentMethod as PaymentMethod;
  const paymentRef =
    paymentMethod === "PAYSTACK" || paymentMethod === "STRIPE"
      ? `${paymentMethod.toLowerCase()}_${orderNumber}_${randomUUID().slice(0, 6)}`
      : null;

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      for (let index = 0; index < data.items.length; index += 1) {
        const item = data.items[index];
        const productId = productIds[index];
        const decremented = await tx.product.updateMany({
          where: {
            id: productId,
            stock: { gte: item.quantity },
          },
          data: {
            stock: { decrement: item.quantity },
          },
        });

        if (decremented.count !== 1) {
          throw new Error(`INSUFFICIENT_STOCK:${item.productName}`);
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId,
          paymentMethod,
          paymentRef,
          paymentStatus: "PENDING",
          status: "PENDING",
          subtotal,
          deliveryFee,
          discount,
          total,
          notes: data.notes?.trim() || null,
          items: {
            create: data.items.map((item, index) => ({
              productId: productIds[index],
              vendorId,
              quantity: item.quantity,
              price: item.unitPrice,
              total: item.unitPrice * item.quantity,
            })),
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = error.message.replace("INSUFFICIENT_STOCK:", "");
      return NextResponse.json({ error: `${productName} is out of stock or has limited quantity.` }, { status: 409 });
    }

    console.error("Failed to place order:", error);
    return NextResponse.json({ error: "Unable to place order right now. Please try again." }, { status: 500 });
  }

  if (session.user.email && session.user.name) {
    sendOrderConfirmationEmail(session.user.email, session.user.name, order.orderNumber, total).catch(
      (error) => {
        console.error("Failed to send order confirmation email:", error);
      }
    );
  }

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
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
      status: "pending",
      reference: paymentRef,
      nextStep:
        data.paymentMethod === "BANK_TRANSFER"
          ? "Complete bank transfer and include order number as narration."
          : data.paymentMethod === "CASH_ON_DELIVERY"
          ? "Pay cash when your order arrives."
          : "Complete payment using the secure checkout flow.",
    },
  });
}
