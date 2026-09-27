import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { AuditLogPanel } from "@/components/admin/audit-log-panel";
import { listAuditLogs } from "@/lib/audit";
import { prisma } from "@/lib/db/prisma";
import { AppointmentStatusActions } from "@/components/admin/appointment-status-actions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
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

export default async function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      patient: true,
      prescription: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!appointment) {
    notFound();
  }

  const appointmentAuditLogs = await listAuditLogs({
    entityType: "Appointment",
    entityId: id,
    take: 20,
  });

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <Link
        href="/admin/appointments"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to appointments
      </Link>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Appointment
          </p>

          <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
            {appointment.patient.name}
          </h2>

          <p className="mt-2 text-sm text-muted">{appointment.treatment}</p>
        </div>

        <span
          className={`self-start rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses(
            appointment.status,
          )}`}
        >
          {formatStatus(appointment.status)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Appointment details</h3>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Preferred date
                </p>

                <p className="mt-1.5 flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {formatDate(appointment.preferredDate)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Preferred time
                </p>

                <p className="mt-1.5 text-sm font-medium capitalize">
                  {appointment.preferredTime}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Treatment
                </p>

                <p className="mt-1.5 text-sm font-medium">
                  {appointment.treatment}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Patient status
                </p>

                <p className="mt-1.5 text-sm font-medium capitalize">
                  {appointment.patientStatus.toLowerCase()} patient
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Patient message</h3>
            </div>

            <div className="p-5">
              {appointment.message ? (
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
                  {appointment.message}
                </p>
              ) : (
                <p className="text-sm text-muted">
                  No additional message was provided.
                </p>
              )}
            </div>
          </section>

          {appointment.prescription && (
            <section className="rounded-2xl border border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold">Prescription</h3>

                  <p className="mt-1 text-xs text-muted">
                    {appointment.prescription.items.length} medication{" "}
                    {appointment.prescription.items.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <Link
                  href={`/admin/prescriptions/${appointment.prescription.id}`}
                  className="text-xs font-semibold text-primary hover:text-primary-dark"
                >
                  View
                </Link>
              </div>

              <div className="divide-y divide-border">
                {appointment.prescription.items.map((item) => (
                  <div key={item.id} className="p-5">
                    <p className="text-sm font-semibold">{item.medication}</p>

                    <p className="mt-1 text-xs text-muted">
                      {item.dosage} · {item.frequency} · {item.duration}
                    </p>

                    {item.instructions && (
                      <p className="mt-2 text-xs leading-5 text-muted">
                        {item.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Patient</h3>
            </div>

            <div className="space-y-4 p-5">
              <Link
                href={`/admin/patients/${appointment.patient.id}`}
                className="flex items-center gap-3 rounded-xl bg-surface-muted p-3 transition-colors hover:bg-primary-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {appointment.patient.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {appointment.patient.name}
                  </p>

                  <p className="mt-0.5 text-xs text-muted">
                    View patient profile
                  </p>
                </div>
              </Link>

              <div className="space-y-3">
                <a
                  href={`tel:${appointment.patient.phone}`}
                  className="flex items-center gap-3 text-sm text-muted hover:text-foreground"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {appointment.patient.phone}
                </a>

                {appointment.patient.email && (
                  <a
                    href={`mailto:${appointment.patient.email}`}
                    className="flex items-center gap-3 break-all text-sm text-muted hover:text-foreground"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    {appointment.patient.email}
                  </a>
                )}

                <div className="flex items-center gap-3 text-sm text-muted">
                  <User className="h-4 w-4 text-primary" />
                  {appointment.patientStatus.toLowerCase()} patient
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Manage status</h3>
            </div>

            <div className="p-5">
              <AppointmentStatusActions
                appointmentId={appointment.id}
                status={appointment.status}
              />
            </div>
          </section>

          {appointment.prescription ? (
            <section className="rounded-2xl border border-border bg-surface">
              <div className="border-b border-border px-5 py-4">
                <h3 className="text-sm font-semibold">Prescription record</h3>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <FileText className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Issued</p>
                    <p className="text-xs text-muted">
                      Prescription attached to this appointment.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            appointment.status !== "CANCELLED" && (
              <section className="rounded-2xl border border-dashed border-border bg-surface">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">
                        No prescription issued yet
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Create a prescription for this appointment when
                        treatment is ready.
                      </p>
                    </div>

                    <Link
                      href={`/admin/prescriptions/new?appointmentId=${appointment.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      Create prescription
                    </Link>
                  </div>
                </div>
              </section>
            )
          )}
        </div>
      </div>

      <AuditLogPanel
        title="Appointment activity"
        entries={appointmentAuditLogs.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          admin: entry.admin,
        }))}
        emptyMessage="No activity recorded for this appointment yet."
      />
    </div>
  );
}
