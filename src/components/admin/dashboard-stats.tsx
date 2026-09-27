import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserPlus,
  Users,
} from "lucide-react";

type DashboardStatsProps = {
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  newPatients: number;
};

const stats = [
  {
    key: "todayAppointments",
    label: "Today's appointments",
    icon: CalendarDays,
  },
  {
    key: "pendingAppointments",
    label: "Pending requests",
    icon: Clock3,
  },
  {
    key: "confirmedAppointments",
    label: "Confirmed",
    icon: CheckCircle2,
  },
  {
    key: "newPatients",
    label: "New patients",
    icon: UserPlus,
  },
] as const;

export function DashboardStats({
  todayAppointments,
  pendingAppointments,
  confirmedAppointments,
  newPatients,
}: DashboardStatsProps) {
  const values = {
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    newPatients,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-xs text-muted">Overview</span>
            </div>

            <p className="mt-5 text-2xl font-semibold text-foreground">
              {values[stat.key]}
            </p>

            <p className="mt-1 text-xs text-muted">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
