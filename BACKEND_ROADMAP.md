# Dr. Mehta Dental — Backend & Admin Workflow Roadmap

## Overview

This project is a working dental clinic website and admin workflow demo. It mixes a premium public brand with a real internal workflow for appointments, patient management, prescription generation, and audit review.

The current codebase is already beyond a static mockup. It is best treated as a realistic demo/portfolio product with a clear path toward production hardening.

---

## Current status

### Public website

The public site is implemented and includes:

- premium clinic landing page
- hero section and CTA flow
- trust indicators and service sections
- testimonials and FAQs
- appointment request flow
- clinic contact and location details

### Appointment workflow

The appointment system is live and persisted in Prisma:

- patient lookup/upsert for new and existing people
- appointment creation with status tracking
- status values: `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- server-side validation before persistence

Relevant files:

- `src/app/actions/appointments.ts`
- `src/lib/validations/appointment.ts`
- `prisma/schema.prisma`

### Admin auth and role model

The app uses a custom DB-backed auth flow rather than a third-party auth library:

- `ADMIN` and `RECEPTION` roles exist in the schema
- hashed passwords are stored in `admins`
- signed session cookies protect `/admin/*`
- middleware redirects unauthenticated users to `/admin/login`
- server-side checks enforce role-aware access

Relevant files:

- `src/lib/auth.ts`
- `src/app/actions/auth.ts`
- `middleware.ts`

### Admin workflow pages

The admin features currently in the repo include:

- dashboard overview
- appointment list/detail views
- patient list/detail views
- prescription creation flow
- audit log pages and detail panels
- role-aware action restrictions

### Prescription sharing

The prescription flow is functional and patient-facing:

- prescriptions can generate share tokens
- tokens are validated and expire when appropriate
- a public route renders the prescription without login
- the page supports PDF export and print-friendly layout

Relevant files:

- `src/app/actions/prescriptions.ts`
- `src/app/prescriptions/[token]/page.tsx`
- `src/lib/audit.ts`

### Public clinic assistant

The public assistant is intentionally limited to clinic logistics and uses the Gemini API:

- server-side REST call to Gemini
- schema validation on incoming payloads
- central clinic facts in `src/lib/clinic-data.ts`
- fast local answers for common FAQ-style questions
- no Prisma or patient record access

Relevant files:

- `src/app/api/assistant/route.ts`
- `src/lib/clinic-data.ts`

---

## Verified implementation details

These are the actual facts reflected in the application codebase:

- the assistant expects `GEMINI_API_KEY`, not `OPENAI_API_KEY`
- the session cookie name is `dm_admin_session`
- the app uses a signed-cookie HMAC session flow and supports `AUTH_SECRET` / `NEXTAUTH_SECRET`
- the default demo staff accounts are generated in `src/lib/auth.ts`
- the app includes a dev-time audit log ensure script before startup
- the clinic assistant prompt uses data from `src/lib/clinic-data.ts`

---

## Near-term roadmap

### 1. Harden auth and secrets

- replace seeded demo credentials with a staff-management flow
- review and document expiry and rotation policy
- centralize secret management for deployment
- keep development secrets separate from production values

### 2. Improve assistant reliability

- replace process-local rate limiting with shared infrastructure
- document provider retention and operational limits
- keep AI restricted to clinic logistics and non-clinical guidance

### 3. Extend role-aware operations

- add real staff-user management for production-style admin flows
- tighten permission checks around sensitive actions
- ensure audit logging covers admin and workflow changes consistently

### 4. Production hardening

- validate schema drift and migration safety
- review privacy boundaries for patient and prescription data
- add deployment checks for environment configuration and runtime monitoring

---

## Recommended product direction

The best next milestone is not a rewrite. It is a hardening pass on the system that already works:

1. keep the public dental experience premium and polished
2. keep the admin workflow realistic and role-aware
3. strengthen secrets, sessions, and deployment configuration
4. expand operational controls only after privacy and audit boundaries are in place

This keeps the project in the sweet spot between a strong client-facing clinic website and a usable internal workflow prototype, without pretending it is fully production-grade yet.

---

## Suggested next priorities

### Priority 1: auth hardening

- document and review session expiry policy
- replace demo credentials with explicit staff provisioning
- confirm every sensitive action is role-checked on the server

### Priority 2: assistant hardening

- keep the assistant informational and non-clinical
- move rate limiting to shared infrastructure before production use
- treat the clinic data file as the source of truth for pricing and facts

### Priority 3: operational polish

- improve reporting and admin filtering
- strengthen patient-link controls and access review
- expand audit visibility for workflow actions

The project should continue to evolve as a realistic clinic management demo, with a premium public brand, workable admin tooling, and secure patient-facing prescription access.
