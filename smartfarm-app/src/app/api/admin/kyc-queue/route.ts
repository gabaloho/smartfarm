import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureKycQueueTable } from "@/lib/kyc-queue";

const ALLOWED_STATUS = new Set(["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"]);

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureKycQueueTable();

  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1");
  const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? "30");
  const statusFilter = String(req.nextUrl.searchParams.get("status") ?? "").toUpperCase();
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 30;
  const offset = (page - 1) * limit;
  const useStatusFilter = statusFilter && ALLOWED_STATUS.has(statusFilter);

  const countRows = (await prisma.$queryRawUnsafe(
    useStatusFilter
      ? "SELECT COUNT(*)::int AS count FROM kyc_queue WHERE status = $1"
      : "SELECT COUNT(*)::int AS count FROM kyc_queue",
    ...(useStatusFilter ? [statusFilter] : [])
  )) as Array<{ count: number }>;

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT
      q.user_id,
      q.account_type,
      q.business_name,
      q.business_type,
      q.cac_number,
      q.status,
      q.review_notes,
      q.reviewed_by_user_id,
      q.reviewed_at,
      q.created_at,
      q.updated_at,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone
    FROM kyc_queue q
    LEFT JOIN users u ON u.id = q.user_id
    ${useStatusFilter ? "WHERE q.status = $1" : ""}
    ORDER BY q.created_at DESC
    LIMIT $${useStatusFilter ? 2 : 1} OFFSET $${useStatusFilter ? 3 : 2}
    `,
    ...(useStatusFilter ? [statusFilter, limit, offset] : [limit, offset])
  )) as Array<{
    user_id: string;
    account_type: string;
    business_name: string | null;
    business_type: string | null;
    cac_number: string | null;
    status: string;
    review_notes: string | null;
    reviewed_by_user_id: string | null;
    reviewed_at: Date | null;
    created_at: Date;
    updated_at: Date;
    user_name: string | null;
    user_email: string | null;
    user_phone: string | null;
  }>;

  const totalCount = countRows[0]?.count ?? 0;

  return NextResponse.json(
    {
      items: rows.map((row) => ({
        userId: row.user_id,
        accountType: row.account_type,
        businessName: row.business_name,
        businessType: row.business_type,
        cacNumber: row.cac_number,
        status: row.status,
        reviewNotes: row.review_notes,
        reviewedByUserId: row.reviewed_by_user_id,
        reviewedAt: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
        createdAt: new Date(row.created_at).toISOString(),
        updatedAt: new Date(row.updated_at).toISOString(),
        user: {
          name: row.user_name,
          email: row.user_email,
          phone: row.user_phone,
        },
      })),
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
