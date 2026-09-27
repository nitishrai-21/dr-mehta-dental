import {
  createHmac,
  pbkdf2Sync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

type AuthSession = {
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
};

const SESSION_COOKIE_NAME = "dm_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LENGTH = 32;

export function getAdminCredentials() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@drmehta-demo.local").trim();
  const password = (process.env.ADMIN_PASSWORD ?? "DrMehta123!").trim();

  return {
    email: email.toLowerCase(),
    password,
  };
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

  if (!session || Date.now() > session.exp || session.role !== "ADMIN") {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: session.email,
    },
  });

  if (admin && admin.role !== "ADMIN") {
    return null;
  }

  if (admin) {
    return admin;
  }

  const seededAdmin = await prisma.admin.upsert({
    where: {
      email: session.email,
    },
    update: {
      name: session.name,
      role: "ADMIN",
    },
    create: {
      name: session.name,
      email: session.email,
      role: "ADMIN",
    },
  });

  return seededAdmin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin || admin.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return admin;
}

export async function setAdminSession(
  email: string,
  name: string,
  role = "ADMIN",
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
