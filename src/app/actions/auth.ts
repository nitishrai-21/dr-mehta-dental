"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  ensureDefaultAdminUsers,
  setAdminSession,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function loginAdmin(
  _previousState: { success: boolean; message: string } | undefined,
  formData: FormData,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldError = parsed.error.flatten().fieldErrors;
    const firstMessage =
      fieldError.email?.[0] ??
      fieldError.password?.[0] ??
      "Please check your credentials.";

    return {
      success: false,
      message: firstMessage,
    };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  await ensureDefaultAdminUsers();

  const admin = await prisma.admin.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!admin) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  if (admin.role !== "ADMIN" && admin.role !== "RECEPTION") {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  const isPasswordValid = admin.passwordHash
    ? verifyPassword(password, admin.passwordHash)
    : false;

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  await setAdminSession(admin.email, admin.name, admin.role);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
