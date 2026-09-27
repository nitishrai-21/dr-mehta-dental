import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileText,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { ensurePrescriptionShareToken } from "@/app/actions/prescriptions";
import { AuditLogPanel } from "@/components/admin/audit-log-panel";
import { CopyShareButton } from "@/components/admin/copy-share-button";
import { listAuditLogs } from "@/lib/audit";
import { prisma } from "@/lib/db/prisma";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminPrescriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      patient: true,
      appointment: {
        select: {
          id: true,
          preferredDate: true,
          preferredTime: true,
          treatment: true,
          message: true,
          patientStatus: true,
        },
      },
      admin: {
        select: {
          name: true,
        },
      },
      items: {
        orderBy: {
          medication: "asc",
        },
      },
    },
  });

  if (!prescription) {
    notFound();
  }

  const prescriptionAuditLogs = await listAuditLogs({
    entityType: "Prescription",
    entityId: id,
    take: 20,
  });

  const shareToken = await ensurePrescriptionShareToken(id);
  const shareUrl = shareToken
    ? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/prescriptions/${shareToken}`
    : "";

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <Link
        href="/admin/prescriptions"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to prescriptions
      </Link>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Prescription record
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              {prescription.patient.name}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Issued on {formatDate(prescription.issuedAt)}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            No login required
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <UserRound className="h-3.5 w-3.5 text-primary" />
              Patient
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {prescription.patient.name}
            </p>
            <p className="mt-1 text-sm text-muted">
              {prescription.patient.phone}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <Stethoscope className="h-3.5 w-3.5 text-primary" />
              Treatment
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {prescription.appointment.treatment}
            </p>
            <p className="mt-1 text-sm text-muted">
              {formatDate(prescription.appointment.preferredDate)} ·{" "}
              {prescription.appointment.preferredTime}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Prescriber
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {prescription.admin.name}
            </p>
            <p className="mt-1 text-sm text-muted">Clinical prescription</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
            Medication plan
          </h3>

          <div className="mt-4 space-y-4">
            {prescription.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-semibold text-foreground">
                    {item.medication}
                  </p>
                  <span className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary">
                    {item.dosage}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span className="rounded-full bg-surface-muted px-2 py-1">
                    {item.frequency}
                  </span>
                  <span className="rounded-full bg-surface-muted px-2 py-1">
                    {item.duration}
                  </span>
                </div>

                {item.instructions && (
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            Patient share link
          </div>

          {shareUrl ? (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Share this secure link with the patient for no-login
                prescription access.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  readOnly
                  value={shareUrl}
                  className="h-12 flex-1 rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none"
                />

                <CopyShareButton shareUrl={shareUrl} />
              </div>

              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Open link
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              A secure link could not be generated for this prescription.
            </p>
          )}
        </div>
      </div>

      <AuditLogPanel
        title="Prescription activity"
        entries={prescriptionAuditLogs.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt),
          admin: entry.admin,
        }))}
        emptyMessage="No activity recorded for this prescription yet."
      />
    </div>
  );
}
