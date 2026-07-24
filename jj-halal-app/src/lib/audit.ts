import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";

type AuditInput = {
  eventType: string;
  actorUserId?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

let auditTableReady = false;

async function ensureAuditTable() {
  if (auditTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS audit_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      actor_user_id TEXT NULL,
      entity_type TEXT NULL,
      entity_id TEXT NULL,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(
    "CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events (created_at DESC)"
  );

  auditTableReady = true;
}

export async function logAuditEvent(input: AuditInput) {
  try {
    await ensureAuditTable();
    await prisma.$executeRaw`
      INSERT INTO audit_events (id, event_type, actor_user_id, entity_type, entity_id, metadata)
      VALUES (${randomUUID()}, ${input.eventType}, ${input.actorUserId ?? null}, ${
      input.entityType ?? null
    }, ${input.entityId ?? null}, ${JSON.stringify(input.metadata ?? {})}::jsonb)
    `;
  } catch (error) {
    console.error("Failed to write audit event:", error);
  }
}
