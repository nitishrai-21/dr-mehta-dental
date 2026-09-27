import { Clock3 } from "lucide-react";

type AuditLogEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string | null;
  createdAt: Date;
  actorEmail: string | null;
  admin: {
    name: string;
  } | null;
};

function formatAuditDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function AuditLogPanel({
  title,
  entries,
  emptyMessage,
}: {
  title: string;
  entries: AuditLogEntry[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Clock3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {entries.length === 0 ? (
        <div className="p-5 text-sm text-muted">{emptyMessage}</div>
      ) : (
        <div className="divide-y divide-border">
          {entries.map((entry) => (
            <div key={entry.id} className="p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                  {entry.action.replace(/_/g, " ")}
                </span>

                <span className="text-[10px] text-muted">
                  {formatAuditDate(entry.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium text-foreground">
                {entry.details || "No details recorded."}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                <span className="rounded-full bg-surface-muted px-2 py-1">
                  {entry.entityType}
                </span>

                <span>
                  {entry.admin?.name || entry.actorEmail || "System action"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
