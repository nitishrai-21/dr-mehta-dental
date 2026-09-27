import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  SearchX,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { AppointmentFilters } from "@/components/admin/appointment-filters";
import { AppointmentSearch } from "@/components/admin/appointment-search";
import { Pagination } from "@/components/admin/pagination";

const PAGE_SIZE = 10;

const validStatuses = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
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

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    status?: string;
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params?.query?.trim() ?? "";
  const requestedStatus = params?.status;

  const status = validStatuses.includes(
    requestedStatus as (typeof validStatuses)[number],
  )
    ? requestedStatus
    : undefined;

  const currentPage = Math.max(Number(params?.page) || 1, 1);

  const where = {
    ...(status
      ? {
          status: status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED",
        }
      : {}),
    ...(query
      ? {
          OR: [
            {
              patient: {
                name: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              patient: {
                phone: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              patient: {
                email: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              treatment: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [appointments, totalAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        prescription: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        {
          preferredDate: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.appointment.count({
      where,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalAppointments / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Clinic
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Appointments
            </h2>

            <p className="mt-2 text-sm text-muted">
              Review appointment requests and manage their status.
            </p>
          </div>

          <div className="text-xs text-muted">
            {totalAppointments}{" "}
            {totalAppointments === 1 ? "appointment" : "appointments"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <AppointmentSearch defaultValue={query} />
          <AppointmentFilters currentStatus={status} query={query} />
        </div>
      </div>

      {appointments.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
              <SearchX className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-base font-semibold">
              No appointments found
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
              Try changing the search term or selecting a different status
              filter.
            </p>

            <Link
              href="/admin/appointments"
              className="mt-5 text-xs font-semibold text-primary hover:text-primary-dark"
            >
              Clear filters
            </Link>
          </div>
        </section>
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60">
                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Patient
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Treatment
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Date
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Preferred time
                    </th>

                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Status
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold">
                          {appointment.patient.name}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {appointment.patient.phone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm">{appointment.treatment}</p>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {formatDate(appointment.preferredDate)}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium capitalize">
                        {appointment.preferredTime}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                            appointment.status,
                          )}`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/appointments/${appointment.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark"
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3 md:hidden">
            {appointments.map((appointment) => (
              <Link
                key={appointment.id}
                href={`/admin/appointments/${appointment.id}`}
                className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-muted"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {appointment.patient.name}
                    </p>

                    <p className="mt-1 text-xs text-muted">
                      {appointment.treatment}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClasses(
                      appointment.status,
                    )}`}
                  >
                    {formatStatus(appointment.status)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(appointment.preferredDate)}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {appointment.preferredTime}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted">
                  <span>
                    {appointment.prescription
                      ? "Prescription issued"
                      : "Awaiting prescription"}
                  </span>

                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    Open
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </section>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            pathname="/admin/appointments"
            params={
              status
                ? {
                    status,
                    query,
                  }
                : {
                    query,
                  }
            }
          />
        </>
      )}
    </div>
  );
}
