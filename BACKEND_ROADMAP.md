# Dr. Mehta Dental — Backend & Admin Workflow Roadmap

## Overview

This document defines the current project phase: secure doctor/admin login, protected clinic operations, appointment review, prescription creation, and patient-accessible prescription pages without requiring a login.

The current project contains a solid foundation for:

- a public website
- Prisma models for patients, appointments, prescriptions, and admins
- appointment creation from the public form
- an admin dashboard shell and listing pages
- a functional demo login flow with protected admin routes
- patient-safe prescription sharing via unique token URLs

The app is now beyond a static prototype and is functioning as a real product-style workflow demo with a clear next step toward production hardening.

---

## Current Progress

### Public website and product polish

The app includes:

- premium clinic landing-page design
- trust indicators and service sections
- testimonials and CTA flows
- a developer-style skills showcase to present engineering value to clients

This makes the public-facing site feel more like a genuine business website and less like a demo-only mockup.

### Auth flow status

The app now includes:

- a login page at /admin/login
- middleware-based route protection for admin pages
- a cookie-based session for authenticated admins
- logout from the admin UI
- dashboard shell hidden when visiting the login screen
- working protected admin pages for appointments, patients, and prescription records

This is a working demo-grade implementation and is significantly closer to a real clinic workflow than the initial static admin shell.

### Route and UI status

The app also now includes:

- restored /admin/appointments and /admin/appointments/[id] routes
- patient and prescription admin list pages
- admin prescription detail view with secure share-link generation
- copy/open patient share-link controls from the prescription detail page
- pagination on large list views to limit load time and reduce heavy server queries
- successful production build verification after route, auth, and prescription-share fixes
- a public prescription view route for secure no-login access

### Prescription sharing status

A key milestone is now complete:

- prescriptions can generate a share token
- the token is stored and reused when valid
- a public URL can resolve the prescription record without login
- the public page includes a premium PDF export action instead of a plain-text download
- the patient-facing prescription view is print-friendly and better structured for export
- the PDF is branded with a luxury dental clinic letterhead, patient details, medication table, and professional footer
- token expiry is enforced before a prescription route is considered valid

This gives the project a practical patient-access model without redirecting patients into a login flow.

### Audit trail status

The project now includes a lightweight operational audit trail:

- appointment creation events are recorded for patient intake actions
- appointment status updates are logged with the actor and updated status
- prescription creation and share-link generation are recorded in the database
- logs are stored for traceability and operational review
- patient, appointment, and prescription detail pages each render their own audit panels
- the admin dashboard includes a centralized audit log page with entity filters and date-range filtering

This adds a meaningful layer of credibility for a client-facing workflow demo and lays the foundation for a more serious clinic operations system.

### Runtime safety and build verification

A real runtime issue was identified and fixed during the audit-trail implementation:

- root cause: direct Prisma model access (`prisma.auditLog.findMany`) could be undefined in the runtime client instance
- fix: centralized safe access through a guarded audit helper and fallback behavior for missing model delegates
- impact: the admin detail pages no longer crash when audit records are requested
- verification: the project currently builds successfully with `npm run build` and the audit pages are included in the app route set

This is now considered a stable client-demo baseline for the audit and prescription workflow.

### Remaining auth work

- replace env-based fallback credentials with a more explicit admin bootstrap / user management process
- add role checks for admin-only pages
- add logout/session expiry cleanup and stronger session validation
- improve production-ready security and environment config
- enforce a clear separation between seeded demo admin data and real production identities

### Auth hardening update

The project has now advanced to a more secure interim state:

- `Admin.passwordHash` is part of the schema
- admin login validates against a PBKDF2-hashed password value in the database
- the migration for the password-hash field has been created and applied
- protected admin routes now behave as a signed-in-only guard, while server-side session validation enforces `ADMIN` role access
- the middleware remains Edge-compatible and avoids Node-only crypto to keep the project build-safe in Next.js app routing
- the app still keeps a safe demo fallback for the default admin account while moving toward true database-backed identities

This is a meaningful production-readiness improvement, and the app now has both route protection and server-side role checks in place. The remaining work is formal staff/admin role management, stronger session lifecycle controls, and production auth hardening.

### Current milestone achieved

The project has reached the following milestone:

- admin login works with a hashed, DB-backed credential path
- protected admin routes are enforced by middleware and server-side session validation
- dashboard shell does not render on the login screen
- session cookies allow signed-in admin access to secure pages
- non-admin or invalid session values are rejected at the auth layer
- core admin list pages are functioning and paginated
- secure public prescription access works without login
- the admin prescription detail page includes copy/open share-link controls for patient access
- key clinician and workflow actions are recorded in the audit log
- the patient, appointment, and prescription detail pages display audit history
- an admin-wide audit log page provides grouped filtering and recent activity review
- the prescription view is print-friendly and cleaner for export/download use
- the patient-facing PDF export is now polished as a luxury clinic letterhead document with premium styling
- the app builds cleanly with the current route set and Edge-safe middleware
- the admin password-hash migration has been applied successfully
- the audit-log runtime crash was fixed and verified via a fresh production build

This milestone should be treated as a strong foundation for the next security hardening pass.

---

## Product Goal

The application should support two main user groups:

1. Doctor / clinic staff
   - can securely log in to the admin dashboard
   - can review appointment requests
   - can update appointment status
   - can create prescriptions
   - can manage patient records and treatment history

2. Patients
   - can submit appointment requests
   - can receive a secure link to view a prescription without needing to log in
   - can access a clear, privacy-conscious prescription page
   - can download the prescription details in a simple format

The admin experience should feel practical and safe, while the patient-facing prescription access should remain minimal and secure.

---

## Core Principles

### 1. Security first

- admin routes must be protected
- no patient data should be publicly exposed
- sensitive read/write actions must be server-only
- access tokens must expire and be short-lived by design
- admin credentials must be stored in environment variables or a secure secret store

### 2. Real workflow over demo-only flow

The app should support realistic clinic operations, not just static mock views.

### 3. Minimal but functional MVP

The current backend phase focuses on:

- secure admin login
- protected admin dashboard
- appointment review flow
- prescription creation
- secure patient prescription access

### 4. Maintain separation of concerns

Keep the public site, admin site, server actions, validation, and database access distinct and testable.

---

## Recommended Authentication Approach

### Preferred option: NextAuth.js

This is the easiest and most maintainable path for a Next.js app.

Recommended setup:

- Credentials provider for doctor login
- JWT or database sessions
- middleware for route protection
- secure cookie configuration
- role checking for admin routes

This remains the right next step for production hardening, but the current implementation already has a working demo flow and protected admin layout as a strong base.

### Alternative option: custom session system

Use this only if the project needs a simpler or more controlled setup.

A custom system may be acceptable for a demo, but it is generally less maintainable than NextAuth for a production-like workflow.

### Current state of auth implementation

The project currently uses a custom cookie-based demo auth flow rather than a hardened production auth library. This is intentional for the current phase, but it should be replaced with a more durable approach before real clinic use.

---

## Auth Architecture

### Admin user model

Use the existing Prisma `Admin` model as the base for login identities.

Suggested fields:

- id
- name
- email
- passwordHash
- createdAt
- updatedAt

If this is a real production feature, add:

- role
- isActive
- lastLoginAt

### Credentials flow

1. Doctor enters email and password
2. Auth system validates credentials against the `Admin` table
3. Server creates a secure session
4. Protected routes verify an authenticated admin session
5. Session is checked before rendering admin pages or running actions

### Middleware requirements

Use Next.js middleware or route guards to protect:

- /admin
- /admin/appointments
- /admin/patients
- /admin/prescriptions
- /admin/\*

Unauthenticated users should be redirected to a login page.

---

## Admin Dashboard Requirements

The admin dashboard must behave like a clinic operations view.

### Must-have pages

- dashboard overview
- appointments list
- appointment detail view
- patient list
- patient detail view
- prescription creation page
- prescription detail page with share-link generation

### Appointment features

- view all appointment requests
- filter by status
- filter by date
- search by patient name or phone
- update status between:
  - PENDING
  - CONFIRMED
  - CANCELLED
  - COMPLETED
- view patient details from the appointment

### Dashboard metrics

- total appointments today
- pending count
- confirmed count
- new patients today
- recent requests list

---

## Prescription Workflow

This is a key product workflow and is now partly implemented.

### Goal

A logged-in doctor should be able to create a prescription tied to a specific appointment and patient, and share a secure public link when needed.

### Data model flow

A prescription should be created from:

- patient
- appointment
- admin / doctor
- medication list and instructions

The existing Prisma schema already supports this foundation:

- `Prescription`
- `PrescriptionItem`
- relation to `Patient`
- relation to `Appointment`
- relation to `Admin`

### Prescription creation fields

For each prescription:

- patient name / patient record
- appointment reference
- issue date
- one or more medication items
- dosage
- frequency
- duration
- special instructions

### Current implementation status

The project already supports:

- creating a prescription from an appointment
- storing medication rows in the database
- generating a share token
- exposing a public no-login read-only prescription page
- downloading the prescription in a simple text format

### Future prescription work

The following requirements remain for a more complete workflow:

- PDF / printable export for the doctor and patient
- stronger patient privacy controls
- better public link management and revocation
- improved prescriptions list UX and detail interactions

---

## Next Priorities

### Priority 1: Harden admin auth

Move from the current demo-only flow to a more production-safe system.

Recommended approach:

- store hashed passwords in the `Admin` model
- create real admin records instead of relying on env fallback values
- verify role-based access for staff vs admin-only views
- keep the login screen isolated from the dashboard shell

### Priority 2: Upgrade production safety

- secure environment variables
- validation on every admin action
- error handling and user feedback
- production-friendly database configuration
- deployment readiness

### Priority 3: Final product polish

- improved notifications
- richer prescription export tools
- refined patient-sharing UX
- broader workflow automation and reporting

---

## Final Guidance for Future Agents

When continuing this project:

- prefer incremental, realistic improvements
- maintain the premium dental brand identity
- keep the public website polished and responsive
- treat the admin/backend as a functional clinic workflow, not only a mockup
- implement auth and data access carefully
- ensure every new feature supports the user story: doctor dashboard + patient access to prescription information
- keep the project positioned as both a business workflow and a capable freelance delivery

The overall objective is a realistic dental clinic app that combines a strong public-facing brand with a useful backend workflow for practice management.

Each `PrescriptionItem` should include:

- medication
- dosage
- frequency
- duration
- instructions (optional)

### Prescription creation flow

1. Doctor opens appointment details
2. Doctor clicks "Create prescription"
3. System loads patient + appointment context
4. Doctor fills medication list
5. Server validates input
6. Server creates `Prescription` and related `PrescriptionItem` records
7. Revalidate relevant admin routes
8. Prescription is saved and shown in the admin UI

---

## Patient Prescription Access Without Login

This should be implemented carefully and securely.

### Requirements

A patient must be able to access their prescription without logging in, but only if they have a valid secure access link.

### Recommended approach

Use a secure, app-generated token or cryptographic reference.

For example:

- `prescriptionShareToken`
- unique, random, signed token
- token stored with the prescription record
- token expires after a chosen window (for example 30 or 90 days)
- route is public but restricted to valid tokens only

### Public route pattern

Example:

- /prescriptions/[token]

This route should:

- validate the token
- load the matching prescription record
- verify that the patient matches the prescription
- display the prescription in a read-only view
- optionally allow PDF export

### Security rules

- never expose more than the prescription and necessary patient info
- do not leak appointment history or unrelated records
- use signed tokens rather than plain IDs
- expire tokens automatically
- do not allow arbitrary user-generated ID access

---

## Recommended Data Additions

Depending on the planned final functionality, the schema may need additional fields for safety and usability.

### Admin auth additions

- passwordHash
- role
- isActive
- lastLoginAt

### Prescription public access additions

- shareToken
- tokenCreatedAt
- tokenExpiresAt
- isTokenActive

### Appointment workflow additions

- internal clinic notes
- reminder sent status
- lastUpdatedByAdminId

### Patient record additions

- date of birth (optional)
- preferred contact method
- notes

These should be added only when needed for real functioning, not prematurely.

---

## Server Action Design

The project already uses server actions for appointment creation and status changes. The new backend flow should continue in the same pattern.

### Suggested action files

- src/app/actions/auth.ts
- src/app/actions/admin.ts
- src/app/actions/prescriptions.ts

### Action responsibilities

- `signInAdmin()`
- `signOutAdmin()`
- `createPrescription()`
- `updateAppointmentStatus()`
- `getPrescriptionForPublicToken()`
- `createPrescriptionShareLink()`

All write actions should be server-only and protected by admin session checks.

---

## Routing Structure

Suggested route map:

```text
src/app/
├── admin/
│   ├── login/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── appointments/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── patients/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── prescriptions/
│       ├── page.tsx
│       └── new/page.tsx
├── prescriptions/
│   └── [token]/page.tsx
└── api/
    └── auth/
```

---

## Suggested Implementation Phases

### Phase 1: Admin authentication

Status: mostly complete in demo form, pending production hardening.

- set up NextAuth or a custom secure session system
- create admin login page
- protect admin routes
- store hashed admin passwords
- add redirect behavior for unauthenticated users
- move from env-based admin values to real database-backed admin identities

### Phase 2: Appointment operations

Status: complete for list/detail and status workflow in the current admin UI.

- build appointment detail pages
- filter and search
- update status actions
- appointment review workflow

### Phase 3: Prescription creation

Status: partially planned; listing and detail presence exist, but creation workflow still pending.

- doctor form for writing prescription items
- attach prescription to appointment and patient
- validate input and store records securely

### Phase 4: Secure prescription sharing

Status: not yet implemented.

- generate token for each prescription
- build public read-only prescription page
- optionally add PDF export or print-friendly view

### Phase 5: Hardening and production polish

- logging and error handling
- secure env validation
- permission model
- audit trail for admin actions
- deployment checks

---

## Security Checklist

Before moving into production, confirm all of the following:

- admin login is protected with hashed passwords
- session cookies are secure and HttpOnly
- admin routes redirect unauthenticated users
- public prescription pages use signed tokens
- prescription links cannot be guessed or enumerated easily
- server actions authorize only admin users
- patient data is never returned to unauthenticated users
- environment secrets are handled through secure config

---

## MVP Acceptance Criteria

The backend MVP is complete when all of the following work:

- a doctor can log in
- an unauthenticated user cannot access protected admin pages
- a doctor can view appointments and patients
- a doctor can change appointment status
- a doctor can create prescriptions tied to an appointment
- a patient can access a prescription via a secure link
- the prescription page displays only the correct information
- admin actions are server-side protected and validated

---

## Suggested Next Action

The fastest realistic sequence is:

1. add admin login and session protection
2. secure the admin dashboard routes
3. complete the appointment management flow
4. build prescription form and server action
5. add secure public prescription token route
6. polish with minimal PDF/export support

This order keeps the project moving without overbuilding the backend too early.

---

## Final Recommendation

The project should evolve toward a practical clinic system that supports:

- doctor/admin access for management
- patient appointment intake from the public site
- secure prescription issuance
- safe patient-friendly prescription viewing

This path matches the product intent and keeps the project aligned with the real-world dental clinic use case.
