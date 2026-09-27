import { z } from "zod";

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),

  phone: z.string().trim().min(7, "Please enter a valid phone number."),

  email: z.string().trim().email("Please enter a valid email address."),

  date: z.string().min(1, "Please select a preferred date."),

  time: z.enum(["morning", "afternoon", "evening"], {
    error: "Please select a preferred time.",
  }),

  service: z.string().min(1, "Please select a treatment."),

  patient: z.enum(["new", "existing"], {
    error: "Please select your patient status.",
  }),

  message: z
    .string()
    .trim()
    .max(1000, "Message must be 1000 characters or less.")
    .optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
