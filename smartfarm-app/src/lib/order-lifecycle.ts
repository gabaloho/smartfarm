import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

type InventoryEventType = "ORDER_CANCELLED" | "PAYMENT_FAILED" | "PAYMENT_REFUNDED";

let inventoryTableReady = false;

async function ensureInventoryEventTable() {
  if (inventoryTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS order_inventory_events (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(order_id, event_type)
    )
  `);

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_order_inventory_events_order_id ON order_inventory_events (order_id)"
  );

  inventoryTableReady = true;
}

export async function restockOrderItemsOnce(input: {
  orderId: string;
  eventType: InventoryEventType;
}) {
  await ensureInventoryEventTable();

  await prisma.$transaction(async (tx) => {
    const insertedRows = (await tx.$queryRawUnsafe(
      `
      INSERT INTO order_inventory_events (id, order_id, event_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (order_id, event_type) DO NOTHING
      RETURNING id
      `,
      randomUUID(),
      input.orderId,
      input.eventType
    )) as Array<{ id: string }>;

    if (insertedRows.length === 0) {
      return;
    }

    const items = await tx.orderItem.findMany({
      where: { orderId: input.orderId },
      select: {
        productId: true,
        quantity: true,
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }
  });
}
