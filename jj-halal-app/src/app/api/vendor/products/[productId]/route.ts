import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";

type Params = {
  params: Promise<{
    productId: string;
  }>;
};

async function getVendorId(userId: string) {
  const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } });
  return vendor?.id ?? null;
}

export async function PATCH(req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorId = await getVendorId(session.user.id);
  if (!vendorId) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const { productId } = await context.params;
  const body = (await req.json().catch(() => null)) as { action?: string } | null;
  if (body?.action !== "toggle") {
    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }

  const existing = await prisma.product.findFirst({
    where: { id: productId, vendorId },
    select: { id: true, isActive: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updated = await prisma.product.update({
    where: { id: existing.id },
    data: { isActive: !existing.isActive },
    select: { id: true, isActive: true },
  });

  await logAuditEvent({
    eventType: "vendor.product.toggled",
    actorUserId: session.user.id,
    entityType: "product",
    entityId: updated.id,
    metadata: { isActive: updated.isActive },
  });

  return NextResponse.json({ ok: true, isActive: updated.isActive });
}

export async function DELETE(_req: NextRequest, context: Params) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorId = await getVendorId(session.user.id);
  if (!vendorId) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const { productId } = await context.params;
  const existing = await prisma.product.findFirst({
    where: { id: productId, vendorId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id: existing.id } });

  await logAuditEvent({
    eventType: "vendor.product.deleted",
    actorUserId: session.user.id,
    entityType: "product",
    entityId: existing.id,
  });

  return NextResponse.json({ ok: true });
}
