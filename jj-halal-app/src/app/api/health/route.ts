import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureOperationalIndexes } from "@/lib/operational-indexes";

export async function GET() {
  const startedAt = Date.now();
  try {
    await ensureOperationalIndexes();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "up",
      uptimeMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        database: "down",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
