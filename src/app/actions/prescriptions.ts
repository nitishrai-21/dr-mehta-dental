"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db/prisma";

const prescriptionItemSchema = z.object({
  medication: z.string().trim().min(1).max(200),
  dosage: z.string().trim().min(1).max(100),
  frequency: z.string().trim().min(1).max(100),
  duration: z.string().trim().min(1).max(100),
  instructions: z.string().trim().max(500).optional(),
});

const createPrescriptionSchema = z.object({
  appointmentId: z.string().cuid(),
  items: z.array(prescriptionItemSchema).min(1, "Add at least one medication."),
});

async function getDemoAdmin() {
  return prisma.admin.upsert({
    where: {
      email: "admin@drmehta-demo.local",
    },
    update: {
      name: "Dr. Mehta",
      role: "ADMIN",
    },
    create: {
      name: "Dr. Mehta",
      email: "admin@drmehta-demo.local",
      role: "ADMIN",
    },
  });
}

export async function ensurePrescriptionShareToken(prescriptionId: string) {
  const prescription = await prisma.prescription.findUnique({
    where: {
      id: prescriptionId,
    },
    select: {
      id: true,
      shareToken: true,
      shareTokenExpiresAt: true,
    },
  });

  if (!prescription) {
    return null;
  }

  const now = new Date();

  if (
    prescription.shareToken &&
    prescription.shareTokenExpiresAt &&
    prescription.shareTokenExpiresAt > now
  ) {
    return prescription.shareToken;
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);

  const updated = await prisma.prescription.update({
    where: {
      id: prescriptionId,
    },
    data: {
      shareToken: token,
      shareTokenCreatedAt: now,
      shareTokenExpiresAt: expiresAt,
    },
    select: {
      shareToken: true,
    },
  });

  const currentAdmin = await getCurrentAdmin();

  await recordAuditLog({
    adminId: currentAdmin?.id ?? null,
    actorEmail: currentAdmin?.email ?? "system@drmehta-demo.local",
    action: "PRESCRIPTION_SHARE_TOKEN_CREATED",
    entityType: "Prescription",
    entityId: prescriptionId,
    details: `Generated share link for prescription ${prescriptionId}`,
  });

  return updated.shareToken;
}

export async function getPublicPrescriptionByToken(token: string) {
  const now = new Date();

  const prescription = await prisma.prescription.findUnique({
    where: {
      shareToken: token,
    },
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
    return null;
  }

  if (
    !prescription.shareTokenExpiresAt ||
    prescription.shareTokenExpiresAt <= now
  ) {
    return null;
  }

  return prescription;
}

export async function createPrescription(
  appointmentId: string,
  items: unknown,
) {
  const parsed = createPrescriptionSchema.safeParse({
    appointmentId,
    items,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please complete all prescription fields correctly.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: parsed.data.appointmentId,
      },
      select: {
        id: true,
        patientId: true,
        status: true,
        prescription: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!appointment) {
      return {
        success: false,
        message: "Appointment not found.",
      };
    }

    if (appointment.prescription) {
      return {
        success: false,
        message: "This appointment already has a prescription.",
      };
    }

    if (appointment.status === "CANCELLED") {
      return {
        success: false,
        message:
          "A prescription cannot be created for a cancelled appointment.",
      };
    }

    const admin = await getDemoAdmin();

    const prescription = await prisma.prescription.create({
      data: {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        adminId: admin.id,
        items: {
          create: parsed.data.items.map((item) => ({
            medication: item.medication,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            instructions: item.instructions || null,
          })),
        },
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      actorEmail: admin.email,
      action: "PRESCRIPTION_CREATED",
      entityType: "Prescription",
      entityId: prescription.id,
      details: `Appointment: ${appointment.id} | Items: ${parsed.data.items.length}`,
    });

    const shareToken = await ensurePrescriptionShareToken(prescription.id);

    revalidatePath("/admin");
    revalidatePath("/admin/appointments");
    revalidatePath(`/admin/appointments/${appointment.id}`);
    revalidatePath("/admin/patients");
    revalidatePath(`/admin/patients/${appointment.patientId}`);
    revalidatePath("/admin/prescriptions");
    revalidatePath(`/admin/prescriptions/${prescription.id}`);

    return {
      success: true,
      message: "Prescription created successfully.",
      id: prescription.id,
      shareToken,
    };
  } catch (error) {
    console.error("Failed to create prescription:", error);

    return {
      success: false,
      message: "Unable to create the prescription.",
    };
  }
}
