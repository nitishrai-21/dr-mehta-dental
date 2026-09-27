# Dr. Mehta Dental — AGENTS.md

## Project Overview

Dr. Mehta Dental is a portfolio-style dental clinic website and small business management app built with Next.js, TypeScript, Prisma, and PostgreSQL. The project is designed to showcase a premium dental clinic brand while also supporting a practical admin workflow for appointment requests, patient tracking, and prescription management.

This application currently combines:

- a public-facing clinic website
- a stored appointment request flow
- an admin dashboard for clinic operations
- a Prisma data model for patients, appointments, prescriptions, and admin records
- secure prescription sharing for patients via a no-login access link

The project sits between a marketing website and a lightweight clinic management system, while also serving as a strong freelance portfolio example for a real business product.

---

## Business Goal

The product should feel like a modern, trustworthy dental practice with a calm and premium clinical identity. The public site should help patients understand the clinic, trust the service, and submit an appointment request. The admin side should allow the doctor or staff to review and manage incoming requests.

The project is intended to be:

- a freelance portfolio project
- a client demo for a local business website
- a clean foundation for future real clinic operations
- a proof point for strong product UX, backend thinking, and operational systems design

---

## Current Product Status

### Public website

The public marketing site is already in place and includes:

- navbar and navigation
- hero section with CTA buttons and image carousel
- trust indicators
- about/practice section
- skills showcase section highlighting engineering and product strengths
- testimonials carousel
- appointment form section
- FAQ section
- contact information
- footer

This part is polished and suitable for a premium dental-brand presentation.

### Admin workflow

The project contains a working admin area with pages for:

- dashboard overview
- appointment management
- patient listing
- patient detail flow
- prescription management
- prescription creation flow

The admin system is functional as a workflow demo, though it is still not a production-grade secure clinic system.

### Backend / database

The database layer is already integrated through Prisma and PostgreSQL. Current data models include:

- Admin
- Patient
- Appointment
- Prescription
- PrescriptionItem

The project stores appointment requests and supports status updates such as:

- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

The prescription model also supports secure share-token generation for patient access without login.

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS v4
- shadcn/ui / Base UI
- lucide-react
- Embla carousel
- next/image

### Backend

- Next.js server actions
- Prisma ORM 7
- PostgreSQL
- Zod validation

### Developer tooling

- ESLint
- TypeScript
- Prisma migrations
- production build validation via next build

---

## Repository Structure

```text
.
├── AGENTS.md
├── BACKEND_ROADMAP.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── prisma7.config.ts
├── README.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── images/
│       └── dental/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── appointments.ts
│   │   │   └── prescriptions.ts
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── appointments/
│   │   │   ├── login/
│   │   │   ├── patients/
│   │   │   └── prescriptions/
│   │   ├── appointments/
│   │   │   └── [id]/
│   │   ├── prescriptions/
│   │   │   └── [token]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── admin-header.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── appointment-filters.tsx
│   │   │   ├── appointment-search.tsx
│   │   │   ├── appointment-status-actions.tsx
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── patient-search.tsx
│   │   ├── dental/
│   │   │   ├── about-practice.tsx
│   │   │   ├── appointment-section.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── skills-showcase.tsx
│   │   │   ├── testimonials.tsx
│   │   │   └── trust-strip.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── carousel.tsx
│   │       └── sheet.tsx
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   ├── db/
│   │   │   └── prisma.ts
│   │   ├── utils.ts
│   │   └── validations/
│   │       └── appointment.ts
│   └── ...
```

---

## Key Functional Areas

### 1. Public website

The home page acts as the clinic landing page and remains polished, clean, and conversion-focused. It is meant to communicate trust and make patients feel comfortable booking a visit.

### 2. Appointment form

The appointment request is validated server-side and stored in the database. This currently uses:

- Zod validation
- Prisma patient creation/upsert logic
- Prisma appointment creation
- revalidatePath for admin refreshes

### 3. Admin dashboard

The admin dashboard queries live appointment and patient data and displays counts and recent activity. It is used to help the doctor manage the clinic workflow.

### 4. Patient and appointment records

The Prisma schema supports:

- patient profiles
- patient status (NEW/EXISTING)
- appointment dates and time
- treatment history
- appointment lifecycle states

### 5. Prescriptions

The schema contains a prescription domain with items, and the project now includes a secure public share flow for patients to access prescription details without logging in.

---

## Progress So Far

### Completed / in place

- [x] Dental clinic landing page design direction
- [x] Hero and carousel structure
- [x] Testimonials section
- [x] Skills showcase section for client-facing engineering credibility
- [x] Appointment form and server action
- [x] Prisma schema for patients, appointments, prescriptions, and admin records
- [x] Admin dashboard overview and clinic metrics
- [x] Appointment listing, filtering, search, and status updates
- [x] Patient listing and patient detail flow
- [x] Prescription creation workflow
- [x] Prescription listing and prescription detail route
- [x] Admin prescription detail page with secure share-link generation, copy, and open actions
- [x] Secure share-token generation for patient prescription access
- [x] Public prescription page for view/download without login
- [x] Database migration setup
- [x] Demo admin login flow with cookie-based session management
- [x] Protected admin routes via middleware
- [x] Login page isolated without admin shell chrome
- [x] Missing admin appointment routes restored and working
- [x] Pagination added to table/list-heavy pages to improve load speed
- [x] Audit log model and scoped activity panels added for patient, appointment, and prescription records
- [x] Central admin audit log page added with entity and date filters
- [x] Runtime Prisma audit log crash hardened with safe model access and safer query patterns
- [x] Patient prescription download was upgraded from plain text to a premium PDF export with clinic letterhead styling
- [x] Luxury prescription PDF includes a branded clinical layout, patient metadata, medication table, and footer details
- [x] Production build passes successfully after route, auth, audit, prescription-share, and premium export polish

### Current auth and role model

The project now uses a real database-backed auth model with two roles:

- [x] `ADMIN`: full access to dashboard, appointments, patients, audit logs, and prescription creation
- [x] `RECEPTION`: appointment and patient view permissions plus appointment status updates, but no prescription creation or admin-only audit access
- [x] PBKDF2 password hashing is applied to seeded admin accounts in the `admins` table
- [x] session cookies are signed and validated server-side using a secret-based HMAC pattern
- [x] middleware guards all `/admin/*` routes and redirects unauthenticated users to `/admin/login`
- [x] the admin layout and header now render the actual logged-in user name and initials instead of hardcoded values
- [x] the route loop bug caused by redirecting from the `/admin` layout itself was fixed
- [x] the app builds successfully without importing server-only `next/headers` code into client components

### Verified current state

The app is now in a strong client-demo phase with the following verified outcomes:

- admin dashboard and route protection are working
- both `ADMIN` and `RECEPTION` roles can sign in with database-backed credentials
- reception staff can update appointment status, while admin-only actions remain protected
- patient prescription access works without login using a secure share link
- audit activity is visible on patient, appointment, and prescription detail pages
- the central audit overview page is available from the admin sidebar
- the dashboard and header show the current authenticated user name and initials
- production build currently completes successfully with the latest auth and route set
- the project is ready for client-facing walkthroughs and demo iterations, while still remaining intentionally non-production-grade in its operational hardening

---

## Current Implementation Notes

### Auth flow

The project includes a working admin session flow with a safer credential model:

- a login page at /admin/login
- cookie-based session creation for authenticated admin users
- middleware to redirect unauthenticated access away from protected admin routes
- logout from the admin header/sidebar
- no admin sidebar or top bar on the standalone login screen
- hashed admin password verification using PBKDF2 via the `Admin.passwordHash` field
- Prisma migration for the admin password hash field has been created and applied

This is a meaningful step toward a production-style admin login flow, although role checks and stronger session policy still remain for the next hardening pass.

### Public prescription sharing flow

The patient share flow is now implemented and verified:

- prescription records can generate a secure share token
- tokens expire after a defined period
- a public route resolves the token and loads the prescription without login
- the page includes downloadable plain-text output for patients

This gives the project a practical patient access model without requiring an account or login.

### Current milestone status

The app is now beyond a static admin shell and into a working role-based admin workflow experience, with an additional patient-safe prescription access layer. The current milestone includes:

- login works through a hashed, DB-backed credential flow using the `admins` table
- protected admin routes are enforced by middleware plus server-side auth checks
- the dashboard shell does not render on the login screen
- signed session cookies allow authenticated users to access protected pages
- session validation rejects missing, expired, or role-mismatched users
- admin and reception accounts are both supported in the demo seed set
- core admin list pages are functioning and paginated
- reception users can update appointment status while admin-only features remain gated
- prescription records can be shared via a secure no-login URL from the admin detail view
- prescription share links can be copied and opened directly from the admin page
- key clinic actions are captured in an audit log for traceability
- prescription details are print-friendly and more polished for export/download flows
- the dashboard and header display the actual logged-in user's name and initials
- the app builds cleanly with the current route set and middleware/server boundary fixes

---

## Recommended Future Direction

The next proper phase of the project should be:

1. secure doctor login
2. protected admin dashboard
3. real appointment status management
4. prescription creation and sharing by doctor
5. patient prescription access using a secure share link
6. final polish and deployment preparation

This keeps the project aligned with the real-world use case while preserving the premium dental brand identity and freelance product value.

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

- admin login route is accessible and isolated
- unauthorized access to /admin routes is blocked
- successful login creates a session cookie
- authenticated users can access the admin dashboard
- unauthenticated users are redirected to the login page
- appointment admin pages render correctly
- prescriptions and patient lists are paginated to prevent heavy data loads

### Demo credentials

Current local demo credentials are:

- Admin: admin@drmehta-demo.local / DrMehta123!
- Reception: reception@drmehta-demo.local / Reception123!

These are intentionally suitable for development work and should be replaced with secure env-backed values before production use.

### Security status

The auth flow has been improved from the original env-only credential check to a hashed, database-backed admin verification flow. The project is still not fully production-safe, but it is materially more robust than the earlier demo-only setup.

The next refactor should continue with:

- secure role checks for admin-only pages
- stronger session handling and expiry policy review
- safer secret configuration and environment separation
- full admin user lifecycle management with explicit seeded prod accounts

### Performance status

The project has been updated so the larger table-based admin views use pagination instead of loading unlimited rows in a single request. This is especially important for the prescriptions, patients, and appointments lists as data grows.

---

## Next Steps

### Priority 1: Harden doctor login and admin auth

Move from the current demo-only flow to a more production-safe system.

Recommended approach:

- keep Next.js middleware or route guards for access control
- store hashed passwords in the Admin model
- create real admin records instead of using only env-based fallback values
- verify role-based access for staff vs admin-only views
- keep the login screen isolated from the dashboard shell

### Priority 2: Booking review workflow

Make the dashboard useful for real clinic operations:

- view all appointment requests
- filter by date/status
- confirm or cancel appointments
- track patient status over time

### Priority 3: Prescription workflow

Allow a logged-in doctor to generate a prescription tied to an appointment and patient. Include:

- patient selection
- medicine list
- dosage and instructions
- prescription issue date

### Priority 4: Patient prescription download without login

Allow an existing patient to access their prescribed treatment details without logging in. This likely means:

- a secure token or public prescription reference
- a readable prescription page
- optional PDF export
- no account needed for patients to view the prescription

This should be designed carefully to prevent exposing private records.

### Priority 5: Production hardening

- secure environment variables
- validation on every admin action
- error handling and user feedback
- production-friendly database configuration
- deployment readiness

---

## Important Product Rules

### 1. Keep the website premium and believable

The public-facing site should still feel like a modern dental practice, not a generic SaaS or startup template.

### 2. Respect the current architecture

Do not rewrite the project blindly. The current project already contains strong structure for:

- page-level components
- admin pages
- validation
- database models
- server actions

### 3. Be careful with auth and patient privacy

Doctor login and patient prescription download require thoughtful security. Do not expose patient information publicly.

### 4. Prefer a realistic workflow over fake demo-only logic

The system should evolve toward a real clinic workflow rather than staying purely static.

### 5. Preserve a clean separation of concerns

Keep the public marketing site, admin dashboard, validation, and database access distinct and maintainable.

---

## Recommended Future Direction

The next proper phase of the project should be:

1. secure doctor login
2. protected admin dashboard
3. real appointment status management
4. prescription creation by doctor
5. patient prescription access using a secure, shareable link
6. final polish and deployment

This keeps the project aligned with the real-world use case while preserving the current portfolio-friendly front-end quality.

---

## Final Guidance for Future Agents

When continuing this project:

- prefer incremental, realistic improvements
- maintain the premium dental brand identity
- keep the public website polished and responsive
- treat the admin/backend as a functional clinic workflow, not only a mockup
- implement auth and data access carefully
- ensure every new feature supports the user story: doctor dashboard + patient access to prescription information

The overall objective is a realistic dental clinic app that combines a strong public-facing brand with a useful backend workflow for practice management.
