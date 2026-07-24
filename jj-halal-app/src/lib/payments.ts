import { createHmac, timingSafeEqual } from "node:crypto";
import Stripe from "stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL;

export function isPaystackSignatureValid(payload: string, signature: string | null): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;

  const digest = createHmac("sha512", secret).update(payload).digest("hex");
  const a = Buffer.from(digest);
  const b = Buffer.from(signature);

  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getStripeClient(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(apiKey);
}

export function constructStripeEvent(payload: string, signature: string | null): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }
  if (!signature) {
    throw new Error("Missing Stripe signature");
  }

  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountNaira: number;
  reference: string;
  orderNumber: string;
}): Promise<{ authorizationUrl: string; reference: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }

  const callbackRoot = PAYSTACK_CALLBACK_URL?.trim() || `${APP_URL}/payment`;
  const separator = callbackRoot.includes("?") ? "&" : "?";
  const callbackUrl = `${callbackRoot}${separator}order=${encodeURIComponent(input.orderNumber)}&method=PAYSTACK`;
  const amountKobo = Math.round(input.amountNaira * 100);

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: amountKobo,
      reference: input.reference,
      callback_url: callbackUrl,
      metadata: {
        orderNumber: input.orderNumber,
        paymentRef: input.reference,
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    status?: boolean;
    data?: {
      authorization_url?: string;
      reference?: string;
    };
    message?: string;
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message ?? "Failed to initialize Paystack transaction");
  }

  return {
    authorizationUrl: payload.data.authorization_url,
    reference: payload.data.reference ?? input.reference,
  };
}

export async function createStripeCheckoutSession(input: {
  email: string;
  amountNaira: number;
  paymentRef: string;
  orderNumber: string;
}): Promise<{ checkoutUrl: string; paymentRef: string }> {
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    client_reference_id: input.paymentRef,
    metadata: {
      paymentRef: input.paymentRef,
      orderNumber: input.orderNumber,
    },
    success_url: `${APP_URL}/payment?order=${encodeURIComponent(input.orderNumber)}&method=STRIPE&status=pending`,
    cancel_url: `${APP_URL}/payment?order=${encodeURIComponent(input.orderNumber)}&method=STRIPE&status=pending`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "ngn",
          product_data: {
            name: `Order ${input.orderNumber}`,
          },
          unit_amount: Math.round(input.amountNaira * 100),
        },
      },
    ],
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session");
  }

  return {
    checkoutUrl: session.url,
    paymentRef: input.paymentRef,
  };
}
