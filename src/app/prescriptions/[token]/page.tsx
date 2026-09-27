import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, FileText, ShieldCheck, Stethoscope } from "lucide-react";
import { getPublicPrescriptionByToken } from "@/app/actions/prescriptions";
import { PrescriptionDownloadButton } from "@/components/prescription-download-button";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function PublicPrescriptionPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const prescription = await getPublicPrescriptionByToken(token);

  if (!prescription) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Dr. Mehta Dental
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Prescription details
          </h1>
        </div>

        <PrescriptionDownloadButton
          prescriptionId={prescription.id}
          patientName={prescription.patient.name}
          phone={prescription.patient.phone}
          treatment={prescription.appointment.treatment}
          appointmentDate={formatDate(prescription.appointment.preferredDate)}
          doctorName={prescription.admin.name}
          issuedDate={formatDate(prescription.issuedAt)}
          items={prescription.items.map((item) => ({
            medication: item.medication,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions,
          }))}
        />
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                Clinical record
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-semibold">
              {prescription.patient.name}
            </h2>

            <p className="mt-2 text-sm text-muted">
              Issued on {formatDate(prescription.issuedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure access link
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-surface-muted p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              Appointment
            </div>

            <p className="mt-3 text-lg font-semibold">
              {prescription.appointment.treatment}
            </p>

            <p className="mt-2 text-sm text-muted">
              {formatDate(prescription.appointment.preferredDate)} ·{" "}
              {prescription.appointment.preferredTime}
            </p>
          </div>

          <div className="rounded-2xl bg-surface-muted p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Doctor
            </div>

            <p className="mt-3 text-lg font-semibold">
              {prescription.admin.name}
            </p>

            <p className="mt-2 text-sm text-muted">Prescribing clinician</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Medication plan
          </h3>

          <div className="mt-4 space-y-4">
            {prescription.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-lg font-semibold">{item.medication}</p>
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
      </div>

      <div className="mt-8 text-center text-xs text-muted">
        This secure prescription link can be viewed without logging in.
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Back to clinic website
        </Link>
      </div>
    </main>
  );
}
