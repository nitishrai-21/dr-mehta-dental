import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Pill,
  UserRound,
} from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { Pagination } from "@/components/admin/pagination";

const PAGE_SIZE = 10;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function PrescriptionsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params?.page) || 1, 1);

  const [prescriptions, totalPrescriptions] = await Promise.all([
    prisma.prescription.findMany({
      include: {
        patient: true,
        appointment: {
          select: {
            id: true,
            preferredDate: true,
            preferredTime: true,
            treatment: true,
          },
        },
        admin: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            id: true,
            medication: true,
            dosage: true,
            frequency: true,
            duration: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.prescription.count(),
  ]);

  const totalPages = Math.max(Math.ceil(totalPrescriptions / PAGE_SIZE), 1);
  const safePage = Math.min(currentPage, totalPages);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Prescriptions
          </p>

          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            Prescription records
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            View prescriptions issued for patients and review the medications
            associated with each appointment.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <Pill className="h-4 w-4 text-primary" />

          <span className="text-sm font-semibold text-foreground">
            {prescriptions.length}
          </span>

          <span className="text-xs text-muted">
            {prescriptions.length === 1 ? "prescription" : "prescriptions"}
          </span>
        </div>
      </div>

      {/* Empty state */}
      {prescriptions.length === 0 ? (
        <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <FileText className="h-6 w-6" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">No prescriptions yet</h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Prescriptions created from patient appointments will appear here.
          </p>
        </section>
      ) : (
        <>
          {/* Desktop table */}
          <section className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">All prescriptions</h3>

              <p className="mt-1 text-xs text-muted">
                Recently issued prescription records
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Patient
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Treatment
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Medications
                    </th>

                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Issued
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {prescriptions.map((prescription) => (
                    <tr
                      key={prescription.id}
                      className="transition-colors hover:bg-surface-muted/60"
                    >
                      {/* Patient */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                            {prescription.patient.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {prescription.patient.name}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-muted">
                              {prescription.patient.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Treatment */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {prescription.appointment.treatment}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                          <CalendarDays className="h-3.5 w-3.5" />

                          {formatDate(prescription.appointment.preferredDate)}

                          <span>·</span>

                          <span className="capitalize">
                            {prescription.appointment.preferredTime}
                          </span>
                        </div>
                      </td>

                      {/* Medications */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {prescription.items.slice(0, 2).map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary"
                            >
                              {item.medication}
                            </span>
                          ))}

                          {prescription.items.length > 2 && (
                            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-muted">
                              +{prescription.items.length - 2} more
                            </span>
                          )}

                          {prescription.items.length === 0 && (
                            <span className="text-xs text-muted">
                              No medications
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Issued */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-foreground">
                          {formatDate(prescription.issuedAt)}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          By {prescription.admin.name}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/prescriptions/${prescription.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary-light"
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

          {/* Mobile cards */}
          <section className="space-y-3 md:hidden">
            {prescriptions.map((prescription) => (
              <Link
                key={prescription.id}
                href={`/admin/prescriptions/${prescription.id}`}
                className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-muted"
              >
                {/* Patient */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                      {prescription.patient.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {prescription.patient.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted">
                        {prescription.patient.phone}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
                </div>

                {/* Appointment */}
                <div className="mt-4 rounded-xl bg-surface-muted p-3">
                  <div className="flex items-start gap-2.5">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {prescription.appointment.treatment}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {formatDate(prescription.appointment.preferredDate)} ·{" "}
                        <span className="capitalize">
                          {prescription.appointment.preferredTime}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Pill className="h-3.5 w-3.5 text-primary" />

                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Medications
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {prescription.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-primary"
                      >
                        {item.medication}
                      </span>
                    ))}

                    {prescription.items.length > 3 && (
                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-muted">
                        +{prescription.items.length - 3} more
                      </span>
                    )}

                    {prescription.items.length === 0 && (
                      <span className="text-xs text-muted">No medications</span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-[11px] text-muted">Issued</p>

                    <p className="mt-0.5 text-xs font-medium text-foreground">
                      {formatDate(prescription.issuedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <UserRound className="h-3.5 w-3.5" />

                    {prescription.admin.name}
                  </div>
                </div>
              </Link>
            ))}
          </section>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            pathname="/admin/prescriptions"
            params={{}}
          />
        </>
      )}
    </div>
  );
}
