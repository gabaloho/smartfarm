import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { logAuditEvent } from "@/lib/audit";

function createProductSlug(name: string) {
  return `${slugify(name).slice(0, 64)}-${Math.random().toString(36).slice(2, 7)}`;
}

async function getVendorId(userId: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: { id: true },
  });
  return vendor?.id ?? null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorId = await getVendorId(session.user.id);
  if (!vendorId) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      unit: true,
      isActive: true,
      createdAt: true,
      categories: {
        include: {
          category: {
            select: { name: true },
          },
        },
      },
    },
  });

  return NextResponse.json({
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      unit: product.unit,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      categories: product.categories.map((entry) => entry.category.name),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vendorId = await getVendorId(session.user.id);
  if (!vendorId) {
    return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid product payload", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: createProductSlug(input.name),
      description: input.description,
      unit: input.unit,
      price: input.price,
      salePrice: input.salePrice,
      stock: input.stock,
      minOrder: input.minOrder,
      images: input.images ?? [],
      tags: input.tags ?? [],
      isHalal: input.isHalal,
      vendorId,
      categories: {
        create: input.categoryIds.map((categoryId) => ({ categoryId })),
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      unit: true,
      isActive: true,
      createdAt: true,
    },
  });

  await logAuditEvent({
    eventType: "vendor.product.created",
    actorUserId: session.user.id,
    entityType: "product",
    entityId: product.id,
    metadata: { name: product.name },
  });

  return NextResponse.json({
    product: {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      unit: product.unit,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
    },
  });
}
