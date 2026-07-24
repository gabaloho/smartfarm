import { prisma } from "@/lib/prisma";

export type KycStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";

let kycTableReady = false;

export async function ensureKycQueueTable() {
  if (kycTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS kyc_queue (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      account_type TEXT NOT NULL,
      business_name TEXT NULL,
      business_type TEXT NULL,
      cac_number TEXT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      review_notes TEXT NULL,
      reviewed_by_user_id TEXT NULL,
      reviewed_at TIMESTAMPTZ NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_kyc_queue_status_created_at ON kyc_queue (status, created_at DESC)"
  );

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_kyc_queue_user_id ON kyc_queue (user_id)"
  );

  kycTableReady = true;
}

export async function enqueueKycReview(input: {
  userId: string;
  accountType: string;
  businessName?: string | null;
  businessType?: string | null;
  cacNumber?: string | null;
}) {
  await ensureKycQueueTable();

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO kyc_queue (id, user_id, account_type, business_name, business_type, cac_number, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
    ON CONFLICT (user_id) DO UPDATE
      SET account_type = EXCLUDED.account_type,
          business_name = EXCLUDED.business_name,
          business_type = EXCLUDED.business_type,
          cac_number = EXCLUDED.cac_number,
          status = CASE
            WHEN kyc_queue.status = 'APPROVED' THEN 'APPROVED'
            ELSE 'PENDING'
          END,
          updated_at = NOW()
    `,
    `kyc-${input.userId}`,
    input.userId,
    input.accountType,
    input.businessName ?? null,
    input.businessType ?? null,
    input.cacNumber ?? null
  );
}

export async function updateKycStatus(input: {
  userId: string;
  status: KycStatus;
  reviewNotes?: string | null;
  reviewedByUserId: string;
}) {
  await ensureKycQueueTable();

  await prisma.$executeRawUnsafe(
    `
    UPDATE kyc_queue
    SET status = $2,
        review_notes = $3,
        reviewed_by_user_id = $4,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE user_id = $1
    `,
    input.userId,
    input.status,
    input.reviewNotes ?? null,
    input.reviewedByUserId
  );
}
