import { prisma } from "@/lib/prisma";

let indexesReady = false;

async function hasColumn(tableName: string, columnName: string): Promise<boolean> {
  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
    ) AS exists
    `,
    tableName,
    columnName
  )) as Array<{ exists: boolean }>;

  return Boolean(rows[0]?.exists);
}

async function pickColumn(tableName: string, candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    if (await hasColumn(tableName, candidate)) {
      return candidate;
    }
  }

  return null;
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replace(/"/g, '""')}"`;
}

export async function ensureOperationalIndexes() {
  if (indexesReady) return;

  const orderCreatedAt = await pickColumn("orders", ["createdAt", "created_at"]);
  const orderPaymentStatus = await pickColumn("orders", ["paymentStatus", "payment_status"]);
  const orderItemVendorId = await pickColumn("order_items", ["vendorId", "vendor_id"]);
  const orderItemOrderId = await pickColumn("order_items", ["orderId", "order_id"]);
  const productVendorId = await pickColumn("products", ["vendorId", "vendor_id"]);
  const productIsActive = await pickColumn("products", ["isActive", "is_active"]);

  if (orderCreatedAt) {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders (status, ${quoteIdentifier(orderCreatedAt)} DESC)`
    );
  }

  if (orderCreatedAt && orderPaymentStatus) {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_orders_payment_status_created_at ON orders (${quoteIdentifier(orderPaymentStatus)}, ${quoteIdentifier(orderCreatedAt)} DESC)`
    );
  }

  if (orderItemVendorId && orderItemOrderId) {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_order_items_vendor_order ON order_items (${quoteIdentifier(orderItemVendorId)}, ${quoteIdentifier(orderItemOrderId)})`
    );
  }

  if (productVendorId && productIsActive) {
    await prisma.$executeRawUnsafe(
      `CREATE INDEX IF NOT EXISTS idx_products_vendor_active ON products (${quoteIdentifier(productVendorId)}, ${quoteIdentifier(productIsActive)})`
    );
  }

  indexesReady = true;
}
