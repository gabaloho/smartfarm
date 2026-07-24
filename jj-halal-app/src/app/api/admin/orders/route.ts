import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toApiOrder } from "@/lib/order-response";
import { ensureOperationalIndexes } from "@/lib/operational-indexes";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "30");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 30;
  const skip = (page - 1) * limit;
  await ensureOperationalIndexes();

  const [totalCount, orders] = await prisma.$transaction([
    prisma.order.count(),
    prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                unit: true,
              },
            },
            vendor: {
              select: {
                shopName: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json(
    {
      orders: orders.map(toApiOrder),
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    },
    {
      headers: {
        "Cache-Control": "private, max-age=10, stale-while-revalidate=20",
      },
    }
  );
}
