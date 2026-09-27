"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  getAdminCredentials,
  hashPassword,
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
  const credentials = getAdminCredentials();

  if (email.toLowerCase() !== credentials.email) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const admin = await prisma.admin.upsert({
    where: {
      email: credentials.email,
    },
    update: {
      name: "Dr. Mehta",
      role: "ADMIN",
    },
    create: {
      name: "Dr. Mehta",
      email: credentials.email,
      role: "ADMIN",
      passwordHash: hashPassword(credentials.password),
    },
  });

  if (admin.role !== "ADMIN") {
    return {
      success: false,
      message: "Access denied.",
    };
  }

  const isPasswordValid = admin.passwordHash
    ? verifyPassword(password, admin.passwordHash)
    : password === credentials.password;

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  if (!admin.passwordHash) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash: hashPassword(credentials.password) },
    });
  }

  await setAdminSession(admin.email, admin.name, admin.role);
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
