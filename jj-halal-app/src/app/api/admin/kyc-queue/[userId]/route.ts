import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateKycStatus, type KycStatus } from "@/lib/kyc-queue";

const ALLOWED_STATUS = new Set<KycStatus>(["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"]);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await params;
  if (!userId?.trim()) {
    return NextResponse.json({ error: "User id is required" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as {
    status?: string;
    reviewNotes?: string;
  } | null;

  const normalizedStatus = String(body?.status ?? "").toUpperCase() as KycStatus;
  if (!ALLOWED_STATUS.has(normalizedStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const reviewNotes = body?.reviewNotes?.trim() || null;

  if (normalizedStatus === "REJECTED" && !reviewNotes) {
    return NextResponse.json({ error: "Review notes are required when rejecting KYC." }, { status: 400 });
  }

  await updateKycStatus({
    userId,
    status: normalizedStatus,
    reviewNotes,
    reviewedByUserId: session.user.id,
  });

  return NextResponse.json({ ok: true });
}
