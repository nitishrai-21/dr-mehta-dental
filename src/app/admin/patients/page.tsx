import Link from "next/link";
import { ChevronRight, Mail, Phone, SearchX, Users } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { PatientSearch } from "@/components/admin/patient-search";
import { Pagination } from "@/components/admin/pagination";

const PAGE_SIZE = 10;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const query = params?.query?.trim() ?? "";
  const currentPage = Math.max(Number(params?.page) || 1, 1);

  const where = query
    ? {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            phone: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const [patients, totalPatients] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: {
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.patient.count({
      where,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalPatients / PAGE_SIZE), 1);

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
              Patients
            </h2>

            <p className="mt-2 text-sm text-muted">
              Search and review the clinic patient directory.
            </p>
          </div>

          <div className="text-xs text-muted">
            {totalPatients} {totalPatients === 1 ? "patient" : "patients"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <PatientSearch defaultValue={query} />
      </div>

      {patients.length === 0 ? (
        <section className="rounded-2xl border border-border bg-surface">
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-muted">
              {query ? (
                <SearchX className="h-5 w-5" />
              ) : (
                <Users className="h-5 w-5" />
              )}
            </div>

            <h3 className="mt-4 text-base font-semibold">
              {query ? "No patients found" : "No patients yet"}
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
              {query
                ? "Try another name, phone number or email address."
                : "Patients will appear here after appointment requests are submitted."}
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="divide-y divide-border">
              {patients.map((patient) => (
                <Link
                  key={patient.id}
                  href={`/admin/patients/${patient.id}`}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-muted sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                    {initials(patient.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {patient.name}
                    </p>

                    <div className="mt-1 flex flex-col gap-1 text-xs text-muted sm:flex-row sm:items-center sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {patient.phone}
                      </span>

                      {patient.email && (
                        <span className="hidden items-center gap-1.5 md:flex">
                          <Mail className="h-3.5 w-3.5" />
                          {patient.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="hidden items-center gap-5 text-right sm:flex">
                    <div>
                      <p className="text-sm font-semibold">
                        {patient._count.appointments}
                      </p>

                      <p className="text-[10px] text-muted">appointments</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {patient._count.prescriptions}
                      </p>

                      <p className="text-[10px] text-muted">prescriptions</p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
                </Link>
              ))}
            </div>
          </section>

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            pathname="/admin/patients"
            params={{
              query,
            }}
          />
        </>
      )}
    </div>
  );
}
