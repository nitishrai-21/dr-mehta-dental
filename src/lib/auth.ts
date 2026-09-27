import {
  createHmac,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export type AdminRole = "ADMIN" | "RECEPTION";

type AuthSession = {
  email: string;
  name: string;
  role: AdminRole;
  iat: number;
  exp: number;
};

const SESSION_COOKIE_NAME = "dm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LENGTH = 32;

const DEFAULT_ADMIN_ACCOUNTS = [
  {
    email: "admin@drmehta-demo.local",
    name: "Dr. Mehta",
    role: "ADMIN",
    password: "DrMehta123!",
  },
  {
    email: "reception@drmehta-demo.local",
    name: "Reception Desk",
    role: "RECEPTION",
    password: "Reception123!",
  },
] as const;

export function getAdminCredentials() {
  return DEFAULT_ADMIN_ACCOUNTS.map((account) => ({
    email: account.email,
    name: account.name,
    role: account.role,
    password: account.password,
  }));
}

export function hasRequiredRole(
  currentRole: string | null,
  minimumRole: AdminRole,
) {
  if (!currentRole) {
    return false;
  }

  if (currentRole === "ADMIN") {
    return true;
  }

  return currentRole === "RECEPTION" && minimumRole === "RECEPTION";
}

export async function ensureDefaultAdminUsers() {
  for (const account of DEFAULT_ADMIN_ACCOUNTS) {
    await prisma.admin.upsert({
      where: {
        email: account.email,
      },
      update: {
        name: account.name,
        role: account.role,
        passwordHash: hashPassword(account.password),
      },
      create: {
        name: account.name,
        email: account.email,
        role: account.role,
        passwordHash: hashPassword(account.password),
      },
    });
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    "sha256",
  ).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string | null) {
  if (!storedHash) {
    return false;
  }

  const separatorIndex = storedHash.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  const salt = storedHash.slice(0, separatorIndex);
  const expectedHash = storedHash.slice(separatorIndex + 1);
  const candidateHash = pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEY_LENGTH,
    "sha256",
  ).toString("hex");

  const candidateBuffer = Buffer.from(candidateHash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "dr-mehta-dental-demo-secret-change-me"
  );
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

function decodeSession(raw: string): AuthSession | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(raw, "base64url").toString("utf8"),
    ) as AuthSession;

    if (
      !parsed.email ||
      !parsed.name ||
      !parsed.role ||
      !parsed.exp ||
      !parsed.iat
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  const [payloadPart, signaturePart] = sessionCookie.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  const expectedSignature = signPayload(payloadPart);
  const providedSignature = Buffer.from(signaturePart, "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  if (
    providedSignature.length !== expectedBuffer.length ||
    !timingSafeEqual(providedSignature, expectedBuffer)
  ) {
    return null;
  }

  const session = decodeSession(payloadPart);

  if (
    !session ||
    Date.now() > session.exp ||
    (session.role !== "ADMIN" && session.role !== "RECEPTION")
  ) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: session.email.toLowerCase(),
    },
  });

  if (!admin || admin.role !== session.role) {
    return null;
  }

  return admin;
}

export async function requireRole(requiredRole: AdminRole) {
  const admin = await getCurrentAdmin();

  if (!admin || !hasRequiredRole(admin.role, requiredRole)) {
    redirect("/admin/login");
  }

  return admin;
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function setAdminSession(
  email: string,
  name: string,
  role: AdminRole = "ADMIN",
) {
  const cookieStore = await cookies();
  const session: AuthSession = {
    email: email.toLowerCase(),
    name,
    role,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS,
  };

  const encodedSession = encodeSession(session);
  const signature = signPayload(encodedSession);

  cookieStore.set(SESSION_COOKIE_NAME, `${encodedSession}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
