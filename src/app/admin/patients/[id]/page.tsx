import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, Mail, Phone } from "lucide-react";
import { AuditLogPanel } from "@/components/admin/audit-log-panel";
import { listAuditLogs } from "@/lib/audit";
import { prisma } from "@/lib/db/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
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

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      appointments: {
        orderBy: {
          preferredDate: "desc",
        },
        take: 20,
      },
      prescriptions: {
        include: {
          items: true,
        },
        orderBy: {
          issuedAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!patient) {
    notFound();
  }

  const patientAuditLogs = await listAuditLogs({
    entityType: "Patient",
    entityId: id,
    take: 20,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <Link
        href="/admin/patients"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to patients
      </Link>

      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {initials(patient.name)}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Patient profile
          </p>

          <h2 className="mt-1 text-3xl font-semibold">{patient.name}</h2>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
            <a
              href={`tel:${patient.phone}`}
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              {patient.phone}
            </a>

            {patient.email && (
              <a
                href={`mailto:${patient.email}`}
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                {patient.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold">Appointment history</h3>

            <p className="mt-1 text-xs text-muted">
              {patient.appointments.length} recent appointments
            </p>
          </div>

          {patient.appointments.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center px-5 text-center">
              <p className="text-sm text-muted">No appointment history yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {patient.appointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/admin/appointments/${appointment.id}`}
                  className="block p-5 transition-colors hover:bg-surface-muted"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {appointment.treatment}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(appointment.preferredDate)} ·{" "}
                        <span className="capitalize">
                          {appointment.preferredTime}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusClasses(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status.charAt(0) +
                        appointment.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold">Prescriptions</h3>

            <p className="mt-1 text-xs text-muted">Medication history</p>
          </div>

          {patient.prescriptions.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center px-5 text-center">
              <FileText className="h-5 w-5 text-muted" />

              <p className="mt-3 text-sm font-semibold">No prescriptions</p>

              <p className="mt-1 text-xs text-muted">
                Prescriptions created for this patient will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {patient.prescriptions.map((prescription) => (
                <Link
                  key={prescription.id}
                  href={`/admin/prescriptions/${prescription.id}`}
                  className="block p-5 transition-colors hover:bg-surface-muted"
                >
                  <p className="text-xs font-semibold text-primary">
                    {formatDate(prescription.issuedAt)}
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {prescription.items.length} medication{" "}
                    {prescription.items.length === 1 ? "item" : "items"}
                  </p>

                  <div className="mt-2 space-y-1">
                    {prescription.items.slice(0, 3).map((item) => (
                      <p key={item.id} className="text-xs text-muted">
                        {item.medication} · {item.dosage}
                      </p>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <AuditLogPanel
        title="Patient activity"
        entries={patientAuditLogs.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          admin: entry.admin,
        }))}
        emptyMessage="No activity recorded for this patient yet."
      />
    </div>
  );
}
