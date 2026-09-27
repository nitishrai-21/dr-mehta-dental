import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, UserPlus } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { DashboardStats } from "@/components/admin/dashboard-stats";

function startOfToday() {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date;
}

function endOfToday() {
  const date = new Date();

  date.setHours(23, 59, 59, 999);

  return date;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function statusClasses(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-primary-light text-primary";

    case "CANCELLED":
      return "bg-red-50 text-red-700";

    case "COMPLETED":
      return "bg-slate-100 text-slate-700";

    default:
      return "bg-accent-light text-[#8a632f]";
  }
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function AdminDashboardPage() {
  const todayStart = startOfToday();
  const todayEnd = endOfToday();

  const [
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    newPatients,
    todaysList,
    recentRequests,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        preferredDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.appointment.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.appointment.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.patient.count({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.appointment.findMany({
      where: {
        preferredDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 8,
    }),

    prisma.appointment.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          {getGreeting()}, Dr. Mehta
        </h2>

        <p className="mt-2 text-sm text-muted">
          Here&apos;s what&apos;s happening at the clinic today.
        </p>
      </div>

      <DashboardStats
        todayAppointments={todayAppointments}
        pendingAppointments={pendingAppointments}
        confirmedAppointments={confirmedAppointments}
        newPatients={newPatients}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-sm font-semibold">
                Today&apos;s appointments
              </h3>

              <p className="mt-1 text-xs text-muted">
                {formatDate(new Date())}
              </p>
            </div>

            <Link
              href="/admin/appointments"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {todaysList.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold">
                No appointments today
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
                New appointment requests will appear here once they are
                submitted from the public website.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {todaysList.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/admin/appointments/${appointment.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
                >
                  <div className="w-20 shrink-0">
                    <span className="text-sm font-semibold capitalize">
                      {appointment.preferredTime}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-muted">
                      Preferred
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {appointment.patient.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted">
                      {appointment.treatment}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                      appointment.status,
                    )}`}
                  >
                    {formatStatus(appointment.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold">Recent requests</h3>

            <p className="mt-1 text-xs text-muted">
              Latest appointment activity
            </p>
          </div>

          {recentRequests.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center px-5 text-center">
              <UserPlus className="h-5 w-5 text-muted" />

              <p className="mt-3 text-sm font-semibold">No requests yet</p>

              <p className="mt-1 text-xs text-muted">
                Appointment requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentRequests.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/admin/appointments/${appointment.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {appointment.patient.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted">
                        {appointment.treatment}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${statusClasses(
                        appointment.status,
                      )}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(appointment.preferredDate)} ·{" "}
                    <span className="capitalize">
                      {appointment.preferredTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
