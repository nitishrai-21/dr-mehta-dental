import Link from "next/link";
import { ArrowLeft, Clock3, Filter } from "lucide-react";
import { getAuditLogClient } from "@/lib/audit";

const entityOptions = [
  "ALL",
  "Patient",
  "Appointment",
  "Prescription",
] as const;

type EntityType = (typeof entityOptions)[number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams?: Promise<{
    entityType?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const entityType = entityOptions.includes(params.entityType as EntityType)
    ? (params.entityType as EntityType)
    : "ALL";

  const fromValue = params.from ?? "";
  const toValue = params.to ?? "";

  const where: {
    entityType?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {};

  if (entityType !== "ALL") {
    where.entityType = entityType;
  }

  if (fromValue) {
    const fromDate = new Date(fromValue);
    if (!Number.isNaN(fromDate.getTime())) {
      where.createdAt = {
        ...where.createdAt,
        gte: fromDate,
      };
    }
  }

  if (toValue) {
    const toDate = new Date(toValue);
    if (!Number.isNaN(toDate.getTime())) {
      where.createdAt = {
        ...where.createdAt,
        lte: endOfDay(toDate),
      };
    }
  }

  const auditLogClient = getAuditLogClient();

  const logs = auditLogClient
    ? await auditLogClient.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: 200,
        include: {
          admin: {
            select: {
              name: true,
            },
          },
        },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Audit trail
          </p>

          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            Clinic activity
          </h2>
        </div>

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </div>

        <form className="grid gap-4 md:grid-cols-[220px_220px_220px_auto]">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              Entity type
            </label>

            <select
              name="entityType"
              defaultValue={entityType}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            >
              {entityOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL" ? "All records" : option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              From date
            </label>

            <input
              type="date"
              name="from"
              defaultValue={fromValue}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              To date
            </label>

            <input
              type="date"
              name="to"
              defaultValue={toValue}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Apply filters
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Clock3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Recent activity</h3>
        </div>

        {logs.length === 0 ? (
          <div className="p-5 text-sm text-muted">
            No audit records match the current filters.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log: any) => (
              <div key={log.id} className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-light px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      {log.entityType}
                    </span>

                    <span className="text-[11px] font-medium text-muted">
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </div>

                  <span className="text-[11px] text-muted">
                    {formatDateTime(log.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  {log.details || "No details recorded."}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                  <span className="rounded-full bg-surface-muted px-2 py-1">
                    {log.entityId}
                  </span>

                  <span>
                    {log.admin?.name || log.actorEmail || "System action"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
