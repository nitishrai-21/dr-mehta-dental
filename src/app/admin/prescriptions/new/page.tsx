import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { PrescriptionForm } from "@/components/admin/prescription-form";

export default async function NewPrescriptionPage({
  searchParams,
}: {
  searchParams?: Promise<{
    appointmentId?: string;
  }>;
}) {
  const params = await searchParams;
  const appointmentId = params?.appointmentId;

  if (!appointmentId) {
    redirect("/admin/prescriptions");
  }

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      patient: true,
      prescription: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!appointment) {
    notFound();
  }

  if (appointment.prescription) {
    redirect(`/admin/prescriptions/${appointment.prescription.id}`);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link
        href={`/admin/appointments/${appointment.id}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to appointment
      </Link>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Prescriptions
        </p>

        <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
          Create prescription
        </h2>

        <p className="mt-2 text-sm text-muted">
          Add one or more medications for this appointment.
        </p>
      </div>

      <PrescriptionForm
        appointmentId={appointment.id}
        patientName={appointment.patient.name}
        treatment={appointment.treatment}
      />
    </div>
  );
}
