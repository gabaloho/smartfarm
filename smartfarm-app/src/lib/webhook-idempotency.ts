import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

let webhookTableReady = false;

async function ensureWebhookTable() {
  if (webhookTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY,
      event_source TEXT NOT NULL,
      event_id TEXT NOT NULL,
      payload_hash TEXT NOT NULL,
      order_id TEXT NULL,
      processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(event_source, event_id)
    )
  `);

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events (processed_at DESC)"
  );

  webhookTableReady = true;
}

export function payloadHash(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export async function registerWebhookEvent(input: {
  id: string;
  source: "paystack" | "stripe";
  rawPayload: string;
  orderId?: string | null;
}): Promise<{ isDuplicate: boolean }> {
  await ensureWebhookTable();

  const rows = (await prisma.$queryRawUnsafe(
    `
    INSERT INTO webhook_events (id, event_source, event_id, payload_hash, order_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (event_source, event_id) DO NOTHING
    RETURNING id
    `,
    `${input.source}-${input.id}`,
    input.source,
    input.id,
    payloadHash(input.rawPayload),
    input.orderId ?? null
  )) as Array<{ id: string }>;

  return { isDuplicate: rows.length === 0 };
}
