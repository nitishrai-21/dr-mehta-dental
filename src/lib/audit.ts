import { prisma } from "@/lib/db/prisma";

export type AuditLogEntry = {
  id: string;
  adminId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: Date;
  admin: {
    name: string;
  } | null;
};

export function getAuditLogClient() {
  return (prisma as any).auditLog ?? (prisma as any).auditLogs ?? null;
}

export async function listAuditLogs({
  entityType,
  entityId,
  take = 20,
}: {
  entityType?: string;
  entityId?: string;
  take?: number;
}): Promise<AuditLogEntry[]> {
  const auditLogClient = getAuditLogClient();

  if (!auditLogClient) {
    console.warn("Audit log skipped: Prisma auditLog model is unavailable.");
    return [];
  }

  try {
    const logs = await auditLogClient.findMany({
      where: {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      include: {
        admin: {
          select: {
            name: true,
          },
        },
      },
    });

    return logs as AuditLogEntry[];
  } catch (error: any) {
    const message = error?.message ?? "";
    const isMissingTableError =
      error?.code === "P2021" ||
      /does not exist in the current database/i.test(message);

    if (!isMissingTableError) {
      throw error;
    }

    console.warn(
      "Audit log table is missing; continuing without audit log history.",
      message,
    );
    return [];
  }
}

export async function recordAuditLog({
  adminId,
  actorEmail,
  action,
  entityType,
  entityId,
  details,
}: {
  adminId: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: string | null;
}) {
  try {
    const auditLogClient = getAuditLogClient();

    if (!auditLogClient) {
      console.warn("Audit log skipped: Prisma auditLog model is unavailable.");
      return;
    }

    await auditLogClient.create({
      data: {
        adminId,
        actorEmail,
        action,
        entityType,
        entityId,
        details: details ?? null,
      },
    });
  } catch (error) {
    console.warn("Audit log write failed, continuing without it:", error);
  }
}
