# Dr. Mehta Dental — AGENTS.md

## Project snapshot

This repository is a dental clinic marketing site and working admin workflow demo built with Next.js, TypeScript, Prisma, and PostgreSQL.

The app currently includes:

- premium public dental website
- appointment intake flow with database persistence
- protected `/admin/*` routes
- role-based login for `ADMIN` and `RECEPTION`
- patient and appointment management screens
- prescription creation and public share links
- patient-facing prescription view/download page
- audit logging for key workflow actions
- public clinic assistant powered by the Gemini API
- centralized clinic facts and pricing in `src/lib/clinic-data.ts`

This project is best understood as a realistic demo/portfolio product, not a production clinic system.

---

## Runtime reality check

The current implementation reflects the actual repo state:

- `src/app/api/assistant/route.ts` uses the Google Gemini REST API and reads `GEMINI_API_KEY` from the server environment.
- `src/lib/clinic-data.ts` centralizes the clinic brand, pricing, appointment info, and service details used by the assistant and public pages.
- `src/lib/auth.ts` uses a custom signed-cookie session system with HMAC validation and PBKDF2 password hashing.
- `middleware.ts` guards the `/admin` tree by checking the `dm_admin_session` cookie.
- `src/app/actions/auth.ts` seeds and validates default demo staff accounts.
- `src/lib/audit.ts` centralizes safe audit log access for patient, appointment, and prescription pages.

---

## Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS v4
- `lucide-react`
- `embla-carousel-react`
- `jspdf`

### Backend

- Prisma 7
- PostgreSQL
- Server actions
- Zod validation
- custom signed-cookie authentication
- Gemini API for the public clinic assistant

### Developer tooling

- ESLint
- Prisma migrations
- Next.js production build checks
- `scripts/ensure-audit-log-table.mjs` during local startup

---

## Important implementation notes

### 1. Public assistant and clinic data

The public assistant is intentionally limited to clinic logistics and does not query Prisma or patient data.

Relevant files:

- `src/app/api/assistant/route.ts`
- `src/lib/clinic-data.ts`
- `src/components/dental/clinic-assistant.tsx`

Important details:

- clinic facts, pricing, and service metadata are centralized in `src/lib/clinic-data.ts`
- the endpoint builds a system prompt from that verified clinic data
- common questions can return a fast, local response before calling Gemini
- response generation is restricted to approved clinic facts only
- the assistant should not diagnose, prescribe, or examine personal health information
- the app currently expects `GEMINI_API_KEY` and not `OPENAI_API_KEY`

### 2. Admin auth

The actual auth flow is custom and database-backed.

Relevant files:

- `src/lib/auth.ts`
- `src/app/actions/auth.ts`
- `middleware.ts`

Current behavior:

- demo users are created by `ensureDefaultAdminUsers()`
- seeded accounts include `ADMIN` and `RECEPTION`
- passwords are stored using PBKDF2 hashing
- session cookies are signed with a secret-based HMAC pattern
- middleware blocks unauthenticated access to `/admin/*`
- server-side checks restrict admin-only actions and sensitive routes

### 3. Prescription and audit workflow

Prescription creation, public share tokens, and workflow audit logging are implemented as real features.

Relevant files:

- `src/app/actions/prescriptions.ts`
- `src/app/prescriptions/[token]/page.tsx`
- `src/lib/audit.ts`
- `src/app/admin/prescriptions/**`

Current implementation details:

- prescriptions can generate share tokens
- public prescription pages render without login
- invalid or expired tokens are rejected
- the patient-facing page includes downloadable PDF output
- admin detail pages render audit panels and centralized log views

### 4. Data model

The Prisma schema in `prisma/schema.prisma` includes:

- `Admin`
- `Patient`
- `Appointment`
- `Prescription`
- `PrescriptionItem`
- `AuditLog`

Core appointment states are:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

---

## Current status

### Completed in code

- public dental landing page and conversion sections
- appointment intake workflow
- admin login and protected `/admin` access
- `ADMIN` and `RECEPTION` role model
- patient and appointment management screens
- prescription creation and patient share flow
- audit logs and detail-page history panels
- PDF export for patient prescriptions
- clinic data / pricing centralization for public assistant and site content
- production build remains in a healthy state for the current route set

### Still intentionally demo-grade

- custom auth is not a hardened production auth service
- demo staff accounts are seeded directly in the database
- public assistant rate limiting is process-local only
- secrets and staff management are intentionally lightweight for a demo project

---

## Environment and secrets

Required env keys for the current app:

```bash
DATABASE_URL="..."
GEMINI_API_KEY="..."
AUTH_SECRET="..."  # or NEXTAUTH_SECRET
NODE_ENV="development"
PORT=3000
```

The project intentionally keeps provider keys and application secrets on the server side.

---

## Demo credentials

Current seeded local credentials:

- `admin@drmehta-demo.local` / `DrMehta123!`
- `reception@drmehta-demo.local` / `Reception123!`

These are for local review and should be replaced with real staff accounts before any non-demo deployment.

---

## Rules for future work

- keep the public branding premium and believable
- do not expose patient data publicly
- keep the clinic assistant informational and non-clinical
- respect the current route structure and server/client boundaries
- preserve the working auth, prescription, and audit flow when adding features
- prefer incremental hardening over broad rewrites

The project should continue to evolve as a realistic clinic workflow demo with a premium public brand, useful staff tools, and secure patient-facing prescription access.
