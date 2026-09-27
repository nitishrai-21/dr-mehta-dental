import Link from "next/link";

const filters = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Confirmed",
    value: "CONFIRMED",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
] as const;

export function AppointmentFilters({
  currentStatus,
  query,
}: {
  currentStatus?: string;
  query?: string;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {filters.map((filter) => {
        const active =
          filter.value === currentStatus || (!filter.value && !currentStatus);

        const params = new URLSearchParams();

        if (filter.value) {
          params.set("status", filter.value);
        }

        if (query) {
          params.set("query", query);
        }

        const href = params.toString()
          ? `/admin/appointments?${params.toString()}`
          : "/admin/appointments";

        return (
          <Link
            key={filter.label}
            href={href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
