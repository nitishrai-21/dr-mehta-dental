# Dr. Mehta Dental

A premium dental clinic website and admin workflow demo built with Next.js, TypeScript, Prisma, and PostgreSQL.

The project combines a polished public-facing clinic brand with a working internal workflow for appointment intake, patient tracking, prescription generation, and operational auditing.

## What is currently implemented

- Premium dental landing page and conversion-focused sections
- Appointment request form with server-side validation and database persistence
- Protected `/admin/*` access for staff users
- Role-based admin login with `ADMIN` and `RECEPTION`
- Patient, appointment, and prescription management screens
- Secure public prescription links without login
- Printable patient prescription page with PDF export
- Runtime audit logging for key actions
- Public clinic assistant using the Google Gemini API
- Centralized clinic facts and pricing data in `src/lib/clinic-data.ts`

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
- custom signed-cookie auth
- Google Gemini REST API

## Project structure

```text
.
├── AGENTS.md
├── BACKEND_ROADMAP.md
├── CLAUDE.md
├── env.sample
├── middleware.ts
├── next.config.ts
├── package.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── images/
├── scripts/
│   └── ensure-audit-log-table.mjs
├── src/
│   ├── app/
│   │   ├── actions/
│   │   ├── admin/
│   │   ├── api/assistant/route.ts
│   │   ├── appointments/
│   │   ├── prescriptions/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── dental/
│   │   └── ui/
│   ├── generated/prisma/
│   ├── lib/
│   │   ├── audit.ts
│   │   ├── auth.ts
│   │   ├── clinic-data.ts
│   │   ├── db/prisma.ts
│   │   └── validations/appointment.ts
│   └── ...
├── README.md
└── .env
```

## Environment variables

Use a local `.env` file with the required values:

```bash
DATABASE_URL="..."
GEMINI_API_KEY="..."
AUTH_SECRET="..."  # or NEXTAUTH_SECRET
NODE_ENV="development"
PORT=3000
```

Notes:

- `DATABASE_URL` is required for Prisma and persistence.
- `GEMINI_API_KEY` is required for the public clinic assistant.
- `AUTH_SECRET` is used by the signed-cookie auth flow in `src/lib/auth.ts`.
- Do not commit production secrets.

## Local setup

```bash
npm install
npx prisma generate
npm run dev
```

If the audit log table is missing or drifted, run:

```bash
npm run db:ensure-audit
```

For schema changes or a fresh local migration cycle:

```bash
npx prisma migrate dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:ensure-audit
```

## Demo credentials

The seed data creates two demo staff accounts:

- Admin: `admin@drmehta-demo.local` / `DrMehta123!`
- Reception: `reception@drmehta-demo.local` / `Reception123!`

These are intended for local review and demo use only, not production.

## Public clinic assistant

The assistant is implemented in:

- `src/app/api/assistant/route.ts`
- `src/components/dental/clinic-assistant.tsx`
- `src/lib/clinic-data.ts`

### Current behavior

- clinic facts and pricing are centralized in `src/lib/clinic-data.ts`
- the server prompt is built from the verified clinic record
- the assistant supports inline instant FAQ responses for common questions
- the endpoint validates payloads with Zod and limits message history
- a basic in-memory per-IP rate limiter is present
- the assistant is intentionally limited to non-clinical clinic logistics

### Guardrails

- `GEMINI_API_KEY` must stay server-side
- do not send personal or medical details to the assistant
- do not diagnose or prescribe treatment
- direct urgent concerns to the clinic or local emergency services

## Auth and admin workflow

The admin auth flow is implemented in `src/lib/auth.ts` and route protection is enforced by `middleware.ts`.

Current behavior:

- `ADMIN` and `RECEPTION` roles exist in the schema
- password hashes are stored in the `admins` table using PBKDF2
- signed session cookies protect `/admin/*` routes
- unauthenticated visitors are redirected to `/admin/login`
- server-side checks restrict sensitive actions such as audit access and prescription creation

## Data model highlights

The Prisma model includes:

- `Admin`
- `Patient`
- `Appointment`
- `Prescription`
- `PrescriptionItem`
- `AuditLog`

Appointment states include:

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

Prescription sharing uses a secure token and a public patient-facing route without login.

## Future hardening notes

This is a working demo/prototype and still intentionally not a production clinic system.

Planned improvements include:

- replacing seeded demo staff accounts with a real staff-management flow
- stronger session expiry and secret handling
- shared rate limiting for the public assistant
- more explicit environment separation and deployment checks
- tighter privacy and audit review across admin actions

The project is most useful as a realistic clinic workflow demo with a premium public brand and a working internal operations layer.
