"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db/prisma";
import {
  appointmentSchema,
  type AppointmentInput,
} from "@/lib/validations/appointment";

type AppointmentActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[] | undefined>;
    };

const appointmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

const appointmentIdSchema = z.string().cuid();

export async function createAppointment(
  input: AppointmentInput,
): Promise<AppointmentActionResult> {
  const parsed = appointmentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    const preferredDate = new Date(`${data.date}T00:00:00`);

    if (Number.isNaN(preferredDate.getTime())) {
      return {
        success: false,
        message: "Please select a valid appointment date.",
      };
    }

    let patient = await prisma.patient.findFirst({
      where: {
        phone: data.phone,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (patient) {
      patient = await prisma.patient.update({
        where: {
          id: patient.id,
        },
        data: {
          name: data.name,
          email: data.email || null,
        },
      });
    } else {
      patient = await prisma.patient.create({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
        },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        preferredDate,
        preferredTime: data.time,
        treatment: data.service,
        patientStatus: data.patient === "new" ? "NEW" : "EXISTING",
        message: data.message || null,
      },
    });

    await recordAuditLog({
      adminId: null,
      actorEmail: "public@drmehta-demo.local",
      action: "APPOINTMENT_CREATED",
      entityType: "Appointment",
      entityId: appointment.id,
      details: `Patient: ${data.name} | Treatment: ${data.service} | Phone: ${data.phone}`,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/patients");

    return {
      success: true,
      message:
        "Your appointment request has been received. We will contact you to confirm the appointment.",
    };
  } catch (error) {
    console.error("Failed to create appointment:", error);

    return {
      success: false,
      message: "We couldn't submit your appointment request. Please try again.",
    };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
) {
  const parsedId = appointmentIdSchema.safeParse(appointmentId);
  const parsedStatus = appointmentStatusSchema.safeParse(status);

  if (!parsedId.success || !parsedStatus.success) {
    return {
      success: false,
      message: "Invalid appointment update.",
    };
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: parsedId.data,
      },
      select: {
        id: true,
      },
    });

    if (!appointment) {
      return {
        success: false,
        message: "Appointment not found.",
      };
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: parsedId.data,
      },
      data: {
        status: parsedStatus.data,
      },
      select: {
        id: true,
        status: true,
        patient: {
          select: {
            name: true,
          },
        },
      },
    });

    const currentAdmin = await getCurrentAdmin();

    await recordAuditLog({
      adminId: currentAdmin?.id ?? null,
      actorEmail: currentAdmin?.email ?? "unknown@drmehta-demo.local",
      action: "APPOINTMENT_STATUS_UPDATED",
      entityType: "Appointment",
      entityId: updatedAppointment.id,
      details: `Patient: ${updatedAppointment.patient.name} | Status: ${updatedAppointment.status}`,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${parsedId.data}`);

    return {
      success: true,
      message: "Appointment status updated.",
    };
  } catch (error) {
    console.error("Failed to update appointment status:", error);

    return {
      success: false,
      message: "Unable to update appointment status.",
    };
  }
}
